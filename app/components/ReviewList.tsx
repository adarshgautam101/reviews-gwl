import { Box, BlockStack, InlineError, Text } from "@shopify/polaris";
import { useSubmit, useFetcher } from "@remix-run/react";
import { useState, useCallback, useEffect, useRef } from "react";
import EditReviewModal from "./EditReviewModal";
import DeleteReviewModal from "./DeleteReviewModal";
import ReviewCard from "./ReviewCard";

export interface ReviewImage {
  id: string;
  url: string;
  altText: string | null;
  order: number | null;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface Review {
  id: string;
  productId: string;
  rating: number;
  author: string;
  email: string;
  title: string | null;
  content: string;
  images: ReviewImage[];
  createdAt: string | Date;
  updatedAt: string | Date;
  status: string;
  isBundleReview?: boolean;
  bundleContext?: string | null;
}

interface ReviewListProps {
  reviews: Review[];
  externalSubmit?: ReturnType<typeof useSubmit>;
  onReviewsUpdate?: () => void;
  actionSource?: 'bundle' | 'individual';
}

export default function ReviewList({
  reviews,
  externalSubmit,
  onReviewsUpdate,
  actionSource = 'individual',
}: ReviewListProps) {
  const localSubmit = useSubmit();
  const actualSubmit = externalSubmit || localSubmit;
  const fetcher = useFetcher();
  const statusFetcher = useFetcher(); // Separate fetcher for status changes

  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastProcessedFetcherKey = useRef<string | null>(null);

  useEffect(() => {
    const data = fetcher.data as any;
    const fetcherKey = `${fetcher.state}-${JSON.stringify(data)}`;

    // Only process if this is a new fetcher response we haven't seen before
    // This prevents stale success responses from closing newly opened modals
    if (fetcher.state === "idle" && data && fetcherKey !== lastProcessedFetcherKey.current) {
      lastProcessedFetcherKey.current = fetcherKey;

      if (data.success) {
        setError(null);

        // Clear modal states immediately before triggering parent update
        // This prevents stale state from being used in subsequent operations
        const wasEditing = !!editingReview;
        const wasDeleting = !!deletingReview;

        setEditingReview(null);
        setDeletingReview(null);

        // Only trigger parent update after state is cleared
        if (onReviewsUpdate && (wasEditing || wasDeleting)) {
          setTimeout(onReviewsUpdate, 100);
        }
      } else if (data.error) {
        setError(data.error);
      }
    }
  }, [fetcher.state, fetcher.data, editingReview, deletingReview, onReviewsUpdate]);

  // Handle status fetcher updates
  useEffect(() => {
    const statusData = statusFetcher.data as any;
    if (statusFetcher.state === "idle" && statusData) {
      if (statusData.success) {
        setError(null);
        if (onReviewsUpdate) {
          setTimeout(onReviewsUpdate, 100);
        }
      } else if (statusData.error) {
        setError(statusData.error);
      }
    }
  }, [statusFetcher.state, statusFetcher.data, onReviewsUpdate]);

  const handleChangeStatus = useCallback((reviewId: string, newStatus: string) => {
    const formData = new FormData();
    formData.append("status", newStatus);
    formData.append("actionSource", actionSource);

    formData.append("reviewId", reviewId);

    statusFetcher.submit(formData, {
      method: "post",
      action: `/app/reviews/${reviewId}/status`,
    });
  }, [actionSource, statusFetcher]);

  const handleEdit = useCallback((review: Review) => {
    setEditingReview(review);
    setError(null);
  }, []);

  const handleDelete = useCallback((review: Review) => {
    // Ensure we have a valid review with an ID before setting deletion state
    if (!review || !review.id) {
      console.error('Attempted to delete invalid review:', review);
      return;
    }
    setDeletingReview(review);
    setError(null);
  }, []);

  const handleEditSubmit = useCallback((formData: FormData) => {
    if (!editingReview) return;

    formData.append("actionSource", actionSource);

    formData.append("reviewId", editingReview.id);

    fetcher.submit(formData, {
      method: "post",
      action: `/app/reviews/${editingReview.id}/actions`,
    });
  }, [editingReview, fetcher, actionSource]);

  const handleDeleteConfirm = useCallback(() => {
    // Defensive check: ensure deletingReview is still valid
    if (!deletingReview || !deletingReview.id) {
      console.warn('Delete confirmation called with invalid review state');
      setDeletingReview(null);
      return;
    }

    const formData = new FormData();
    formData.append("intent", "delete");
    formData.append("actionSource", actionSource);
    formData.append("reviewId", deletingReview.id);

    fetcher.submit(formData, {
      method: "post",
      action: `/app/reviews/${deletingReview.id}/actions`,
    });
  }, [deletingReview, fetcher, actionSource]);

  const handleEditModalClose = useCallback(() => {
    setEditingReview(null);
    setError(null);
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setDeletingReview(null);
    setError(null);
  }, []);

  return (
    <BlockStack gap="600">
      {error && (
        <Box padding="400">
          <InlineError message={error} fieldID="review-error" />
        </Box>
      )}

      <EditReviewModal
        review={editingReview}
        isOpen={!!editingReview}
        isSubmitting={fetcher.state === "submitting"}
        onClose={handleEditModalClose}
        onSubmit={handleEditSubmit}
      />

      <DeleteReviewModal
        review={deletingReview}
        isOpen={!!deletingReview}
        isSubmitting={fetcher.state === "submitting"}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
      />

      {reviews && reviews.length > 0 ? (
        <BlockStack gap="500">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isSubmitting={fetcher.state !== "idle" && fetcher.formData?.get("reviewId") === review.id}
              isStatusChanging={statusFetcher.state !== "idle" && statusFetcher.formData?.get("reviewId") === review.id}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onChangeStatus={handleChangeStatus}
            />
          ))}
        </BlockStack>
      ) : (
        <div
          style={{
            padding: "var(--p-space-1200)",
            background: "var(--p-color-bg-surface)",
            borderRadius: "var(--p-border-radius-400)",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            border: "1px solid var(--p-color-border-subdued)",
          }}
        >
          <p style={{ paddingInline: "var(--p-space-400)", textAlign: "center" }}>
            <Text as="span" variant="bodyLg" fontWeight="medium" tone="subdued">
              No reviews yet. Be the first to review!
            </Text>
          </p>
        </div>
      )}
    </BlockStack>
  );
}