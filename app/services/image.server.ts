// app/services/image.server.ts
import { appConfig } from "../config/app.config";
import { sleep } from "../utils/misc";

interface FileCreateResponse {
    data?: {
        stagedUploadsCreate?: {
            stagedTargets: Array<{
                url: string;
                resourceUrl: string;
                parameters: Array<{
                    name: string;
                    value: string;
                }>;
            }>;
            userErrors: Array<{ field: string[]; message: string }>;
        };
        fileCreate?: {
            files: Array<{
                fileStatus: string;
                image?: { originalSrc: string; url: string };
                id?: string;
            }>;
            userErrors: Array<{ field: string[]; message: string }>;
        };
    };
    errors?: Array<{ message: string }>;
}

export async function uploadImageToShopify(base64ImageData: string, shopDomain: string, shopifyAdmin: any): Promise<string | null> {
    const { uploadRetries, retryDelayMs, maxSize } = appConfig.images;

    // console.log(`[Upload] Starting upload for shop: ${shopDomain}`);

    try {
        const admin = shopifyAdmin;

        // Updated regex to support webp
        const matches = base64ImageData.match(/^data:(image\/(png|jpe?g|gif|webp));base64,(.+)$/i);
        if (!matches) {
            // console.error("[Upload] Image upload failed: Invalid base64 format");
            return null;
        }

        const contentType = matches[1];
        const fileExtension = matches[2] === 'jpeg' ? 'jpg' : matches[2]; // Normalize jpeg to jpg
        const imageData = matches[3];
        const imageBuffer = Buffer.from(imageData, 'base64');

        // console.log(`[Upload] Image details - Type: ${contentType}, Extension: ${fileExtension}, Size: ${imageBuffer.length} bytes`);

        if (imageBuffer.length > maxSize) {
            // console.error(`[Upload] Image upload failed: File size ${imageBuffer.length} exceeds max size ${maxSize}`);
            return null;
        }

        const filename = `review-image-${Date.now()}.${fileExtension}`;

        // 1. Request staged upload targets
        // console.log(`[Upload] Requesting staged upload target for ${filename}`);
        const stagedUploadsResponse = await admin.graphql(`
      mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
        stagedUploadsCreate(input: $input) {
          stagedTargets {
            url
            resourceUrl
            parameters {
              name
              value
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
            variables: {
                input: [{
                    filename,
                    mimeType: contentType,
                    resource: 'IMAGE', // Changed from FILE to IMAGE
                    fileSize: imageBuffer.length.toString(),
                }]
            }
        });

        const stagedUploadsResult = await stagedUploadsResponse.json() as FileCreateResponse;

        if (stagedUploadsResult.errors) {
            // console.error("[Upload] GraphQL errors in stagedUploadsCreate:", JSON.stringify(stagedUploadsResult.errors));
        }

        if (stagedUploadsResult.data?.stagedUploadsCreate?.userErrors?.length) {
            // console.error("[Upload] User errors in stagedUploadsCreate:", JSON.stringify(stagedUploadsResult.data?.stagedUploadsCreate?.userErrors));
        }

        const target = stagedUploadsResult.data?.stagedUploadsCreate?.stagedTargets[0];

        if (!target) {
            // console.error("[Upload] Image upload failed: Could not create staged upload target");
            return null;
        }

        // console.log(`[Upload] Staged target created. URL: ${target.url}`);

        // 2. Upload the image buffer to the provided URL
        const isSignedUrl = target.url.includes('?');

        if (isSignedUrl) {
            // console.log(`[Upload] Uploading to signed URL (PUT)`);
            const uploadResponse = await fetch(target.url, {
                method: 'PUT',
                body: imageBuffer,
                headers: {
                    'Content-Type': contentType,
                },
            });

            if (!uploadResponse.ok) {
                // const errorText = await uploadResponse.text();
                // console.error(`[Upload] Image upload failed: Could not upload to staged target (PUT). Status: ${uploadResponse.status}, Error: ${errorText}`);
                return null;
            }
        } else {
            // console.log(`[Upload] Uploading to staged target (POST)`);
            const formData = new FormData();

            target.parameters.forEach(({ name, value }) => {
                formData.append(name, value);
            });

            const blob = new Blob([imageBuffer], { type: contentType });
            formData.append('file', blob, filename);

            const uploadResponse = await fetch(target.url, {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                // const errorText = await uploadResponse.text();
                // console.error(`[Upload] Image upload failed: Could not upload to staged target (POST). Status: ${uploadResponse.status}, Error: ${errorText}`);
                return null;
            }
        }

        // console.log(`[Upload] File uploaded to target successfully.`);

        // 3. Create the file in Shopify
        // console.log(`[Upload] Creating file in Shopify with resourceUrl: ${target.resourceUrl}`);
        const fileCreateResponse = await admin.graphql(`
      mutation fileCreate($files: [FileCreateInput!]!) {
        fileCreate(files: $files) {
          files {
            id
            fileStatus
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
            variables: {
                files: [{
                    alt: "Review Image",
                    contentType: 'IMAGE',
                    originalSource: target.resourceUrl,
                }]
            }
        });

        const fileCreateResult = await fileCreateResponse.json() as FileCreateResponse;

        if (fileCreateResult.data?.fileCreate?.userErrors?.length) {
            // console.error("[Upload] User errors in fileCreate:", JSON.stringify(fileCreateResult.data?.fileCreate?.userErrors));
        }

        const file = fileCreateResult.data?.fileCreate?.files[0];

        if (!file || !file.id) {
            // console.error("[Upload] Image upload failed: Could not create file in Shopify");
            return null;
        }

        // console.log(`[Upload] File created in Shopify. ID: ${file.id}, Initial Status: ${file.fileStatus}`);

        // 4. Poll for the file status
        for (let i = 0; i < uploadRetries; i++) {
            await sleep(retryDelayMs);

            const fileStatusResponse = await admin.graphql(`
        query getFileStatus($id: ID!) {
          node(id: $id) {
            ... on GenericFile {
              fileStatus
              url
            }
            ... on MediaImage {
              fileStatus
              image {
                originalSrc
                url
              }
            }
          }
        }
      `, {
                variables: { id: file.id }
            });

            const statusResult = await fileStatusResponse.json() as { data?: { node?: { fileStatus: string, image?: { originalSrc: string, url: string }, url?: string } }, errors?: any[] };

            if (statusResult.errors?.length) {
                // console.error("[Upload] Image upload failed: Error polling file status", JSON.stringify(statusResult.errors));
                break;
            }

            const updatedFile = statusResult.data?.node;
            // console.log(`[Upload] Polling attempt ${i + 1}/${uploadRetries}. Status: ${updatedFile?.fileStatus}`);

            if (updatedFile && updatedFile.fileStatus === 'READY') {
                const finalUrl = updatedFile.image?.originalSrc || updatedFile.url || null;
                // console.log(`[Upload] File is READY. URL: ${finalUrl}`);
                return finalUrl;
            } else if (updatedFile && (updatedFile.fileStatus === 'FAILED' || updatedFile.fileStatus === 'ERROR')) {
                // console.error("[Upload] Image upload failed: File status is FAILED or ERROR");
                return null;
            }
        }

        // console.error("[Upload] Image upload failed: Polling timed out");
        return null;

    } catch (error: any) {
        // console.error("[Upload] Image upload failed: Unexpected error", error);
        return null;
    }
}
