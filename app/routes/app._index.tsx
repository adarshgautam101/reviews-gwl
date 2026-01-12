import { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Page, Layout, BlockStack, Toast, Button, InlineStack
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { json } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

import db from "../db.server";
import { Review } from "../components/ReviewList";
import StatsCard from "../components/StatsCard";
import { useHomeDashboard } from "../hooks/useHomeDashboard";
import { BulkManagementSection } from "../components/home/BulkManagementSection";
import { ReviewTabsSection } from "../components/home/ReviewTabsSection";
import { getNumericProductId, getGidProductId } from "../utils/product.helpers";
import { checkProductExists, fetchProductSummaries, ProductReviewRecord } from "../utils/review.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const pageParam = url.searchParams.get("page");
  const reviewsPerPage = 10;
  const currentPage = parseInt(pageParam || "1", 10);
  const skip = (currentPage - 1) * reviewsPerPage;
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;

  try {
    const totalReviews = await (db.productReview as any).count({ where: { shop } });
    const allProductReviews = await (db.productReview as any).findMany({
      where: { shop },
      orderBy: { createdAt: 'desc' },
      skip: skip, take: reviewsPerPage, include: { images: true }
    }) as ProductReviewRecord[];

    const sumAllRatings = await (db.productReview as any).aggregate({
      where: { shop },
      _sum: { rating: true }
    });
    const totalRatingSum = sumAllRatings?._sum?.rating || 0;
    const averageAppRating = totalReviews > 0 ? (totalRatingSum / totalReviews).toFixed(1) : "0.0";

    const serializableAllReviews: Review[] = allProductReviews.map(review => ({
      ...review,
      createdAt: (review.createdAt instanceof Date ? review.createdAt.toISOString() : review.createdAt),
      updatedAt: (review.updatedAt instanceof Date ? review.updatedAt.toISOString() : review.updatedAt),
      images: review.images.map(image => ({
        ...image,
        createdAt: (image.createdAt instanceof Date ? image.createdAt.toISOString() : image.createdAt),
        updatedAt: (image.updatedAt instanceof Date ? image.updatedAt.toISOString() : image.updatedAt)
      }))
    }));

    const productGql = `
      query getProducts {
        products(first: 250) {
          edges {
            node {
              id
              title
              handle
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
            }
          }
        }
      }
    `;

    const shopifyResponse = await admin.graphql(productGql);
    const data = await shopifyResponse.json();
    const shopifyProducts = (data.data?.products?.edges || []).map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
      imageUrl: edge.node.images?.edges?.[0]?.node?.url || null,
      numericId: getNumericProductId(edge.node.id)
    }));

    const productSummaries = await fetchProductSummaries(admin, shop);

    const bundles = await (db as any).reviewBundle.findMany({
      where: { shop },
      orderBy: { createdAt: 'desc' },
    });

    const serializableBundles = bundles.map((b: any) => ({
      ...b,
      productIds: b.productIds.split(','),
    }));

    return json({
      reviews: serializableAllReviews,
      totalReviews: totalReviews,
      averageRating: averageAppRating,
      currentPage: currentPage,
      reviewsPerPage: reviewsPerPage,
      productSummaries: productSummaries,
      bundles: serializableBundles,
      shopifyProducts: shopifyProducts,
    });

  } catch (error) {
    console.error("Error fetching data in GWL Hub loader:", error);
    return json({
      reviews: [],
      totalReviews: 0,
      averageRating: "0.0",
      currentPage: 1,
      reviewsPerPage: reviewsPerPage,
      productSummaries: [],
      bundles: [],
      shopifyProducts: []
    });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  const actionType = formData.get('actionType') as string;

  if (actionType === 'export_csv') {
    try {
      const reviews = await (db.productReview as any).findMany({
        where: { shop },
        orderBy: { createdAt: 'desc' },
        include: { images: true },
      }) as ProductReviewRecord[];

      const csvHeaders = 'Product ID,Rating,Author,Email,Title,Content,Status,Created At\n';
      const csvRows = reviews.map(review => {
        const escapedContent = review.content ? `"${review.content.replace(/"/g, '""')}"` : '';
        const escapedTitle = review.title ? `"${review.title.replace(/"/g, '""')}"` : '';
        return [
          review.productId,
          review.rating,
          review.author || '',
          review.email || '',
          escapedTitle,
          escapedContent,
          review.status,
          (review.createdAt instanceof Date ? review.createdAt.toISOString() : review.createdAt)
        ].join(',');
      }).join('\n');

      const csvData = csvHeaders + csvRows;

      return json({
        success: true,
        csvData: csvData,
        fileName: `reviews-export-${new Date().toISOString().split('T')[0]}.csv`
      });
    } catch (error) {
      console.error('Export error:', error);
      return json({ success: false, error: 'Failed to export reviews' }, { status: 500 });
    }
  }

  if (actionType === 'download_sample_csv') {
    const sampleData = `Product ID,Rating,Author,Email,Title,Content,Status,Created At
gid://shopify/Product/123456789,5,John Doe,john@example.com,"Great product!","This product is amazing and works perfectly.",approved,2024-01-15T10:30:00.000Z
gid://shopify/Product/123456789,4,Jane Smith,jane@example.com,"Good quality","Pretty good but could be improved in some areas.",pending,2024-01-16T14:20:00.000Z
gid://shopify/Product/987654321,3,Bob Wilson,bob@example.com,"Average product","It's okay for the price, but not exceptional.",rejected,2024-01-17T09:15:00.000Z`;

    return json({
      success: true,
      csvData: sampleData,
      fileName: 'reviews-sample-template.csv'
    });
  }

  if (actionType === 'import_csv') {
    try {
      const csvFile = formData.get('csvFile') as File;
      if (!csvFile) {
        return json({ success: false, error: 'No file provided' }, { status: 400 });
      }

      const arrayBuffer = await csvFile.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert sheet to JSON with header row
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (rawData.length < 2) {
        return json({ success: false, error: 'File is empty or invalid' }, { status: 400 });
      }

      const headers = (rawData[0] as string[]).map(h => h?.trim());
      const requiredHeaders = ['Product ID', 'Rating', 'Author', 'Email', 'Title', 'Content', 'Status', 'Created At'];

      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        return json({
          success: false,
          error: `Missing required headers: ${missingHeaders.join(', ')}`
        }, { status: 400 });
      }

      // Map headers to indices
      const headerMap: Record<string, number> = {};
      headers.forEach((h, i) => {
        headerMap[h] = i;
      });

      const importedReviews = [];
      const skippedProducts = [];
      const duplicateReviews = [];

      // Process rows starting from index 1
      for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i] as any[];
        if (!row || row.length === 0) continue;

        const getValue = (header: string) => {
          const idx = headerMap[header];
          return row[idx] !== undefined ? String(row[idx]).trim() : '';
        };

        const productIdStr = getValue('Product ID');
        if (!productIdStr) continue;

        const productId = getNumericProductId(productIdStr);
        const productExists = await checkProductExists(productId, admin);

        if (!productExists) {
          skippedProducts.push(productId);
          continue;
        }

        const email = getValue('Email');
        const content = getValue('Content');
        const rating = parseInt(getValue('Rating') || '0', 10);
        const author = getValue('Author');
        const title = getValue('Title');
        const status = getValue('Status') as 'pending' | 'approved' | 'rejected';
        const createdAtStr = getValue('Created At');
        const createdAt = createdAtStr ? new Date(createdAtStr) : new Date();

        // Duplicate Check
        const existingReview = await (db.productReview as any).findFirst({
          where: {
            shop,
            productId,
            email,
            content, // Check content to be sure it's the same review
          }
        });

        if (existingReview) {
          duplicateReviews.push(i + 1); // Store row number (1-based)
          continue;
        }

        try {
          const newReview = await (db.productReview as any).create({
            data: {
              shop,
              productId,
              rating,
              author,
              email,
              title,
              content,
              status: status || 'pending',
              createdAt: createdAt,
              updatedAt: new Date(),
            }
          });
          importedReviews.push(newReview);
        } catch (error) {
          console.error(`Failed to import review on line ${i + 1}:`, error);
        }
      }

      let message = `Successfully imported ${importedReviews.length} reviews.`;
      if (skippedProducts.length > 0) {
        const uniqueSkipped = [...new Set(skippedProducts)];
        message += ` Skipped ${uniqueSkipped.length} reviews for non-existent products.`;
      }
      if (duplicateReviews.length > 0) {
        message += ` Skipped ${duplicateReviews.length} duplicate reviews.`;
      }

      const extraHeaders = headers.filter(h => !requiredHeaders.includes(h));
      if (extraHeaders.length > 0) {
        message += ` Warning: Extra columns detected and ignored: ${extraHeaders.join(', ')}`;
      }

      return json({
        success: true,
        message: message,
        invalidProducts: skippedProducts.length > 0 ? [...new Set(skippedProducts)] : undefined
      });

    } catch (error) {
      console.error('Import error:', error);
      return json({ success: false, error: 'Failed to import file' }, { status: 500 });
    }
  }

  return json({ success: false, error: "Unknown action type" });
}

