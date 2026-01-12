import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import prisma from "../db.server";
import shopify from "../shopify.server";
import { appConfig } from "../config/app.config";
import { calculateAndUpdateProductMetafields } from "../utils/metafields.server";
import { uploadImageToShopify } from "../services/image.server";



export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method Not Allowed" }),
      { status: 405 }
    );
  }

  try {
    const requestBody = await request.json();
    let { productId, rating, author, content, email, title, images: base64Images } = requestBody;

    // Trim string fields
    author = author?.trim();
    content = content?.trim();
    email = email?.trim();
    title = title?.trim();

    if (!productId || !rating || !author || !content || !email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields (productId, rating, author, content, email)" }),
        { status: 400 }
      );
    }

    if (typeof productId === 'string' && productId.startsWith('gid://shopify/Product/')) {
      productId = productId.split('/').pop() || '';
    }

    if (!appConfig.validation.productIdRegex.test(productId)) {
      return new Response(
        JSON.stringify({ error: "Invalid Product ID format. Must be a numeric string or Shopify GID." }),
        { status: 400 }
      );
    }

    const parsedRating = parseInt(rating, 10);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return new Response(
        JSON.stringify({ error: "Invalid rating value. Must be a number between 1 and 5." }),
        { status: 400 }
      );
    }

    if (!appConfig.validation.emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format." }),
        { status: 400 }
      );
    }

    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount > appConfig.reviews.maxWordCount) {
      return new Response(
        JSON.stringify({ error: `Review content must be ${appConfig.reviews.maxWordCount} words or less.` }),
        { status: 400 }
      );
    }

    const url = new URL(request.url);
    const shopDomain = url.searchParams.get("shop");

    if (!shopDomain) {
      return new Response(
        JSON.stringify({ error: "Missing shop parameter" }),
        { status: 400 }
      );
    }

    const imagesToCreate: { url: string; altText?: string; order?: number }[] = [];
    const imagesToProcess = Array.isArray(base64Images) ? base64Images.slice(0, appConfig.images.maxCount) : [];

    if (imagesToProcess.length > 0) {
      const uploadPromises = imagesToProcess.map(async (base64Image, i) => {
        if (typeof base64Image === 'string') {
          const { admin } = await shopify.unauthenticated.admin(shopDomain);
          const imageUrl = await uploadImageToShopify(base64Image, shopDomain, admin);
          if (imageUrl) {
            return { url: imageUrl, altText: `Review image ${i + 1}`, order: i };
          }
        }
        return null;
      });

      const uploadedImages = await Promise.all(uploadPromises);
      uploadedImages.forEach(img => {
        if (img) imagesToCreate.push(img);
      });
    }

    const review = await (prisma.productReview as any).create({
      data: {
        shop: shopDomain,
        productId,
        rating: parsedRating,
        author,
        content,
        email: email,
        title: title || null,
        status: appConfig.reviews.status.PENDING,
        isBundleReview: false,
        images: {
          create: imagesToCreate,
        },
      },
      include: {
        images: {
          select: { id: true, url: true, altText: true, order: true }
        }
      }
    });

    try {
      const { admin } = await shopify.unauthenticated.admin(shopDomain);
      await calculateAndUpdateProductMetafields(productId, admin, shopDomain);
    } catch (metafieldError: any) {
      // console.error("Metafield update failed:", metafieldError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        review: {
          ...review,
          createdAt: review.createdAt.toISOString(),
          updatedAt: review.updatedAt.toISOString()
        },
        message: "Review submitted successfully"
      }),
      { status: 201 }
    );
  } catch (error: any) {
    // console.error("Action failed:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to submit review. Please try again."
      }),
      { status: 500 }
    );
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (request.method !== "GET") {
    return json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");
    let productId = url.searchParams.get("productId");

    if (!shop) {
      return json({ error: "Missing shop parameter" }, { status: 400 });
    }

    if (productId) {
      if (typeof productId === 'string' && productId.startsWith('gid://shopify/Product/')) {
        productId = productId.split('/').pop() || '';
      }

      const allApprovedReviews = await (prisma.productReview as any).findMany({
        where: {
          shop,
          productId,
          status: appConfig.reviews.status.APPROVED,
        },
        orderBy: [
          { rating: "desc" },
          { createdAt: "desc" }
        ],
        include: {
          images: {
            select: { id: true, url: true, altText: true, order: true },
            orderBy: { order: 'asc' }
          }
        }
      });

      const serializableReviews = allApprovedReviews.map((review: any) => ({
        ...review,
        createdAt: review.createdAt.toISOString(),
        updatedAt: review.updatedAt.toISOString(),
        isSyndicated: review.isBundleReview || false,
        images: review.images.map((image: any) => ({
          ...image,
        }))
      }));

      return json(serializableReviews, { status: 200 });

    } else {
      const directReviews = await (prisma.productReview as any).findMany({
        where: {
          shop,
          status: appConfig.reviews.status.APPROVED,
          isBundleReview: false
        },
        orderBy: [
          { rating: "desc" },
          { createdAt: "desc" }
        ],
        include: {
          images: {
            select: { id: true, url: true, altText: true, order: true },
            orderBy: { order: 'asc' }
          }
        }
      });

      let totalRating = 0;
      directReviews.forEach((review: any) => {
        totalRating += review.rating;
      });
      const averageRating = directReviews.length > 0 ? (totalRating / directReviews.length) : 0;
      const totalReviews = directReviews.length;

      const serializableReviews = directReviews.map((review: any) => ({
        ...review,
        createdAt: review.createdAt.toISOString(),
        updatedAt: review.updatedAt.toISOString(),
        images: review.images.map((image: any) => ({
          ...image,
        }))
      }));

      return json({
        reviews: serializableReviews,
        averageRating: averageRating.toFixed(1),
        totalReviews: totalReviews
      }, { status: 200 });
    }
  } catch (error: any) {
    return json(
      { error: error.message || "Failed to load reviews" },
      { status: 500 }
    );
  }
}