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


    try {
        const admin = shopifyAdmin;

        // Updated regex to support webp
        const matches = base64ImageData.match(/^data:(image\/(png|jpe?g|gif|webp));base64,(.+)$/i);
        if (!matches) {
            return null;
        }

        const contentType = matches[1];
        const fileExtension = matches[2] === 'jpeg' ? 'jpg' : matches[2]; // Normalize jpeg to jpg
        const imageData = matches[3];
        const imageBuffer = Buffer.from(imageData, 'base64');


        if (imageBuffer.length > maxSize) {
            return null;
        }

        const filename = `review-image-${Date.now()}.${fileExtension}`;

        // 1. Request staged upload targets
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
        }

        if (stagedUploadsResult.data?.stagedUploadsCreate?.userErrors?.length) {
        }

        const target = stagedUploadsResult.data?.stagedUploadsCreate?.stagedTargets[0];

        if (!target) {
            return null;
        }


        // 2. Upload the image buffer to the provided URL
        const isSignedUrl = target.url.includes('?');

        if (isSignedUrl) {
            const uploadResponse = await fetch(target.url, {
                method: 'PUT',
                body: imageBuffer,
                headers: {
                    'Content-Type': contentType,
                },
            });

            if (!uploadResponse.ok) {
                // const errorText = await uploadResponse.text();
                return null;
            }
        } else {
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
                return null;
            }
        }


        // 3. Create the file in Shopify
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
        }

        const file = fileCreateResult.data?.fileCreate?.files[0];

        if (!file || !file.id) {
            return null;
        }


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
                break;
            }

            const updatedFile = statusResult.data?.node;

            if (updatedFile && updatedFile.fileStatus === 'READY') {
                const finalUrl = updatedFile.image?.originalSrc || updatedFile.url || null;
                return finalUrl;
            } else if (updatedFile && (updatedFile.fileStatus === 'FAILED' || updatedFile.fileStatus === 'ERROR')) {
                return null;
            }
        }

        return null;

    } catch (error: any) {
        return null;
    }
}