export default function HomePage() {
  const {
    reviews, totalReviews, averageRating, currentPage,
    productSummaries, bundles, shopifyProducts,
    csvFile, activeToast, toastMessage, toastError,
    selectedTab, selectedBundleId, selectedProductId, sortOption,
    isSubmitting, isExporting, isImporting, isDownloadingSample, pageCount, hasNext, hasPrevious,
    handlePageChange, handleFileChange, handleRemoveFile, toggleActiveToast,
    handleExportCSV, handleDownloadSampleCSV, handleImportCSV,
    handleTabChange, handleSortChange,
    setSelectedBundleId, setSelectedProductId, setActiveToast
  } = useHomeDashboard();

  const getProductTitleFromNumericId = (numericId: string) => {
    const product = shopifyProducts.find(p => p.numericId === numericId);
    return product?.title || `Product ${numericId}`;
  }

  const getProductImageFromNumericId = (numericId: string) => {
    const product = shopifyProducts.find(p => p.numericId === numericId);
    return product?.imageUrl || null;
  }

  const sortOptions = [
    { label: 'Highest Rating', value: 'highest-rating' }, { label: 'Lowest Rating', value: 'lowest-rating' },
    { label: 'Most Reviews', value: 'most-reviews' }, { label: 'Least Reviews', value: 'least-reviews' },
  ];

  const toastMarkup = activeToast ? (
    <Toast content={toastMessage} onDismiss={() => setActiveToast(false)} error={toastError} />
  ) : null;

  return (
    <Page fullWidth>
      <BlockStack gap="400">
        <TitleBar title="GWL - Reviews Management Hub" />

        <Layout>
          <Layout.Section>
            <BlockStack gap="400">
              <StatsCard
                totalReviews={totalReviews}
                averageRating={averageRating}
              />
            </BlockStack>
          </Layout.Section>

          <Layout.Section>
            <BulkManagementSection
              isExporting={isExporting}
              isImporting={isImporting}
              isDownloadingSample={isDownloadingSample}
              handleExportCSV={handleExportCSV}
              csvFile={csvFile}
              handleFileChange={handleFileChange}
              handleRemoveFile={handleRemoveFile}
              handleImportCSV={handleImportCSV}
              handleDownloadSampleCSV={handleDownloadSampleCSV}
            />
          </Layout.Section>

          <Layout.Section>
            <ReviewTabsSection
              selectedTab={selectedTab}
              handleTabChange={handleTabChange}
              totalReviews={totalReviews}
              reviews={reviews}
              pageCount={pageCount}
              currentPage={currentPage}
              hasPrevious={hasPrevious}
              hasNext={hasNext}
              handlePageChange={handlePageChange}
              productSummaries={productSummaries}
              sortOptions={sortOptions}
              sortOption={sortOption}
              handleSortChange={handleSortChange}
              bundles={bundles}
              selectedBundleId={selectedBundleId}
              setSelectedBundleId={setSelectedBundleId}
              selectedProductId={selectedProductId}
              setSelectedProductId={setSelectedProductId}
              shopifyProducts={shopifyProducts}
              getNumericProductId={getNumericProductId}
              getGidProductId={getGidProductId}
              getProductTitleFromNumericId={getProductTitleFromNumericId}
              getProductImageFromNumericId={getProductImageFromNumericId}
            />
          </Layout.Section>
        </Layout>
      </BlockStack>
      {toastMarkup}
    </Page>
  );
}