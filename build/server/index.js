var _a;
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { RemixServer, Meta, Links, Outlet, ScrollRestoration, Scripts, useLoaderData, useActionData, Form, Link, useRouteError, useSubmit, useNavigation, json as json$1, useSearchParams, useNavigate, useFetcher } from "@remix-run/react";
import { createReadableStreamFromReadable, json, redirect } from "@remix-run/node";
import { isbot } from "isbot";
import "@shopify/shopify-app-remix/adapters/node";
import { shopifyApp, AppDistribution, ApiVersion, LoginErrorType, boundary } from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { PrismaClient } from "@prisma/client";
import { AppProvider, Frame, Page, Card, FormLayout, Text, TextField, Button, Box, InlineStack, Divider, ResourceList, ResourceItem, BlockStack, Badge, Icon, Modal, Banner, InlineGrid, Checkbox, Thumbnail, Layout, Toast, Link as Link$1, List, rgbToHex, hsbToRgb, ColorPicker, Select, ButtonGroup, InlineError, Tabs, Popover, ActionList, Pagination } from "@shopify/polaris";
import { useState, useEffect, useCallback } from "react";
import { AppProvider as AppProvider$1 } from "@shopify/shopify-app-remix/react";
import { NavMenu, TitleBar } from "@shopify/app-bridge-react";
import { PlusIcon, FolderIcon, MinusIcon, ChevronDownIcon, ChevronUpIcon, StarFilledIcon, ChatIcon, ExportIcon, DeleteIcon, SortIcon } from "@shopify/polaris-icons";
import * as XLSX from "xlsx";
let db;
if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
  db.$connect();
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient();
    global.__db__.$connect();
  }
  db = global.__db__;
}
const db$1 = db;
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: ((_a = process.env.SCOPES) == null ? void 0 : _a.split(",")) || ["write_products", "read_products", "write_files", "read_files"],
  appUrl: process.env.SHOPIFY_APP_URL || "https://reviews-bundles-production.up.railway.app",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(db$1),
  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true
  },
  ...process.env.SHOP_CUSTOM_DOMAIN ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] } : {}
});
ApiVersion.January25;
const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
const authenticate = shopify.authenticate;
shopify.unauthenticated;
const login = shopify.login;
shopify.registerWebhooks;
shopify.sessionStorage;
const isDevelopment = process.env.NODE_ENV === "development";
const logger = {
  info: (message, ...args) => {
    if (isDevelopment) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  warn: (message, ...args) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error || "");
  },
  debug: (message, ...args) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
};
const streamTimeout = 5e3;
async function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  addDocumentResponseHeaders(request, responseHeaders);
  const userAgent = request.headers.get("user-agent");
  const callbackName = isbot(userAgent ?? "") ? "onAllReady" : "onShellReady";
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url
        }
      ),
      {
        [callbackName]: () => {
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          logger.error("Render error", error);
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const Polaris = /* @__PURE__ */ JSON.parse('{"ActionMenu":{"Actions":{"moreActions":"More actions"},"RollupActions":{"rollupButton":"View actions"}},"ActionList":{"SearchField":{"clearButtonLabel":"Clear","search":"Search","placeholder":"Search actions"}},"Avatar":{"label":"Avatar","labelWithInitials":"Avatar with initials {initials}"},"Autocomplete":{"spinnerAccessibilityLabel":"Loading","ellipsis":"{content}…"},"Badge":{"PROGRESS_LABELS":{"incomplete":"Incomplete","partiallyComplete":"Partially complete","complete":"Complete"},"TONE_LABELS":{"info":"Info","success":"Success","warning":"Warning","critical":"Critical","attention":"Attention","new":"New","readOnly":"Read-only","enabled":"Enabled"},"progressAndTone":"{toneLabel} {progressLabel}"},"Banner":{"dismissButton":"Dismiss notification"},"Button":{"spinnerAccessibilityLabel":"Loading"},"Common":{"checkbox":"checkbox","undo":"Undo","cancel":"Cancel","clear":"Clear","close":"Close","submit":"Submit","more":"More"},"ContextualSaveBar":{"save":"Save","discard":"Discard"},"DataTable":{"sortAccessibilityLabel":"sort {direction} by","navAccessibilityLabel":"Scroll table {direction} one column","totalsRowHeading":"Totals","totalRowHeading":"Total"},"DatePicker":{"previousMonth":"Show previous month, {previousMonthName} {showPreviousYear}","nextMonth":"Show next month, {nextMonth} {nextYear}","today":"Today ","start":"Start of range","end":"End of range","months":{"january":"January","february":"February","march":"March","april":"April","may":"May","june":"June","july":"July","august":"August","september":"September","october":"October","november":"November","december":"December"},"days":{"monday":"Monday","tuesday":"Tuesday","wednesday":"Wednesday","thursday":"Thursday","friday":"Friday","saturday":"Saturday","sunday":"Sunday"},"daysAbbreviated":{"monday":"Mo","tuesday":"Tu","wednesday":"We","thursday":"Th","friday":"Fr","saturday":"Sa","sunday":"Su"}},"DiscardConfirmationModal":{"title":"Discard all unsaved changes","message":"If you discard changes, you’ll delete any edits you made since you last saved.","primaryAction":"Discard changes","secondaryAction":"Continue editing"},"DropZone":{"single":{"overlayTextFile":"Drop file to upload","overlayTextImage":"Drop image to upload","overlayTextVideo":"Drop video to upload","actionTitleFile":"Add file","actionTitleImage":"Add image","actionTitleVideo":"Add video","actionHintFile":"or drop file to upload","actionHintImage":"or drop image to upload","actionHintVideo":"or drop video to upload","labelFile":"Upload file","labelImage":"Upload image","labelVideo":"Upload video"},"allowMultiple":{"overlayTextFile":"Drop files to upload","overlayTextImage":"Drop images to upload","overlayTextVideo":"Drop videos to upload","actionTitleFile":"Add files","actionTitleImage":"Add images","actionTitleVideo":"Add videos","actionHintFile":"or drop files to upload","actionHintImage":"or drop images to upload","actionHintVideo":"or drop videos to upload","labelFile":"Upload files","labelImage":"Upload images","labelVideo":"Upload videos"},"errorOverlayTextFile":"File type is not valid","errorOverlayTextImage":"Image type is not valid","errorOverlayTextVideo":"Video type is not valid"},"EmptySearchResult":{"altText":"Empty search results"},"Frame":{"skipToContent":"Skip to content","navigationLabel":"Navigation","Navigation":{"closeMobileNavigationLabel":"Close navigation"}},"FullscreenBar":{"back":"Back","accessibilityLabel":"Exit fullscreen mode"},"Filters":{"moreFilters":"More filters","moreFiltersWithCount":"More filters ({count})","filter":"Filter {resourceName}","noFiltersApplied":"No filters applied","cancel":"Cancel","done":"Done","clearAllFilters":"Clear all filters","clear":"Clear","clearLabel":"Clear {filterName}","addFilter":"Add filter","clearFilters":"Clear all","searchInView":"in:{viewName}"},"FilterPill":{"clear":"Clear","unsavedChanges":"Unsaved changes - {label}"},"IndexFilters":{"searchFilterTooltip":"Search and filter","searchFilterTooltipWithShortcut":"Search and filter (F)","searchFilterAccessibilityLabel":"Search and filter results","sort":"Sort your results","addView":"Add a new view","newView":"Custom search","SortButton":{"ariaLabel":"Sort the results","tooltip":"Sort","title":"Sort by","sorting":{"asc":"Ascending","desc":"Descending","az":"A-Z","za":"Z-A"}},"EditColumnsButton":{"tooltip":"Edit columns","accessibilityLabel":"Customize table column order and visibility"},"UpdateButtons":{"cancel":"Cancel","update":"Update","save":"Save","saveAs":"Save as","modal":{"title":"Save view as","label":"Name","sameName":"A view with this name already exists. Please choose a different name.","save":"Save","cancel":"Cancel"}}},"IndexProvider":{"defaultItemSingular":"Item","defaultItemPlural":"Items","allItemsSelected":"All {itemsLength}+ {resourceNamePlural} are selected","selected":"{selectedItemsCount} selected","a11yCheckboxDeselectAllSingle":"Deselect {resourceNameSingular}","a11yCheckboxSelectAllSingle":"Select {resourceNameSingular}","a11yCheckboxDeselectAllMultiple":"Deselect all {itemsLength} {resourceNamePlural}","a11yCheckboxSelectAllMultiple":"Select all {itemsLength} {resourceNamePlural}"},"IndexTable":{"emptySearchTitle":"No {resourceNamePlural} found","emptySearchDescription":"Try changing the filters or search term","onboardingBadgeText":"New","resourceLoadingAccessibilityLabel":"Loading {resourceNamePlural}…","selectAllLabel":"Select all {resourceNamePlural}","selected":"{selectedItemsCount} selected","undo":"Undo","selectAllItems":"Select all {itemsLength}+ {resourceNamePlural}","selectItem":"Select {resourceName}","selectButtonText":"Select","sortAccessibilityLabel":"sort {direction} by"},"Loading":{"label":"Page loading bar"},"Modal":{"iFrameTitle":"body markup","modalWarning":"These required properties are missing from Modal: {missingProps}"},"Page":{"Header":{"rollupActionsLabel":"View actions for {title}","pageReadyAccessibilityLabel":"{title}. This page is ready"}},"Pagination":{"previous":"Previous","next":"Next","pagination":"Pagination"},"ProgressBar":{"negativeWarningMessage":"Values passed to the progress prop shouldn’t be negative. Resetting {progress} to 0.","exceedWarningMessage":"Values passed to the progress prop shouldn’t exceed 100. Setting {progress} to 100."},"ResourceList":{"sortingLabel":"Sort by","defaultItemSingular":"item","defaultItemPlural":"items","showing":"Showing {itemsCount} {resource}","showingTotalCount":"Showing {itemsCount} of {totalItemsCount} {resource}","loading":"Loading {resource}","selected":"{selectedItemsCount} selected","allItemsSelected":"All {itemsLength}+ {resourceNamePlural} in your store are selected","allFilteredItemsSelected":"All {itemsLength}+ {resourceNamePlural} in this filter are selected","selectAllItems":"Select all {itemsLength}+ {resourceNamePlural} in your store","selectAllFilteredItems":"Select all {itemsLength}+ {resourceNamePlural} in this filter","emptySearchResultTitle":"No {resourceNamePlural} found","emptySearchResultDescription":"Try changing the filters or search term","selectButtonText":"Select","a11yCheckboxDeselectAllSingle":"Deselect {resourceNameSingular}","a11yCheckboxSelectAllSingle":"Select {resourceNameSingular}","a11yCheckboxDeselectAllMultiple":"Deselect all {itemsLength} {resourceNamePlural}","a11yCheckboxSelectAllMultiple":"Select all {itemsLength} {resourceNamePlural}","Item":{"actionsDropdownLabel":"Actions for {accessibilityLabel}","actionsDropdown":"Actions dropdown","viewItem":"View details for {itemName}"},"BulkActions":{"actionsActivatorLabel":"Actions","moreActionsActivatorLabel":"More actions"}},"SkeletonPage":{"loadingLabel":"Page loading"},"Tabs":{"newViewAccessibilityLabel":"Create new view","newViewTooltip":"Create view","toggleTabsLabel":"More views","Tab":{"rename":"Rename view","duplicate":"Duplicate view","edit":"Edit view","editColumns":"Edit columns","delete":"Delete view","copy":"Copy of {name}","deleteModal":{"title":"Delete view?","description":"This can’t be undone. {viewName} view will no longer be available in your admin.","cancel":"Cancel","delete":"Delete view"}},"RenameModal":{"title":"Rename view","label":"Name","cancel":"Cancel","create":"Save","errors":{"sameName":"A view with this name already exists. Please choose a different name."}},"DuplicateModal":{"title":"Duplicate view","label":"Name","cancel":"Cancel","create":"Create view","errors":{"sameName":"A view with this name already exists. Please choose a different name."}},"CreateViewModal":{"title":"Create new view","label":"Name","cancel":"Cancel","create":"Create view","errors":{"sameName":"A view with this name already exists. Please choose a different name."}}},"Tag":{"ariaLabel":"Remove {children}"},"TextField":{"characterCount":"{count} characters","characterCountWithMaxLength":"{count} of {limit} characters used"},"TooltipOverlay":{"accessibilityLabel":"Tooltip: {label}"},"TopBar":{"toggleMenuLabel":"Toggle menu","SearchField":{"clearButtonLabel":"Clear","search":"Search"}},"MediaCard":{"dismissButton":"Dismiss","popoverButton":"Actions"},"VideoThumbnail":{"playButtonA11yLabel":{"default":"Play video","defaultWithDuration":"Play video of length {duration}","duration":{"hours":{"other":{"only":"{hourCount} hours","andMinutes":"{hourCount} hours and {minuteCount} minutes","andMinute":"{hourCount} hours and {minuteCount} minute","minutesAndSeconds":"{hourCount} hours, {minuteCount} minutes, and {secondCount} seconds","minutesAndSecond":"{hourCount} hours, {minuteCount} minutes, and {secondCount} second","minuteAndSeconds":"{hourCount} hours, {minuteCount} minute, and {secondCount} seconds","minuteAndSecond":"{hourCount} hours, {minuteCount} minute, and {secondCount} second","andSeconds":"{hourCount} hours and {secondCount} seconds","andSecond":"{hourCount} hours and {secondCount} second"},"one":{"only":"{hourCount} hour","andMinutes":"{hourCount} hour and {minuteCount} minutes","andMinute":"{hourCount} hour and {minuteCount} minute","minutesAndSeconds":"{hourCount} hour, {minuteCount} minutes, and {secondCount} seconds","minutesAndSecond":"{hourCount} hour, {minuteCount} minutes, and {secondCount} second","minuteAndSeconds":"{hourCount} hour, {minuteCount} minute, and {secondCount} seconds","minuteAndSecond":"{hourCount} hour, {minuteCount} minute, and {secondCount} second","andSeconds":"{hourCount} hour and {secondCount} seconds","andSecond":"{hourCount} hour and {secondCount} second"}},"minutes":{"other":{"only":"{minuteCount} minutes","andSeconds":"{minuteCount} minutes and {secondCount} seconds","andSecond":"{minuteCount} minutes and {secondCount} second"},"one":{"only":"{minuteCount} minute","andSeconds":"{minuteCount} minute and {secondCount} seconds","andSecond":"{minuteCount} minute and {secondCount} second"}},"seconds":{"other":"{secondCount} seconds","one":"{secondCount} second"}}}}}');
const enTranslations = {
  Polaris
};
const APP_CONFIG = {
  // Pagination Settings
  PAGINATION: {
    REVIEWS_PER_PAGE: 10,
    DEFAULT_PAGE: 1
  },
  // Image URLs
  IMAGES: {
    PLACEHOLDER_BASE_URL: "https://placehold.co/80x80/f6f6f7/6d7175",
    FALLBACK_THUMBNAIL: "https://via.placeholder.com/80",
    getPlaceholderUrl: (text2, width = 80, height = 80) => `https://placehold.co/${width}x${height}/f6f6f7/6d7175?text=${encodeURIComponent(text2)}`
  },
  // Shopify CDN URLs
  SHOPIFY: {
    CDN_BASE_URL: "https://cdn.shopify.com/",
    FONTS_URL: "https://cdn.shopify.com/static/fonts/inter/v4/styles.css",
    GRAPHQL_QUERY_LIMITS: {
      PRODUCTS: 250,
      IMAGES_PER_PRODUCT: 1
    }
  },
  // Documentation URLs
  DOCS: {
    APP_BRIDGE: "https://shopify.dev/docs/apps/tools/app-bridge",
    APP_NAV: "https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav"
  },
  // CSV Configuration
  CSV: {
    HEADERS: ["Product ID", "Rating", "Author", "Email", "Title", "Content", "Status", "Created At"],
    SAMPLE_DATA: `Product ID,Rating,Author,Email,Title,Content,Status,Created At
gid://shopify/Product/123456789,5,John Doe,john@example.com,"Great product!","This product is amazing and works perfectly.",approved,2024-01-15T10:30:00.000Z
gid://shopify/Product/123456789,4,Jane Smith,jane@example.com,"Good quality","Pretty good but could be improved in some areas.",pending,2024-01-16T14:20:00.000Z
gid://shopify/Product/987654321,3,Bob Wilson,bob@example.com,"Average product","It's okay for the price, but not exceptional.",rejected,2024-01-17T09:15:00.000Z`,
    FILE_NAME_PREFIX: "reviews-export",
    SAMPLE_FILE_NAME: "reviews-sample-template.csv"
  },
  // Rating Thresholds
  RATINGS: {
    EXCELLENT: 4.5,
    GOOD: 4,
    AVERAGE: 3,
    POOR: 2
  },
  // Settings Defaults
  SETTINGS_DEFAULTS: {
    STAR_COLOR: "#FFD700",
    BACKGROUND_COLOR: "#F9F9F9",
    HEADING_COLOR: "#222222",
    REVIEW_CARD_COLOR: "#FFFFFF",
    REVIEWS_PER_SLIDE: 3,
    DISPLAY_TYPE: "slider",
    GRID_ROWS: 2,
    GRID_COLUMNS: 2,
    SECTION_BORDER_RADIUS: 12,
    SLIDER_AUTOPLAY: true,
    SLIDER_SPEED: 3e3,
    SLIDER_LOOP: true,
    SLIDER_DIRECTION: "horizontal",
    SPACE_BETWEEN: 20,
    SHOW_NAVIGATION: true,
    SLIDER_EFFECT: "slide",
    HEADING_TEXT: "CUSTOMER TESTIMONIALS",
    HEADING_FONT_FAMILY: "theme",
    HEADING_FONT_SIZE: 40,
    HEADING_FONT_WEIGHT: "bold",
    HEADING_FONT_STYLE: "normal",
    HEADING_TEXT_TRANSFORM: "uppercase",
    HEADING_LETTER_SPACING: 0,
    HEADING_LINE_HEIGHT: 1.2,
    HEADING_TEXT_SHADOW: "none",
    RATING_LABEL_TEXT: "Excellent",
    RATING_LABEL_FONT_FAMILY: "theme",
    RATING_LABEL_FONT_SIZE: 18,
    RATING_LABEL_FONT_WEIGHT: "600",
    RATING_LABEL_COLOR: "#555555",
    RATING_VALUE_FONT_FAMILY: "theme",
    RATING_VALUE_FONT_SIZE: 18,
    RATING_VALUE_FONT_WEIGHT: "600",
    RATING_VALUE_COLOR: "#555555",
    REVIEW_COUNT_PREFIX: "Based on",
    REVIEW_COUNT_SUFFIX: "reviews",
    REVIEW_COUNT_FONT_FAMILY: "theme",
    REVIEW_COUNT_FONT_SIZE: 16,
    REVIEW_COUNT_FONT_WEIGHT: "normal",
    REVIEW_COUNT_COLOR: "#777777"
  },
  // API Endpoints
  API: {
    SETTINGS: "/apps/productreview/api/settings",
    PRODUCT_REVIEWS: "/apps/productreview/api/productreview"
  }
};
function links$2() {
  return [
    { rel: "preconnect", href: APP_CONFIG.SHOPIFY.CDN_BASE_URL },
    {
      rel: "stylesheet",
      href: APP_CONFIG.SHOPIFY.FONTS_URL
    }
  ];
}
function App$2() {
  return /* @__PURE__ */ jsxs("html", { children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(AppProvider, { i18n: enTranslations, children: /* @__PURE__ */ jsx(Frame, { children: /* @__PURE__ */ jsx(Outlet, {}) }) }),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App$2,
  links: links$2
}, Symbol.toStringTag, { value: "Module" }));
const action$9 = async ({ request }) => {
  const { payload, session } = await authenticate.webhook(request);
  const current = payload.current;
  if (session) {
    await db$1.session.update({
      where: {
        id: session.id
      },
      data: {
        scope: current.toString()
      }
    });
  }
  return new Response();
};
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$9
}, Symbol.toStringTag, { value: "Module" }));
const action$8 = async ({ request }) => {
  const { shop, session } = await authenticate.webhook(request);
  if (session) {
    await db$1.session.deleteMany({ where: { shop } });
  }
  return new Response();
};
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$8
}, Symbol.toStringTag, { value: "Module" }));
async function loader$d({ request }) {
  try {
    const url = new URL(request.url);
    const productId = url.searchParams.get("product_id");
    if (!productId) {
      return json([], {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60"
        }
      });
    }
    let numericProductId = productId;
    if (productId.startsWith("gid://shopify/Product/")) {
      numericProductId = productId.split("/").pop() || productId;
    }
    const allApprovedReviews = await db$1.productReview.findMany({
      where: {
        status: "approved",
        productId: numericProductId
      },
      include: {
        images: true
      },
      orderBy: [
        { rating: "desc" },
        { createdAt: "desc" }
      ]
    });
    const serializableReviews = allApprovedReviews.map((review) => ({
      ...review,
      isSyndicated: review.isBundleReview || false
    }));
    const finalReviews = serializableReviews.map((review) => ({
      id: review.id,
      productId: review.productId,
      rating: review.rating,
      author: review.author,
      email: review.email,
      title: review.title,
      content: review.content,
      status: review.status,
      isSyndicated: review.isSyndicated || false,
      bundleContext: review.bundleContext || null,
      imageUrl: review.images.length > 0 ? review.images[0].url : null,
      images: review.images.map((image) => ({
        id: image.id,
        url: image.url,
        altText: image.altText,
        order: image.order,
        createdAt: image.createdAt instanceof Date ? image.createdAt.toISOString() : image.createdAt,
        updatedAt: image.updatedAt instanceof Date ? image.updatedAt.toISOString() : image.updatedAt
      })),
      createdAt: review.createdAt instanceof Date ? review.createdAt.toISOString() : review.createdAt,
      updatedAt: review.updatedAt instanceof Date ? review.updatedAt.toISOString() : review.updatedAt
    }));
    return json(finalReviews, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=120",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  } catch (error) {
    return json([], {
      status: 500,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$d
}, Symbol.toStringTag, { value: "Module" }));
const appConfig = {
  images: {
    maxSize: 20 * 1024 * 1024,
    // 20MB
    maxCount: 5,
    uploadRetries: 10,
    retryDelayMs: 2e3
  },
  reviews: {
    maxWordCount: 200,
    perPage: 10
  },
  metafields: {
    namespace: "reviews",
    ratingKey: "rating",
    countKey: "count"
  }
};
async function invalidateProductCache(productGid, admin) {
  var _a2, _b, _c, _d, _e;
  try {
    logger.info(`[Cache Invalidation] Triggering cache invalidation for product ${productGid}`);
    const getTagsResponse = await admin.graphql(`
            query GetProductTags($id: ID!) {
                product(id: $id) {
                    id
                    tags
                }
            }
        `, {
      variables: { id: productGid }
    });
    const tagsData = await getTagsResponse.json();
    const currentTags = ((_b = (_a2 = tagsData.data) == null ? void 0 : _a2.product) == null ? void 0 : _b.tags) || [];
    const updateResponse = await admin.graphql(`
            mutation UpdateProduct($input: ProductInput!) {
                productUpdate(input: $input) {
                    product {
                        id
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `, {
      variables: {
        input: {
          id: productGid,
          tags: currentTags
        }
      }
    });
    const updateResult = await updateResponse.json();
    if (updateResult.errors || ((_e = (_d = (_c = updateResult.data) == null ? void 0 : _c.productUpdate) == null ? void 0 : _d.userErrors) == null ? void 0 : _e.length)) {
      logger.error(`[Cache Invalidation] ❌ FAILED for product ${productGid}:`, updateResult.errors || updateResult.data.productUpdate.userErrors);
      return { success: false, error: "Cache invalidation failed" };
    }
    logger.info(`[Cache Invalidation] ✅ SUCCESS for product ${productGid}`);
    return { success: true };
  } catch (error) {
    logger.error(`[Cache Invalidation] ❌ EXCEPTION for product ${productGid}:`, error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
async function verifyMetafieldValues(productGid, admin, expectedRating, expectedCount) {
  var _a2, _b, _c, _d, _e, _f;
  try {
    logger.info(`[Metafield Verification] Verifying metafields for product ${productGid}`);
    const response = await admin.graphql(`
            query GetProductMetafields($id: ID!, $namespace: String!, $countKey: String!) {
                product(id: $id) {
                    id
                    rating: metafield(namespace: $namespace, key: "rating") {
                        value
                    }
                    reviewCount: metafield(namespace: $namespace, key: $countKey) {
                        value
                    }
                }
            }
        `, {
      variables: {
        id: productGid,
        namespace: appConfig.metafields.namespace,
        countKey: appConfig.metafields.countKey
      }
    });
    const result = await response.json();
    const actualRating = (_c = (_b = (_a2 = result.data) == null ? void 0 : _a2.product) == null ? void 0 : _b.rating) == null ? void 0 : _c.value;
    const actualCount = (_f = (_e = (_d = result.data) == null ? void 0 : _d.product) == null ? void 0 : _e.reviewCount) == null ? void 0 : _f.value;
    logger.info(`[Metafield Verification] Expected: Rating=${expectedRating}, Count=${expectedCount}`);
    logger.info(`[Metafield Verification] Actual: Rating=${actualRating}, Count=${actualCount}`);
    const verified = actualRating === expectedRating && actualCount === expectedCount.toString();
    if (verified) {
      logger.info(`[Metafield Verification] ✅ VERIFIED for product ${productGid}`);
    } else {
      logger.warn(`[Metafield Verification] ⚠️ MISMATCH for product ${productGid}`);
    }
    return { verified, actualRating, actualCount };
  } catch (error) {
    logger.error(`[Metafield Verification] ❌ EXCEPTION for product ${productGid}:`, error);
    return { verified: false };
  }
}
async function calculateAndUpdateProductMetafields(productNumericId, admin, shop) {
  var _a2, _b, _c, _d, _e;
  try {
    logger.info(`[Metafield Update] Starting update for product ${productNumericId} on shop ${shop}`);
    const approvedReviews = await db$1.productReview.findMany({
      where: {
        shop,
        productId: productNumericId,
        status: "approved"
      },
      select: { id: true, rating: true }
    });
    logger.info(`[Metafield Update] Found ${approvedReviews.length} approved reviews for product ${productNumericId}`);
    const finalReviewCount = approvedReviews.length;
    const totalRatingSum = approvedReviews.reduce((sum, review) => sum + review.rating, 0);
    const finalAverageRating = finalReviewCount > 0 ? totalRatingSum / finalReviewCount : 0;
    const productGid = `gid://shopify/Product/${productNumericId}`;
    logger.info(`[Metafield Update] Calculated stats for product ${productNumericId}: Rating=${finalAverageRating.toFixed(1)}, Count=${finalReviewCount}`);
    logger.info(`[Metafield Update] Sending mutation to Shopify for product GID: ${productGid}`);
    const response = await admin.graphql(
      `
      mutation UpdateProductMetafields($input: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $input) {
          metafields {
            id
            namespace
            key
            value
          }
          userErrors { field message }
        }
      }`,
      {
        variables: {
          input: [
            {
              ownerId: productGid,
              namespace: appConfig.metafields.namespace,
              key: appConfig.metafields.ratingKey,
              value: finalReviewCount > 0 ? finalAverageRating.toFixed(1) : null,
              type: "number_decimal"
            },
            {
              ownerId: productGid,
              namespace: appConfig.metafields.namespace,
              key: appConfig.metafields.countKey,
              value: finalReviewCount > 0 ? finalReviewCount.toString() : null,
              type: "number_integer"
            }
          ]
        }
      }
    );
    const result = await response.json();
    logger.info(`[Metafield Update] GraphQL Response for product ${productNumericId}:`, JSON.stringify(result, null, 2));
    if (result.errors || ((_c = (_b = (_a2 = result.data) == null ? void 0 : _a2.metafieldsSet) == null ? void 0 : _b.userErrors) == null ? void 0 : _c.length)) {
      const errorDetails = result.errors || result.data.metafieldsSet.userErrors;
      logger.error(`[Metafield Update] ❌ FAILED for product ${productNumericId}:`, errorDetails);
      return {
        success: false,
        error: JSON.stringify(errorDetails),
        rating: finalAverageRating.toFixed(1),
        count: finalReviewCount
      };
    }
    logger.info(`[Metafield Update] ✅ SUCCESS for product ${productNumericId}: Rating=${finalAverageRating.toFixed(1)}, Count=${finalReviewCount}`);
    if ((_e = (_d = result.data) == null ? void 0 : _d.metafieldsSet) == null ? void 0 : _e.metafields) {
      logger.info(`[Metafield Update] Updated metafields:`, result.data.metafieldsSet.metafields);
    }
    const cacheInvalidation = await invalidateProductCache(productGid, admin);
    if (!cacheInvalidation.success) {
      logger.warn(`[Metafield Update] ⚠️ Cache invalidation failed for product ${productNumericId}, but metafields were updated`);
    }
    const verification = await verifyMetafieldValues(
      productGid,
      admin,
      finalAverageRating.toFixed(1),
      finalReviewCount
    );
    if (!verification.verified) {
      logger.error(`[Metafield Update] ⚠️ Metafield verification failed for product ${productNumericId}`);
      logger.error(`[Metafield Update] Expected: Rating=${finalAverageRating.toFixed(1)}, Count=${finalReviewCount}`);
      logger.error(`[Metafield Update] Actual: Rating=${verification.actualRating}, Count=${verification.actualCount}`);
    }
    return {
      success: true,
      rating: finalAverageRating.toFixed(1),
      count: finalReviewCount
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error(`[Metafield Update] ❌ EXCEPTION for product ${productNumericId}:`, error);
    return {
      success: false,
      error: errorMessage
    };
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function uploadImageToShopify(base64ImageData, shopDomain) {
  var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
  const { uploadRetries, retryDelayMs, maxSize } = appConfig.images;
  console.log(`[Upload] Starting upload for shop: ${shopDomain}`);
  try {
    const { admin } = await shopify.unauthenticated.admin(shopDomain);
    const matches = base64ImageData.match(/^data:(image\/(png|jpe?g|gif|webp));base64,(.+)$/i);
    if (!matches) {
      console.error("[Upload] Image upload failed: Invalid base64 format");
      return null;
    }
    const contentType = matches[1];
    const fileExtension = matches[2] === "jpeg" ? "jpg" : matches[2];
    const imageData = matches[3];
    const imageBuffer = Buffer.from(imageData, "base64");
    console.log(`[Upload] Image details - Type: ${contentType}, Extension: ${fileExtension}, Size: ${imageBuffer.length} bytes`);
    if (imageBuffer.length > maxSize) {
      console.error(`[Upload] Image upload failed: File size ${imageBuffer.length} exceeds max size ${maxSize}`);
      return null;
    }
    const filename = `review-image-${Date.now()}.${fileExtension}`;
    console.log(`[Upload] Requesting staged upload target for ${filename}`);
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
          resource: "IMAGE",
          // Changed from FILE to IMAGE
          fileSize: imageBuffer.length.toString()
        }]
      }
    });
    const stagedUploadsResult = await stagedUploadsResponse.json();
    if (stagedUploadsResult.errors) {
      console.error("[Upload] GraphQL errors in stagedUploadsCreate:", JSON.stringify(stagedUploadsResult.errors));
    }
    if ((_c = (_b = (_a2 = stagedUploadsResult.data) == null ? void 0 : _a2.stagedUploadsCreate) == null ? void 0 : _b.userErrors) == null ? void 0 : _c.length) {
      console.error("[Upload] User errors in stagedUploadsCreate:", JSON.stringify((_e = (_d = stagedUploadsResult.data) == null ? void 0 : _d.stagedUploadsCreate) == null ? void 0 : _e.userErrors));
    }
    const target = (_g = (_f = stagedUploadsResult.data) == null ? void 0 : _f.stagedUploadsCreate) == null ? void 0 : _g.stagedTargets[0];
    if (!target) {
      console.error("[Upload] Image upload failed: Could not create staged upload target");
      return null;
    }
    console.log(`[Upload] Staged target created. URL: ${target.url}`);
    const isSignedUrl = target.url.includes("?");
    if (isSignedUrl) {
      console.log(`[Upload] Uploading to signed URL (PUT)`);
      const uploadResponse = await fetch(target.url, {
        method: "PUT",
        body: imageBuffer,
        headers: {
          "Content-Type": contentType
        }
      });
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error(`[Upload] Image upload failed: Could not upload to staged target (PUT). Status: ${uploadResponse.status}, Error: ${errorText}`);
        return null;
      }
    } else {
      console.log(`[Upload] Uploading to staged target (POST)`);
      const formData = new FormData();
      target.parameters.forEach(({ name, value }) => {
        formData.append(name, value);
      });
      const blob = new Blob([imageBuffer], { type: contentType });
      formData.append("file", blob, filename);
      const uploadResponse = await fetch(target.url, {
        method: "POST",
        body: formData
      });
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error(`[Upload] Image upload failed: Could not upload to staged target (POST). Status: ${uploadResponse.status}, Error: ${errorText}`);
        return null;
      }
    }
    console.log(`[Upload] File uploaded to target successfully.`);
    console.log(`[Upload] Creating file in Shopify with resourceUrl: ${target.resourceUrl}`);
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
          contentType: "IMAGE",
          originalSource: target.resourceUrl
        }]
      }
    });
    const fileCreateResult = await fileCreateResponse.json();
    if ((_j = (_i = (_h = fileCreateResult.data) == null ? void 0 : _h.fileCreate) == null ? void 0 : _i.userErrors) == null ? void 0 : _j.length) {
      console.error("[Upload] User errors in fileCreate:", JSON.stringify((_l = (_k = fileCreateResult.data) == null ? void 0 : _k.fileCreate) == null ? void 0 : _l.userErrors));
    }
    const file = (_n = (_m = fileCreateResult.data) == null ? void 0 : _m.fileCreate) == null ? void 0 : _n.files[0];
    if (!file || !file.id) {
      console.error("[Upload] Image upload failed: Could not create file in Shopify");
      return null;
    }
    console.log(`[Upload] File created in Shopify. ID: ${file.id}, Initial Status: ${file.fileStatus}`);
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
      const statusResult = await fileStatusResponse.json();
      if ((_o = statusResult.errors) == null ? void 0 : _o.length) {
        console.error("[Upload] Image upload failed: Error polling file status", JSON.stringify(statusResult.errors));
        break;
      }
      const updatedFile = (_p = statusResult.data) == null ? void 0 : _p.node;
      console.log(`[Upload] Polling attempt ${i + 1}/${uploadRetries}. Status: ${updatedFile == null ? void 0 : updatedFile.fileStatus}`);
      if (updatedFile && updatedFile.fileStatus === "READY") {
        const finalUrl = ((_q = updatedFile.image) == null ? void 0 : _q.originalSrc) || updatedFile.url || null;
        console.log(`[Upload] File is READY. URL: ${finalUrl}`);
        return finalUrl;
      } else if (updatedFile && (updatedFile.fileStatus === "FAILED" || updatedFile.fileStatus === "ERROR")) {
        console.error("[Upload] Image upload failed: File status is FAILED or ERROR");
        return null;
      }
    }
    console.error("[Upload] Image upload failed: Polling timed out");
    return null;
  } catch (error) {
    console.error("[Upload] Image upload failed: Unexpected error", error);
    return null;
  }
}
async function action$7({ request }) {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method Not Allowed" }),
      { status: 405 }
    );
  }
  try {
    const requestBody = await request.json();
    let { productId, rating, author, content: content2, email, title, images: base64Images } = requestBody;
    author = author == null ? void 0 : author.trim();
    content2 = content2 == null ? void 0 : content2.trim();
    email = email == null ? void 0 : email.trim();
    title = title == null ? void 0 : title.trim();
    if (!productId || !rating || !author || !content2 || !email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields (productId, rating, author, content, email)" }),
        { status: 400 }
      );
    }
    if (typeof productId === "string" && productId.startsWith("gid://shopify/Product/")) {
      productId = productId.split("/").pop() || "";
    }
    if (!/^\d+$/.test(productId)) {
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format." }),
        { status: 400 }
      );
    }
    const wordCount = content2.trim().split(/\s+/).length;
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
    const imagesToCreate = [];
    const imagesToProcess = Array.isArray(base64Images) ? base64Images.slice(0, appConfig.images.maxCount) : [];
    if (imagesToProcess.length > 0) {
      const uploadPromises = imagesToProcess.map(async (base64Image, i) => {
        if (typeof base64Image === "string") {
          const imageUrl = await uploadImageToShopify(base64Image, shopDomain);
          if (imageUrl) {
            return { url: imageUrl, altText: `Review image ${i + 1}`, order: i };
          }
        }
        return null;
      });
      const uploadedImages = await Promise.all(uploadPromises);
      uploadedImages.forEach((img) => {
        if (img) imagesToCreate.push(img);
      });
    }
    const review = await db$1.productReview.create({
      data: {
        shop: shopDomain,
        productId,
        rating: parsedRating,
        author,
        content: content2,
        email,
        title: title || null,
        status: "pending",
        isBundleReview: false,
        images: {
          create: imagesToCreate
        }
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
    } catch (metafieldError) {
      console.error("Metafield update failed:", metafieldError);
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
  } catch (error) {
    console.error("Action failed:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to submit review. Please try again."
      }),
      { status: 500 }
    );
  }
}
async function loader$c({ request }) {
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
      if (typeof productId === "string" && productId.startsWith("gid://shopify/Product/")) {
        productId = productId.split("/").pop() || "";
      }
      const allApprovedReviews = await db$1.productReview.findMany({
        where: {
          shop,
          productId,
          status: "approved"
        },
        orderBy: [
          { rating: "desc" },
          { createdAt: "desc" }
        ],
        include: {
          images: {
            select: { id: true, url: true, altText: true, order: true },
            orderBy: { order: "asc" }
          }
        }
      });
      const serializableReviews = allApprovedReviews.map((review) => ({
        ...review,
        createdAt: review.createdAt.toISOString(),
        updatedAt: review.updatedAt.toISOString(),
        isSyndicated: review.isBundleReview || false,
        images: review.images.map((image) => ({
          ...image
        }))
      }));
      return json(serializableReviews, { status: 200 });
    } else {
      const directReviews = await db$1.productReview.findMany({
        where: {
          shop,
          status: "approved",
          isBundleReview: false
        },
        orderBy: [
          { rating: "desc" },
          { createdAt: "desc" }
        ],
        include: {
          images: {
            select: { id: true, url: true, altText: true, order: true },
            orderBy: { order: "asc" }
          }
        }
      });
      let totalRating = 0;
      directReviews.forEach((review) => {
        totalRating += review.rating;
      });
      const averageRating = directReviews.length > 0 ? totalRating / directReviews.length : 0;
      const totalReviews = directReviews.length;
      const serializableReviews = directReviews.map((review) => ({
        ...review,
        createdAt: review.createdAt.toISOString(),
        updatedAt: review.updatedAt.toISOString(),
        images: review.images.map((image) => ({
          ...image
        }))
      }));
      return json({
        reviews: serializableReviews,
        averageRating: averageRating.toFixed(1),
        totalReviews
      }, { status: 200 });
    }
  } catch (error) {
    return json(
      { error: error.message || "Failed to load reviews" },
      { status: 500 }
    );
  }
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7,
  loader: loader$c
}, Symbol.toStringTag, { value: "Module" }));
async function loader$b({ request }) {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");
    if (!shop) {
      console.error("Missing shop parameter in api.settings");
      return json({ error: "Missing shop parameter" }, { status: 400 });
    }
    const appSettings = await db$1.appSettings.findUnique({
      where: { shop }
    });
    if (!appSettings) {
      console.log(`No settings found for shop: ${shop}, returning defaults`);
      return json({
        starColor: APP_CONFIG.SETTINGS_DEFAULTS.STAR_COLOR,
        backgroundColor: APP_CONFIG.SETTINGS_DEFAULTS.BACKGROUND_COLOR,
        headingColor: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_COLOR,
        reviewCardColor: APP_CONFIG.SETTINGS_DEFAULTS.REVIEW_CARD_COLOR,
        reviewsPerSlide: APP_CONFIG.SETTINGS_DEFAULTS.REVIEWS_PER_SLIDE,
        displayType: APP_CONFIG.SETTINGS_DEFAULTS.DISPLAY_TYPE,
        gridRows: APP_CONFIG.SETTINGS_DEFAULTS.GRID_ROWS,
        gridColumns: APP_CONFIG.SETTINGS_DEFAULTS.GRID_COLUMNS,
        sliderAutoplay: APP_CONFIG.SETTINGS_DEFAULTS.SLIDER_AUTOPLAY,
        sliderSpeed: APP_CONFIG.SETTINGS_DEFAULTS.SLIDER_SPEED,
        sliderLoop: APP_CONFIG.SETTINGS_DEFAULTS.SLIDER_LOOP,
        sliderDirection: APP_CONFIG.SETTINGS_DEFAULTS.SLIDER_DIRECTION,
        spaceBetween: APP_CONFIG.SETTINGS_DEFAULTS.SPACE_BETWEEN,
        showNavigation: APP_CONFIG.SETTINGS_DEFAULTS.SHOW_NAVIGATION,
        sliderEffect: APP_CONFIG.SETTINGS_DEFAULTS.SLIDER_EFFECT,
        sectionBorderRadius: APP_CONFIG.SETTINGS_DEFAULTS.SECTION_BORDER_RADIUS,
        // Heading Text Defaults
        headingText: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_TEXT,
        headingFontFamily: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_FONT_FAMILY,
        headingFontSize: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_FONT_SIZE,
        headingFontWeight: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_FONT_WEIGHT,
        headingFontStyle: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_FONT_STYLE,
        headingTextTransform: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_TEXT_TRANSFORM,
        headingLetterSpacing: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_LETTER_SPACING,
        headingLineHeight: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_LINE_HEIGHT,
        headingTextShadow: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_TEXT_SHADOW,
        // Rating Summary Defaults
        ratingLabelText: APP_CONFIG.SETTINGS_DEFAULTS.RATING_LABEL_TEXT,
        ratingLabelFontFamily: APP_CONFIG.SETTINGS_DEFAULTS.RATING_LABEL_FONT_FAMILY,
        ratingLabelFontSize: APP_CONFIG.SETTINGS_DEFAULTS.RATING_LABEL_FONT_SIZE,
        ratingLabelFontWeight: APP_CONFIG.SETTINGS_DEFAULTS.RATING_LABEL_FONT_WEIGHT,
        ratingLabelColor: APP_CONFIG.SETTINGS_DEFAULTS.RATING_LABEL_COLOR,
        // Average Rating Defaults
        ratingValueFontFamily: APP_CONFIG.SETTINGS_DEFAULTS.RATING_VALUE_FONT_FAMILY,
        ratingValueFontSize: APP_CONFIG.SETTINGS_DEFAULTS.RATING_VALUE_FONT_SIZE,
        ratingValueFontWeight: APP_CONFIG.SETTINGS_DEFAULTS.RATING_VALUE_FONT_WEIGHT,
        ratingValueColor: APP_CONFIG.SETTINGS_DEFAULTS.RATING_VALUE_COLOR,
        // Review Count Defaults
        reviewCountPrefix: APP_CONFIG.SETTINGS_DEFAULTS.REVIEW_COUNT_PREFIX,
        reviewCountSuffix: APP_CONFIG.SETTINGS_DEFAULTS.REVIEW_COUNT_SUFFIX,
        reviewCountFontFamily: APP_CONFIG.SETTINGS_DEFAULTS.REVIEW_COUNT_FONT_FAMILY,
        reviewCountFontSize: APP_CONFIG.SETTINGS_DEFAULTS.REVIEW_COUNT_FONT_SIZE,
        reviewCountFontWeight: APP_CONFIG.SETTINGS_DEFAULTS.REVIEW_COUNT_FONT_WEIGHT,
        reviewCountColor: APP_CONFIG.SETTINGS_DEFAULTS.REVIEW_COUNT_COLOR
      });
    }
    return json({
      starColor: appSettings.starColor,
      backgroundColor: appSettings.backgroundColor,
      headingColor: appSettings.headingColor,
      reviewCardColor: appSettings.reviewCardColor,
      reviewsPerSlide: appSettings.reviewsPerSlide,
      displayType: appSettings.displayType,
      gridRows: appSettings.gridRows || APP_CONFIG.SETTINGS_DEFAULTS.GRID_ROWS,
      gridColumns: appSettings.gridColumns || APP_CONFIG.SETTINGS_DEFAULTS.GRID_COLUMNS,
      sliderAutoplay: appSettings.sliderAutoplay ?? APP_CONFIG.SETTINGS_DEFAULTS.SLIDER_AUTOPLAY,
      sliderSpeed: appSettings.sliderSpeed ?? APP_CONFIG.SETTINGS_DEFAULTS.SLIDER_SPEED,
      sliderLoop: appSettings.sliderLoop ?? APP_CONFIG.SETTINGS_DEFAULTS.SLIDER_LOOP,
      sliderDirection: appSettings.sliderDirection ?? APP_CONFIG.SETTINGS_DEFAULTS.SLIDER_DIRECTION,
      spaceBetween: appSettings.spaceBetween ?? APP_CONFIG.SETTINGS_DEFAULTS.SPACE_BETWEEN,
      showNavigation: appSettings.showNavigation ?? APP_CONFIG.SETTINGS_DEFAULTS.SHOW_NAVIGATION,
      sliderEffect: appSettings.sliderEffect ?? APP_CONFIG.SETTINGS_DEFAULTS.SLIDER_EFFECT,
      sectionBorderRadius: appSettings.sectionBorderRadius ?? APP_CONFIG.SETTINGS_DEFAULTS.SECTION_BORDER_RADIUS,
      // Heading Text
      headingText: appSettings.headingText,
      headingFontFamily: appSettings.headingFontFamily,
      headingFontSize: appSettings.headingFontSize,
      headingFontWeight: appSettings.headingFontWeight,
      headingFontStyle: appSettings.headingFontStyle,
      headingTextTransform: appSettings.headingTextTransform,
      headingLetterSpacing: appSettings.headingLetterSpacing,
      headingLineHeight: appSettings.headingLineHeight,
      headingTextShadow: appSettings.headingTextShadow,
      // Rating Summary
      ratingLabelText: appSettings.ratingLabelText,
      ratingLabelFontFamily: appSettings.ratingLabelFontFamily,
      ratingLabelFontSize: appSettings.ratingLabelFontSize,
      ratingLabelFontWeight: appSettings.ratingLabelFontWeight,
      ratingLabelColor: appSettings.ratingLabelColor,
      // Average Rating
      ratingValueFontFamily: appSettings.ratingValueFontFamily,
      ratingValueFontSize: appSettings.ratingValueFontSize,
      ratingValueFontWeight: appSettings.ratingValueFontWeight,
      ratingValueColor: appSettings.ratingValueColor,
      // Review Count
      reviewCountPrefix: appSettings.reviewCountPrefix,
      reviewCountSuffix: appSettings.reviewCountSuffix,
      reviewCountFontFamily: appSettings.reviewCountFontFamily,
      reviewCountFontSize: appSettings.reviewCountFontSize,
      reviewCountFontWeight: appSettings.reviewCountFontWeight,
      reviewCountColor: appSettings.reviewCountColor
    });
  } catch (error) {
    console.error("Error fetching app settings for theme:", error);
    return json({
      starColor: APP_CONFIG.SETTINGS_DEFAULTS.STAR_COLOR,
      backgroundColor: APP_CONFIG.SETTINGS_DEFAULTS.BACKGROUND_COLOR,
      headingColor: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_COLOR,
      reviewCardColor: APP_CONFIG.SETTINGS_DEFAULTS.REVIEW_CARD_COLOR,
      reviewsPerSlide: APP_CONFIG.SETTINGS_DEFAULTS.REVIEWS_PER_SLIDE,
      displayType: APP_CONFIG.SETTINGS_DEFAULTS.DISPLAY_TYPE,
      gridRows: APP_CONFIG.SETTINGS_DEFAULTS.GRID_ROWS,
      gridColumns: APP_CONFIG.SETTINGS_DEFAULTS.GRID_COLUMNS,
      sliderAutoplay: APP_CONFIG.SETTINGS_DEFAULTS.SLIDER_AUTOPLAY,
      sliderSpeed: APP_CONFIG.SETTINGS_DEFAULTS.SLIDER_SPEED,
      sliderLoop: APP_CONFIG.SETTINGS_DEFAULTS.SLIDER_LOOP,
      sliderDirection: APP_CONFIG.SETTINGS_DEFAULTS.SLIDER_DIRECTION,
      spaceBetween: APP_CONFIG.SETTINGS_DEFAULTS.SPACE_BETWEEN,
      showNavigation: APP_CONFIG.SETTINGS_DEFAULTS.SHOW_NAVIGATION,
      sliderEffect: APP_CONFIG.SETTINGS_DEFAULTS.SLIDER_EFFECT,
      sectionBorderRadius: APP_CONFIG.SETTINGS_DEFAULTS.SECTION_BORDER_RADIUS,
      // Heading Text Fallbacks
      headingText: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_TEXT,
      headingFontFamily: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_FONT_FAMILY,
      headingFontSize: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_FONT_SIZE,
      headingFontWeight: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_FONT_WEIGHT,
      headingFontStyle: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_FONT_STYLE,
      headingTextTransform: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_TEXT_TRANSFORM,
      headingLetterSpacing: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_LETTER_SPACING,
      headingLineHeight: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_LINE_HEIGHT,
      headingTextShadow: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_TEXT_SHADOW,
      // Rating Summary Fallbacks
      ratingLabelText: APP_CONFIG.SETTINGS_DEFAULTS.RATING_LABEL_TEXT,
      ratingLabelFontFamily: APP_CONFIG.SETTINGS_DEFAULTS.RATING_LABEL_FONT_FAMILY,
      ratingLabelFontSize: APP_CONFIG.SETTINGS_DEFAULTS.RATING_LABEL_FONT_SIZE,
      ratingLabelFontWeight: APP_CONFIG.SETTINGS_DEFAULTS.RATING_LABEL_FONT_WEIGHT,
      ratingLabelColor: APP_CONFIG.SETTINGS_DEFAULTS.RATING_LABEL_COLOR,
      // Average Rating Fallbacks
      ratingValueFontFamily: APP_CONFIG.SETTINGS_DEFAULTS.RATING_VALUE_FONT_FAMILY,
      ratingValueFontSize: APP_CONFIG.SETTINGS_DEFAULTS.RATING_VALUE_FONT_SIZE,
      ratingValueFontWeight: APP_CONFIG.SETTINGS_DEFAULTS.RATING_VALUE_FONT_WEIGHT,
      ratingValueColor: APP_CONFIG.SETTINGS_DEFAULTS.RATING_VALUE_COLOR,
      // Review Count Fallbacks
      reviewCountPrefix: APP_CONFIG.SETTINGS_DEFAULTS.REVIEW_COUNT_PREFIX,
      reviewCountSuffix: APP_CONFIG.SETTINGS_DEFAULTS.REVIEW_COUNT_SUFFIX,
      reviewCountFontFamily: APP_CONFIG.SETTINGS_DEFAULTS.REVIEW_COUNT_FONT_FAMILY,
      reviewCountFontSize: APP_CONFIG.SETTINGS_DEFAULTS.REVIEW_COUNT_FONT_SIZE,
      reviewCountFontWeight: APP_CONFIG.SETTINGS_DEFAULTS.REVIEW_COUNT_FONT_WEIGHT,
      reviewCountColor: APP_CONFIG.SETTINGS_DEFAULTS.REVIEW_COUNT_COLOR
    }, { status: 500 });
  }
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$b
}, Symbol.toStringTag, { value: "Module" }));
async function action$6({ request }) {
  var _a2, _b, _c, _d, _e, _f, _g;
  if (request.method !== "POST") {
    return json({ error: "Method Not Allowed" }, { status: 405 });
  }
  try {
    const { session } = await authenticate.admin(request);
    if (!session || !session.shop) {
      return json({ error: "Shop session not found. Please log in." }, { status: 401 });
    }
    const formData = await request.formData();
    const title = (_a2 = formData.get("title")) == null ? void 0 : _a2.toString();
    const content2 = (_b = formData.get("content")) == null ? void 0 : _b.toString();
    const rating = (_c = formData.get("rating")) == null ? void 0 : _c.toString();
    const author = (_d = formData.get("author")) == null ? void 0 : _d.toString();
    const email = (_e = formData.get("email")) == null ? void 0 : _e.toString();
    const productId = (_f = formData.get("productId")) == null ? void 0 : _f.toString();
    const productName = (_g = formData.get("productName")) == null ? void 0 : _g.toString();
    if (!title || !content2 || !rating || !author || !productId || !productName) {
      return json({ error: "All required fields must be filled out." }, { status: 400 });
    }
    const parsedRating = parseInt(rating, 10);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return json({ error: "Rating must be a number between 1 and 5." }, { status: 400 });
    }
    const review = await db$1.review.create({
      data: {
        shopId: session.shop,
        title,
        content: content2,
        rating: parsedRating,
        author,
        email: email || null,
        productId,
        productName,
        date: /* @__PURE__ */ new Date(),
        status: "pending"
      }
    });
    return json({ message: "Review submitted successfully!", review }, { status: 201 });
  } catch (error) {
    console.error("Error submitting review:", error);
    if (error instanceof Response) {
      throw error;
    }
    return json({ error: "Failed to submit review. Please try again." }, { status: 500 });
  }
}
async function loader$a({ request }) {
  try {
    const { session } = await authenticate.admin(request);
    if (!session || !session.shop) {
      return json({ error: "Authentication required or session invalid." }, { status: 401 });
    }
    const reviews = await db$1.review.findMany({
      where: {
        shopId: session.shop
      },
      orderBy: {
        date: "desc"
      }
    });
    return json(reviews);
  } catch (error) {
    console.error("Error in /api/reviews loader:", error);
    if (error instanceof Response) {
      throw error;
    }
    return json({ error: "Failed to load reviews due to an unexpected server error." }, { status: 500 });
  }
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6,
  loader: loader$a
}, Symbol.toStringTag, { value: "Module" }));
function reviewsToCSV(reviews) {
  if (reviews.length === 0) return "";
  const headers2 = [
    "id",
    "productId",
    "rating",
    "author",
    "email",
    "title",
    "content",
    "status",
    "createdAt"
  ];
  const csvRows = [headers2.join(",")];
  for (const review of reviews) {
    const values = headers2.map((header) => {
      let value = review[header] !== void 0 && review[header] !== null ? review[header] : "";
      if (typeof value === "string") {
        value = value.replace(/(\r\n|\n|\r)/gm, " ");
        if (value.includes(",") || value.includes('"')) {
          value = value.replace(/"/g, '""');
          value = `"${value}"`;
        }
      } else if (value instanceof Date) {
        value = value.toISOString();
      }
      return value;
    });
    csvRows.push(values.join(","));
  }
  return csvRows.join("\n");
}
async function loader$9({ request }) {
  await authenticate.admin(request);
  try {
    const reviews = await db$1.productReview.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        productId: true,
        rating: true,
        author: true,
        email: true,
        title: true,
        content: true,
        status: true,
        createdAt: true
      }
    });
    const csvData = reviewsToCSV(reviews);
    return new Response(csvData, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="product_reviews_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv"`
      }
    });
  } catch (error) {
    console.error("Error exporting reviews:", error);
    return new Response("An error occurred while exporting reviews.", { status: 500 });
  }
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$9
}, Symbol.toStringTag, { value: "Module" }));
const polarisStyles = "/assets/styles-C7YjYK5e.css";
function loginErrorMessage(loginErrors) {
  if ((loginErrors == null ? void 0 : loginErrors.shop) === LoginErrorType.MissingShop) {
    return { shop: "Please enter your shop domain to log in" };
  } else if ((loginErrors == null ? void 0 : loginErrors.shop) === LoginErrorType.InvalidShop) {
    return { shop: "Please enter a valid shop domain to log in" };
  }
  return {};
}
const links$1 = () => [{ rel: "stylesheet", href: polarisStyles }];
const loader$8 = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));
  return { errors, polarisTranslations: enTranslations };
};
const action$5 = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));
  return {
    errors
  };
};
function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");
  const { errors } = actionData || loaderData;
  return /* @__PURE__ */ jsx(AppProvider, { i18n: loaderData.polarisTranslations, children: /* @__PURE__ */ jsx(Page, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(Form, { method: "post", children: /* @__PURE__ */ jsxs(FormLayout, { children: [
    /* @__PURE__ */ jsx(Text, { variant: "headingMd", as: "h2", children: "Log in" }),
    /* @__PURE__ */ jsx(
      TextField,
      {
        type: "text",
        name: "shop",
        label: "Shop domain",
        helpText: "example.myshopify.com",
        value: shop,
        onChange: setShop,
        autoComplete: "on",
        error: errors.shop
      }
    ),
    /* @__PURE__ */ jsx(Button, { submit: true, children: "Log in" })
  ] }) }) }) }) });
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5,
  default: Auth,
  links: links$1,
  loader: loader$8
}, Symbol.toStringTag, { value: "Module" }));
const index = "_index_12o3y_1";
const heading = "_heading_12o3y_11";
const text = "_text_12o3y_12";
const content = "_content_12o3y_22";
const form = "_form_12o3y_27";
const label = "_label_12o3y_35";
const input = "_input_12o3y_43";
const button = "_button_12o3y_47";
const list = "_list_12o3y_51";
const styles = {
  index,
  heading,
  text,
  content,
  form,
  label,
  input,
  button,
  list
};
const loader$7 = async ({ request }) => {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }
  return { showForm: Boolean(login) };
};
function App$1() {
  const { showForm } = useLoaderData();
  return /* @__PURE__ */ jsx("div", { className: styles.index, children: /* @__PURE__ */ jsxs("div", { className: styles.content, children: [
    /* @__PURE__ */ jsx("h1", { className: styles.heading, children: "A short heading about [your app]" }),
    /* @__PURE__ */ jsx("p", { className: styles.text, children: "A tagline about [your app] that describes your value proposition." }),
    showForm && /* @__PURE__ */ jsxs(Form, { className: styles.form, method: "post", action: "/auth/login", children: [
      /* @__PURE__ */ jsxs("label", { className: styles.label, children: [
        /* @__PURE__ */ jsx("span", { children: "Shop domain" }),
        /* @__PURE__ */ jsx("input", { className: styles.input, type: "text", name: "shop" }),
        /* @__PURE__ */ jsx("span", { children: "e.g: my-shop-domain.myshopify.com" })
      ] }),
      /* @__PURE__ */ jsx("button", { className: styles.button, type: "submit", children: "Log in" })
    ] }),
    /* @__PURE__ */ jsxs("ul", { className: styles.list, children: [
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Product feature" }),
        ". Some detail about your feature and its benefit to your customer."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Product feature" }),
        ". Some detail about your feature and its benefit to your customer."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Product feature" }),
        ". Some detail about your feature and its benefit to your customer."
      ] })
    ] })
  ] }) });
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App$1,
  loader: loader$7
}, Symbol.toStringTag, { value: "Module" }));
const loader$6 = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{ rel: "stylesheet", href: polarisStyles }];
const loader$5 = async ({ request }) => {
  await authenticate.admin(request);
  return {
    apiKey: process.env.SHOPIFY_API_KEY || "",
    appId: process.env.SHOPIFY_APP_ID || ""
  };
};
function App() {
  const { apiKey } = useLoaderData();
  return /* @__PURE__ */ jsx(AppProvider, { i18n: enTranslations, children: /* @__PURE__ */ jsxs(AppProvider$1, { isEmbeddedApp: true, apiKey, children: [
    /* @__PURE__ */ jsxs(NavMenu, { children: [
      /* @__PURE__ */ jsx(Link, { to: "/app", rel: "home", children: "Reviews Overview" }),
      /* @__PURE__ */ jsx(Link, { to: "/app/create-bundle", children: "Create Bundle" }),
      /* @__PURE__ */ jsx(Link, { to: "/app/settings", children: "Settings" })
    ] }),
    /* @__PURE__ */ jsx(Outlet, {})
  ] }) });
}
function ErrorBoundary() {
  return boundary.error(useRouteError());
}
const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: App,
  headers,
  links,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
function getNumericProductId$1(gid) {
  const parts = gid.split("/");
  return parts[parts.length - 1];
}
async function isReviewInBundle(reviewId, shop) {
  try {
    const originalReview = await db$1.productReview.findFirst({
      where: { id: reviewId, shop },
      select: { productId: true, isBundleReview: true }
    });
    if (!originalReview) {
      return { inBundle: false };
    }
    const productNumericId = getNumericProductId$1(originalReview.productId);
    const bundleConfig = await db$1.reviewBundle.findFirst({
      where: {
        shop,
        productIds: { contains: productNumericId }
      }
    });
    if (bundleConfig) {
      return {
        inBundle: true,
        bundleId: bundleConfig.id,
        isSyndicated: originalReview.isBundleReview
      };
    }
    return { inBundle: false };
  } catch (error) {
    return { inBundle: false };
  }
}
async function isFirstApproval(reviewId) {
  try {
    const existingSyndications = await db$1.reviewSyndication.count({
      where: { originalReviewId: reviewId }
    });
    return existingSyndications === 0;
  } catch (error) {
    return true;
  }
}
async function removeSyndicatedReviewForProduct(originalReviewId, targetProductId) {
  try {
    const syndicationEntry = await db$1.reviewSyndication.findFirst({
      where: {
        originalReviewId,
        productId: targetProductId
      }
    });
    if (syndicationEntry) {
      await db$1.productReview.deleteMany({
        where: {
          id: syndicationEntry.syndicatedReviewId
        }
      });
      await db$1.bundleReview.deleteMany({
        where: {
          reviewId: originalReviewId,
          productId: targetProductId
        }
      });
      await db$1.reviewSyndication.delete({
        where: { id: syndicationEntry.id }
      });
      return { success: true, removedCount: 1 };
    } else {
      return { success: true, removedCount: 0 };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}
async function syndicateReviewToBundle(reviewId, bundleId, shop) {
  try {
    const bundle = await db$1.reviewBundle.findFirst({
      where: { id: bundleId, shop }
    });
    if (!bundle) {
      return { success: false, error: "Bundle not found" };
    }
    const originalReview = await db$1.productReview.findFirst({
      where: { id: reviewId, shop },
      include: { images: true }
    });
    if (!originalReview) {
      return { success: false, error: "Original review not found" };
    }
    const bundleProductIds = bundle.productIds.split(",");
    const originalProductNumericId = getNumericProductId$1(originalReview.productId);
    let syndicatedCount = 0;
    for (const targetProductId of bundleProductIds) {
      if (targetProductId === originalProductNumericId) {
        continue;
      }
      const existingSyndication = await db$1.reviewSyndication.findFirst({
        where: {
          originalReviewId: reviewId,
          productId: targetProductId
        }
      });
      if (existingSyndication) {
        await db$1.productReview.update({
          where: { id: existingSyndication.syndicatedReviewId },
          data: {
            rating: originalReview.rating,
            author: originalReview.author,
            email: originalReview.email,
            title: originalReview.title,
            content: originalReview.content,
            status: "approved",
            images: {
              deleteMany: {},
              create: originalReview.images.map((img) => ({
                url: img.url,
                altText: img.altText,
                order: img.order
              }))
            }
          }
        });
        syndicatedCount++;
        continue;
      }
      const syndicatedReview = await db$1.productReview.create({
        data: {
          shop,
          productId: targetProductId,
          rating: originalReview.rating,
          author: originalReview.author,
          email: originalReview.email,
          title: originalReview.title,
          content: originalReview.content,
          status: "approved",
          isBundleReview: true,
          bundleContext: `Syndicated from ${bundle.name} (Original: ${reviewId})`,
          images: {
            create: originalReview.images.map((img) => ({
              url: img.url,
              altText: img.altText,
              order: img.order
            }))
          }
        }
      });
      await db$1.bundleReview.create({
        data: {
          bundleProductId: bundle.bundleProductId,
          reviewId,
          productId: targetProductId
        }
      });
      await db$1.reviewSyndication.create({
        data: {
          originalReviewId: reviewId,
          syndicatedReviewId: syndicatedReview.id,
          bundleId,
          productId: targetProductId
        }
      });
      syndicatedCount++;
    }
    return { success: true, syndicatedCount };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
async function removeSyndicatedReviews(originalReviewId) {
  try {
    const syndicationEntries = await db$1.reviewSyndication.findMany({
      where: { originalReviewId }
    });
    let deletedCount = 0;
    for (const entry2 of syndicationEntries) {
      try {
        await db$1.productReview.deleteMany({
          where: {
            id: entry2.syndicatedReviewId
          }
        });
        await db$1.bundleReview.deleteMany({
          where: {
            reviewId: originalReviewId,
            productId: entry2.productId
          }
        });
        await db$1.reviewSyndication.delete({
          where: { id: entry2.id }
        });
        deletedCount++;
      } catch (entryError) {
      }
    }
    return { success: true, syndicatedCount: deletedCount };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
async function updateSyndicatedReviewsStatus(originalReviewId, status) {
  try {
    const syndicationEntries = await db$1.reviewSyndication.findMany({
      where: { originalReviewId }
    });
    let updatedCount = 0;
    for (const entry2 of syndicationEntries) {
      try {
        await db$1.productReview.update({
          where: { id: entry2.syndicatedReviewId },
          data: { status }
        });
        updatedCount++;
      } catch (entryError) {
      }
    }
    return { success: true, updatedCount };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
async function action$4({ request, params }) {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;
  const reviewId = params.id;
  if (!reviewId) {
    return json({ error: "Review ID is required" }, { status: 400 });
  }
  const formData = await request.formData();
  const intent = formData.get("intent");
  const actionSource = formData.get("actionSource");
  try {
    const currentReview = await db$1.productReview.findFirst({
      where: { id: reviewId, shop },
      select: { productId: true, isBundleReview: true, bundleContext: true, status: true }
    });
    if (!currentReview) {
      return json({ error: "Review not found" }, { status: 404 });
    }
    let productNumericId = getNumericProductId$1(currentReview.productId);
    let productsToUpdateMetafields = [productNumericId];
    const bundleInfo = await isReviewInBundle(reviewId, shop);
    if (bundleInfo.inBundle && bundleInfo.bundleId) {
      const bundleConfig = await db$1.reviewBundle.findUnique({
        where: { id: bundleInfo.bundleId, shop }
      });
      if (bundleConfig) {
        const bundleProductIds = bundleConfig.productIds.split(",");
        productsToUpdateMetafields.push(...bundleProductIds);
      }
    }
    switch (intent) {
      case "delete":
        return await handleDeleteReview(reviewId, productsToUpdateMetafields, admin, shop, currentReview, bundleInfo, actionSource);
      case "edit":
        return await handleEditReview(reviewId, formData, productsToUpdateMetafields, admin, shop, actionSource, currentReview, bundleInfo);
      default:
        return json({ error: "Invalid intent" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing action:", error);
    return json({
      error: `Failed to process request: ${error instanceof Error ? error.message : "Unknown error"}`
    }, { status: 500 });
  }
}
async function handleDeleteReview(reviewId, productsToUpdate, admin, shop, currentReview, bundleInfo, actionSource) {
  let productsToRecalculate = [...productsToUpdate];
  if (bundleInfo.inBundle) {
    if (actionSource === "bundle") {
      const originalId = bundleInfo.isSyndicated ? await findOriginalReviewId$1(reviewId) : reviewId;
      if (originalId) {
        await removeSyndicatedReviews(originalId);
        reviewId = originalId;
      }
    } else if (actionSource === "individual") {
      if (bundleInfo.isSyndicated) {
        const originalId = await findOriginalReviewId$1(reviewId);
        if (originalId) {
          await removeSyndicatedReviewForProduct(originalId, getNumericProductId$1(currentReview.productId));
        }
      } else {
        await removeSyndicatedReviews(reviewId);
      }
    }
  }
  await db$1.productReview.delete({ where: { id: reviewId } });
  const uniqueProductsToUpdate = Array.from(new Set(productsToRecalculate)).filter((id) => id && id !== "undefined");
  console.log(`[Review Deletion] Updating metafields for ${uniqueProductsToUpdate.length} products:`, uniqueProductsToUpdate);
  const metafieldResults = [];
  for (const id of uniqueProductsToUpdate) {
    const result = await calculateAndUpdateProductMetafields(id, admin, shop);
    metafieldResults.push({ productId: id, ...result });
    if (!result.success) {
      console.error(`[Review Deletion] ⚠️ Metafield update failed for product ${id}:`, result.error);
    } else {
      console.log(`[Review Deletion] ✅ Metafield updated for product ${id}: Rating=${result.rating}, Count=${result.count}`);
    }
  }
  const allSuccessful = metafieldResults.every((r) => r.success);
  return json({
    success: true,
    message: "Review deleted successfully",
    metafieldUpdates: {
      successful: allSuccessful,
      results: metafieldResults
    }
  });
}
async function handleEditReview(reviewId, formData, productsToUpdate, admin, shop, actionSource, currentReview, bundleInfo) {
  var _a2, _b, _c, _d, _e, _f;
  const title = (_a2 = formData.get("title")) == null ? void 0 : _a2.toString();
  const content2 = (_b = formData.get("content")) == null ? void 0 : _b.toString();
  const rating = (_c = formData.get("rating")) == null ? void 0 : _c.toString();
  const author = (_d = formData.get("author")) == null ? void 0 : _d.toString();
  const email = (_e = formData.get("email")) == null ? void 0 : _e.toString();
  const status = (_f = formData.get("status")) == null ? void 0 : _f.toString();
  const imagesToRemove = formData.getAll("imagesToRemove[]");
  if (!title || !content2 || !rating || !author) {
    return json({ error: "All required fields must be filled out" }, { status: 400 });
  }
  const parsedRating = parseInt(rating, 10);
  if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    return json({ error: "Rating must be a number between 1 and 5" }, { status: 400 });
  }
  try {
    if (imagesToRemove.length > 0) {
      await db$1.reviewImage.deleteMany({
        where: {
          id: { in: imagesToRemove },
          reviewId
        }
      });
    }
    const updatedReview = await db$1.productReview.update({
      where: { id: reviewId },
      data: {
        title,
        content: content2,
        rating: parsedRating,
        author,
        email: email || void 0,
        status: status || "pending"
      },
      include: { images: { select: { id: true, url: true, altText: true, order: true } } }
    });
    if (bundleInfo.inBundle) {
      if (actionSource === "bundle" && !bundleInfo.isSyndicated) {
        const syndicatedCopies = await db$1.reviewSyndication.findMany({
          where: { originalReviewId: reviewId },
          select: { syndicatedReviewId: true }
        });
        const copyIds = syndicatedCopies.map((c) => c.syndicatedReviewId);
        if (copyIds.length > 0) {
          await db$1.productReview.updateMany({
            where: { id: { in: copyIds } },
            data: {
              title,
              content: content2,
              rating: parsedRating,
              author,
              email: email || void 0,
              status: status || "pending"
            }
          });
        }
      }
    }
    const uniqueProductsToUpdate = Array.from(new Set(productsToUpdate)).filter((id) => id && id !== "undefined");
    console.log(`[Review Edit] Updating metafields for ${uniqueProductsToUpdate.length} products:`, uniqueProductsToUpdate);
    const metafieldResults = [];
    for (const id of uniqueProductsToUpdate) {
      const result = await calculateAndUpdateProductMetafields(id, admin, shop);
      metafieldResults.push({ productId: id, ...result });
      if (!result.success) {
        console.error(`[Review Edit] ⚠️ Metafield update failed for product ${id}:`, result.error);
      } else {
        console.log(`[Review Edit] ✅ Metafield updated for product ${id}: Rating=${result.rating}, Count=${result.count}`);
      }
    }
    const allSuccessful = metafieldResults.every((r) => r.success);
    return json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview,
      metafieldUpdates: {
        successful: allSuccessful,
        results: metafieldResults
      }
    });
  } catch (error) {
    console.error("Error in edit transaction:", error);
    return json({ error: `Failed to update review: ${error instanceof Error ? error.message : "Unknown error"}` }, { status: 500 });
  }
}
async function findOriginalReviewId$1(syndicatedReviewId) {
  try {
    const syndicationEntry = await db$1.reviewSyndication.findFirst({
      where: {
        syndicatedReviewId
      },
      select: { originalReviewId: true }
    });
    return syndicationEntry ? syndicationEntry.originalReviewId : null;
  } catch (error) {
    console.error("Error finding original review:", error);
    return null;
  }
}
async function loader$4() {
  return redirect("/app");
}
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
async function action$3({ request, params }) {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;
  const reviewId = params.id;
  const formData = await request.formData();
  const status = formData.get("status");
  const actionSource = formData.get("actionSource");
  if (!reviewId || typeof status !== "string" || !["pending", "approved", "rejected"].includes(status)) {
    return json({ error: "Invalid request data." }, { status: 400 });
  }
  try {
    const currentReview = await db$1.productReview.findFirst({
      where: { id: reviewId, shop },
      select: {
        productId: true,
        isBundleReview: true,
        bundleContext: true,
        status: true
      }
    });
    if (!currentReview || !currentReview.productId) {
      return json({ message: "Review not found." }, { status: 404 });
    }
    const productNumericId = getNumericProductId$1(currentReview.productId);
    let productsToUpdateMetafields = [productNumericId];
    const bundleInfo = await isReviewInBundle(reviewId, shop);
    let bundleConfig = null;
    if (bundleInfo.inBundle && bundleInfo.bundleId) {
      bundleConfig = await db$1.reviewBundle.findUnique({
        where: { id: bundleInfo.bundleId, shop }
      });
      if (bundleConfig) {
        const bundleProductIds = bundleConfig.productIds.split(",");
        if (actionSource === "bundle") {
          productsToUpdateMetafields.push(...bundleProductIds);
        }
      }
    }
    if (actionSource === "bundle" && bundleConfig) {
      if (status === "approved") {
        const isFirstTimeApproval = await isFirstApproval(reviewId);
        if (isFirstTimeApproval) {
          await syndicateReviewToBundle(reviewId, bundleConfig.id, shop);
        } else {
          await updateSyndicatedReviewsStatus(reviewId, "approved");
        }
        await db$1.productReview.update({
          where: { id: reviewId },
          data: { status: "approved" }
        });
      } else if (status === "rejected") {
        await db$1.productReview.update({
          where: { id: reviewId },
          data: { status: "rejected" }
        });
        const originalReviewId = bundleInfo.isSyndicated ? await findOriginalReviewId(reviewId) : reviewId;
        if (originalReviewId) {
          await updateSyndicatedReviewsStatus(originalReviewId, "rejected");
        }
      } else if (status === "pending") {
        await db$1.productReview.update({
          where: { id: reviewId },
          data: { status: "pending" }
        });
        const originalReviewId = bundleInfo.isSyndicated ? await findOriginalReviewId(reviewId) : reviewId;
        if (originalReviewId) {
          await updateSyndicatedReviewsStatus(originalReviewId, "pending");
        }
      }
    } else if (actionSource === "individual") {
      await db$1.productReview.update({
        where: { id: reviewId },
        data: { status }
      });
      if (!bundleInfo.isSyndicated) {
        productsToUpdateMetafields = [productNumericId];
      }
    } else {
      await db$1.productReview.update({
        where: { id: reviewId },
        data: { status }
      });
    }
    const uniqueProductsToUpdate = Array.from(new Set(productsToUpdateMetafields)).filter((id) => id && id !== "undefined");
    for (const productId of uniqueProductsToUpdate) {
      await calculateAndUpdateProductMetafields(productId, admin, shop);
    }
    return json({ success: true, message: `Review status updated to ${status}.` });
  } catch (error) {
    console.error(` Failed to update review status for ID ${reviewId}:`, error);
    return json({ error: "Failed to update review status." }, { status: 500 });
  }
}
async function findOriginalReviewId(syndicatedReviewId) {
  try {
    const syndicationEntry = await db$1.reviewSyndication.findFirst({
      where: {
        syndicatedReviewId
      },
      select: { originalReviewId: true }
    });
    return syndicationEntry ? syndicationEntry.originalReviewId : null;
  } catch (error) {
    console.error("Error finding original review:", error);
    return null;
  }
}
async function loader$3() {
  throw redirect("/app");
}
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const getGidProductId = (numericId) => {
  return `gid://shopify/Product/${numericId}`;
};
const getNumericProductId = (gid) => {
  const parts = gid.split("/");
  return parts[parts.length - 1];
};
const ensureShopifyGid = (productId) => {
  if (productId.startsWith("gid://shopify/Product/")) {
    return productId;
  }
  return `gid://shopify/Product/${productId}`;
};
function useBundleManager() {
  const { products, bundles } = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [activeModal, setActiveModal] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [currentBundle, setCurrentBundle] = useState(null);
  const [bundleName, setBundleName] = useState("");
  const [selectedProductGids, setSelectedProductGids] = useState([]);
  const [activeToast, setActiveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastError, setToastError] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const productMap = new Map(products.map((p) => [p.id, p]));
  useEffect(() => {
    if (actionData) {
      setToastMessage(actionData.message || actionData.error || "Action completed.");
      setToastError(!actionData.success);
      if (actionData.success) {
        setActiveModal(false);
        setBundleName("");
        setSelectedProductGids([]);
        setCurrentBundle(null);
      }
      setActiveToast(true);
    }
  }, [actionData]);
  const toggleActiveToast = useCallback(() => setActiveToast((active) => !active), []);
  const handleModalOpen = (type, bundle = null) => {
    setModalType(type);
    setCurrentBundle(bundle);
    if (type === "edit" && bundle) {
      setBundleName(bundle.name);
      const gids = bundle.productIds.map(getGidProductId);
      setSelectedProductGids(gids);
    } else if (type === "create") {
      setBundleName("");
      setSelectedProductGids([]);
    }
    setActiveModal(true);
  };
  const handleModalClose = useCallback(() => {
    setActiveModal(false);
    setBundleName("");
    setSelectedProductGids([]);
    setCurrentBundle(null);
    setProductSearchTerm("");
  }, []);
  const handleProductSelection = useCallback((productIdGid) => {
    setSelectedProductGids(
      (prev) => prev.includes(productIdGid) ? prev.filter((id) => id !== productIdGid) : [...prev, productIdGid]
    );
  }, []);
  const handleFormSubmit = useCallback((intent, bundleId) => {
    const formData = new FormData();
    formData.append("intent", intent);
    formData.append("bundleName", bundleName.trim());
    if (bundleId) formData.append("bundleId", bundleId);
    const sortedGids = [...selectedProductGids].sort((a, b) => {
      const currentMainGid = currentBundle ? getGidProductId(currentBundle.bundleProductId) : selectedProductGids[0];
      if (a === currentMainGid && b !== currentMainGid) return -1;
      if (b === currentMainGid && a !== currentMainGid) return 1;
      return 0;
    });
    sortedGids.forEach((gid) => {
      formData.append("productIds[]", gid);
    });
    submit(formData, { method: "post" });
  }, [bundleName, selectedProductGids, currentBundle, submit]);
  const filteredProducts = products.filter(
    (p) => p.title.toLowerCase().includes(productSearchTerm.toLowerCase()) || p.numericId.includes(productSearchTerm)
  );
  return {
    products,
    bundles,
    isSubmitting,
    activeModal,
    modalType,
    currentBundle,
    bundleName,
    selectedProductGids,
    activeToast,
    toastMessage,
    toastError,
    productSearchTerm,
    productMap,
    filteredProducts,
    setBundleName,
    setProductSearchTerm,
    toggleActiveToast,
    handleModalOpen,
    handleModalClose,
    handleProductSelection,
    handleFormSubmit,
    setActiveToast
  };
}
function BundleListSection({
  bundles,
  isSubmitting,
  handleModalOpen,
  getProductsForBundle
}) {
  return /* @__PURE__ */ jsxs(Card, { padding: "0", children: [
    /* @__PURE__ */ jsxs(Box, { padding: "400", children: [
      /* @__PURE__ */ jsxs(InlineStack, { align: "space-between", blockAlign: "center", children: [
        /* @__PURE__ */ jsxs(Text, { as: "h2", variant: "headingLg", fontWeight: "semibold", children: [
          "Existing Review Bundles (",
          bundles.length,
          ")"
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "primary",
            icon: PlusIcon,
            onClick: () => handleModalOpen("create", null),
            disabled: isSubmitting,
            children: "Create New Bundle"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(Box, { paddingBlockStart: "400", children: /* @__PURE__ */ jsx(Divider, {}) })
    ] }),
    bundles.length > 0 ? /* @__PURE__ */ jsx(
      ResourceList,
      {
        resourceName: { singular: "bundle", plural: "bundles" },
        items: bundles,
        renderItem: (bundle) => {
          const productsInBundle = getProductsForBundle(bundle);
          const mainProduct = productsInBundle.find((p) => p.numericId === bundle.bundleProductId);
          const otherProductsCount = productsInBundle.length - 1;
          return /* @__PURE__ */ jsx(
            ResourceItem,
            {
              id: bundle.id,
              url: "#",
              media: /* @__PURE__ */ jsx(Box, { background: "bg-fill-tertiary", borderRadius: "300", padding: "300", children: /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(Icon, { source: FolderIcon, tone: "base" }) }) }),
              accessibilityLabel: `View bundle ${bundle.name}`,
              shortcutActions: [
                {
                  content: "Edit",
                  onAction: () => handleModalOpen("edit", bundle),
                  disabled: isSubmitting
                },
                {
                  content: "Delete",
                  onAction: () => handleModalOpen("delete", bundle),
                  disabled: isSubmitting
                }
              ],
              children: /* @__PURE__ */ jsxs(BlockStack, { gap: "100", children: [
                /* @__PURE__ */ jsx(Text, { as: "h3", variant: "bodyLg", fontWeight: "semibold", children: bundle.name }),
                /* @__PURE__ */ jsxs(InlineStack, { gap: "100", blockAlign: "center", wrap: false, children: [
                  /* @__PURE__ */ jsx(Badge, { size: "small", tone: "success", children: `Main: ${(mainProduct == null ? void 0 : mainProduct.title) || "Unknown Product"}` }),
                  otherProductsCount > 0 && /* @__PURE__ */ jsx(Badge, { size: "small", children: `+${otherProductsCount} ${otherProductsCount === 1 ? "Product" : "Products"}` })
                ] }),
                /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodySm", tone: "subdued", children: [
                  "Products: ",
                  productsInBundle.map((p) => p.title).join(", ")
                ] })
              ] })
            }
          );
        }
      }
    ) : /* @__PURE__ */ jsx(Box, { padding: "600", children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", align: "center", children: [
      /* @__PURE__ */ jsx(Icon, { source: FolderIcon, tone: "subdued" }),
      /* @__PURE__ */ jsx(Text, { as: "h3", variant: "headingMd", alignment: "center", children: "No Review Bundles configured yet" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: () => handleModalOpen("create", null),
          disabled: isSubmitting,
          icon: PlusIcon,
          variant: "primary",
          children: "Create Your First Bundle"
        }
      )
    ] }) })
  ] });
}
function BundleFormModal({
  activeModal,
  modalType,
  handleModalClose,
  currentBundleName,
  bundleName,
  setBundleName,
  handleFormSubmit,
  isSubmitting,
  selectedProductGids,
  productMap,
  productSearchTerm,
  setProductSearchTerm,
  filteredProducts,
  handleProductSelection,
  currentBundleId,
  getNumericProductId: getNumericProductId2
}) {
  var _a2;
  const getProductMedia = (product) => /* @__PURE__ */ jsx(Box, { paddingInlineEnd: "200", children: /* @__PURE__ */ jsx(
    Thumbnail,
    {
      source: product.imageUrl || `https://placehold.co/80x80/f6f6f7/6d7175?text=${encodeURIComponent(product.title.split(" ")[0])}`,
      alt: `Image of ${product.title}`,
      size: "small"
    }
  ) });
  return /* @__PURE__ */ jsx(
    Modal,
    {
      open: activeModal && (modalType === "create" || modalType === "edit"),
      onClose: handleModalClose,
      title: modalType === "create" ? "Create New Review Bundle" : `Edit Bundle: ${currentBundleName}`,
      size: "large",
      primaryAction: {
        content: modalType === "create" ? "Create Bundle" : "Save Changes",
        onAction: () => handleFormSubmit(`${modalType}-bundle`, currentBundleId),
        loading: isSubmitting,
        disabled: !bundleName.trim() || selectedProductGids.length < 2 || isSubmitting
      },
      secondaryActions: [
        {
          content: "Cancel",
          onAction: handleModalClose
        }
      ],
      children: /* @__PURE__ */ jsx(Modal.Section, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "500", children: [
        /* @__PURE__ */ jsx(
          TextField,
          {
            label: "Bundle Name",
            value: bundleName,
            onChange: setBundleName,
            helpText: "A unique name for this review group (e.g., 'Summer Collection')",
            autoComplete: "off",
            disabled: isSubmitting
          }
        ),
        /* @__PURE__ */ jsx(Banner, { tone: "info", children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
          /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyMd", children: "Select the products to be included in this bundle. The **first product selected** will be the default Bundle Product ID. You must select at least **2 products**." }),
          selectedProductGids.length > 0 && /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodySm", fontWeight: "semibold", tone: "success", children: [
            "Main Product: ",
            ((_a2 = productMap.get(selectedProductGids[0])) == null ? void 0 : _a2.title) || "Selecting..."
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(Card, { padding: "0", children: [
          /* @__PURE__ */ jsx(Box, { padding: "400", children: /* @__PURE__ */ jsx(
            TextField,
            {
              label: "Search Products to Include",
              value: productSearchTerm,
              onChange: setProductSearchTerm,
              autoComplete: "off",
              disabled: isSubmitting,
              placeholder: "Search by title or ID..."
            }
          ) }),
          /* @__PURE__ */ jsx(
            ResourceList,
            {
              resourceName: { singular: "product", plural: "products" },
              items: filteredProducts,
              renderItem: (product) => {
                const isSelected = selectedProductGids.includes(product.id);
                const isMainProduct = isSelected && selectedProductGids[0] === product.id;
                return /* @__PURE__ */ jsx(
                  ResourceItem,
                  {
                    id: product.id,
                    media: getProductMedia(product),
                    onClick: () => handleProductSelection(product.id),
                    children: /* @__PURE__ */ jsxs(InlineGrid, { columns: "1fr auto", gap: "400", alignItems: "center", children: [
                      /* @__PURE__ */ jsxs(BlockStack, { gap: "100", children: [
                        /* @__PURE__ */ jsx(Text, { as: "h3", variant: "bodyLg", fontWeight: "semibold", children: product.title }),
                        /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodyMd", tone: "subdued", children: [
                          "ID: ",
                          product.numericId
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs(InlineStack, { gap: "200", children: [
                        isMainProduct && /* @__PURE__ */ jsx(Badge, { tone: "info", children: "Main ID" }),
                        /* @__PURE__ */ jsx("div", { onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsx(
                          Checkbox,
                          {
                            label: "",
                            labelHidden: true,
                            checked: isSelected,
                            onChange: () => handleProductSelection(product.id)
                          }
                        ) })
                      ] })
                    ] })
                  }
                );
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(Box, { padding: "400", background: "bg-fill-secondary", borderRadius: "200", children: [
          /* @__PURE__ */ jsxs(Text, { as: "h4", variant: "bodyMd", fontWeight: "semibold", children: [
            "Selected Products (",
            selectedProductGids.length,
            ")"
          ] }),
          /* @__PURE__ */ jsx(BlockStack, { gap: "100", children: selectedProductGids.map((gid) => {
            var _a3;
            return /* @__PURE__ */ jsxs(InlineStack, { align: "space-between", blockAlign: "center", children: [
              /* @__PURE__ */ jsx(Text, { as: "span", variant: "bodySm", children: ((_a3 = productMap.get(gid)) == null ? void 0 : _a3.title) || getNumericProductId2(gid) }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  icon: MinusIcon,
                  onClick: () => handleProductSelection(gid),
                  size: "slim",
                  variant: "plain",
                  tone: "critical"
                }
              )
            ] }, gid);
          }) })
        ] })
      ] }) })
    }
  );
}
function DeleteBundleModal({
  activeModal,
  modalType,
  handleModalClose,
  currentBundleName,
  handleFormSubmit,
  currentBundleId,
  isSubmitting
}) {
  return /* @__PURE__ */ jsx(
    Modal,
    {
      open: activeModal && modalType === "delete",
      onClose: handleModalClose,
      title: "Delete Review Bundle",
      primaryAction: {
        content: "Delete Bundle",
        onAction: () => handleFormSubmit("delete-bundle", currentBundleId),
        destructive: true,
        loading: isSubmitting
      },
      secondaryActions: [
        {
          content: "Cancel",
          onAction: handleModalClose
        }
      ],
      children: /* @__PURE__ */ jsx(Modal.Section, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
        /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodyLg", children: [
          "Are you sure you want to delete the bundle **",
          currentBundleName,
          "**?"
        ] }),
        /* @__PURE__ */ jsx(Banner, { tone: "warning", children: "This action will **only delete the bundle configuration**. Existing reviews and syndicated links will remain in the database, but no further syndication will occur for these products." })
      ] }) })
    }
  );
}
async function loader$2({ request }) {
  var _a2, _b;
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;
  const bundles = await db$1.reviewBundle.findMany({
    where: { shop },
    orderBy: { createdAt: "desc" }
  });
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
  const shopifyProducts = (((_b = (_a2 = data.data) == null ? void 0 : _a2.products) == null ? void 0 : _b.edges) || []).map((edge) => {
    var _a3, _b2, _c, _d;
    return {
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
      imageUrl: ((_d = (_c = (_b2 = (_a3 = edge.node.images) == null ? void 0 : _a3.edges) == null ? void 0 : _b2[0]) == null ? void 0 : _c.node) == null ? void 0 : _d.url) || null,
      numericId: getNumericProductId(edge.node.id)
    };
  });
  const serializableBundles = bundles.map((b) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
    productIds: b.productIds.split(",")
  }));
  return json$1({ products: shopifyProducts, bundles: serializableBundles });
}
async function action$2({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  const intent = formData.get("intent");
  try {
    if (intent === "create-bundle" || intent === "edit-bundle") {
      const bundleName = formData.get("bundleName");
      const selectedProductGids = formData.getAll("productIds[]");
      const bundleId = formData.get("bundleId");
      const bundleProductIdGid = selectedProductGids[0];
      if (!bundleName || selectedProductGids.length < 2) {
        return json$1({ success: false, error: "A bundle must have a name and include at least 2 products." }, { status: 400 });
      }
      const numericProductIds = selectedProductGids.map(getNumericProductId);
      const numericBundleProductId = getNumericProductId(bundleProductIdGid);
      const productIdsString = numericProductIds.join(",");
      if (intent === "create-bundle") {
        const newBundle = await db$1.reviewBundle.create({
          data: {
            shop,
            name: bundleName,
            bundleProductId: numericBundleProductId,
            productIds: productIdsString
          }
        });
        return json$1({ success: true, message: `Bundle '${newBundle.name}' created successfully.` });
      } else if (intent === "edit-bundle" && bundleId) {
        const updatedBundle = await db$1.reviewBundle.update({
          where: { id: bundleId, shop },
          data: {
            name: bundleName,
            bundleProductId: numericBundleProductId,
            productIds: productIdsString
          }
        });
        return json$1({ success: true, message: `Bundle '${updatedBundle.name}' updated successfully.` });
      }
    } else if (intent === "delete-bundle") {
      const bundleId = formData.get("bundleId");
      await db$1.reviewBundle.delete({ where: { id: bundleId, shop } });
      return json$1({ success: true, message: "Bundle deleted successfully." });
    }
    return json$1({ success: false, error: "Invalid intent or missing data." }, { status: 400 });
  } catch (error) {
    console.error("Error managing bundle:", error);
    if (error.code === "P2002") {
      return json$1({ success: false, error: `Bundle creation failed. The name or the selected main product might already be in use.` }, { status: 409 });
    }
    return json$1({ success: false, error: error.message || "Failed to process bundle action." }, { status: 500 });
  }
}
function BundleReviewsPage() {
  const {
    bundles,
    isSubmitting,
    activeModal,
    modalType,
    currentBundle,
    bundleName,
    selectedProductGids,
    activeToast,
    toastMessage,
    toastError,
    productSearchTerm,
    productMap,
    filteredProducts,
    setBundleName,
    setProductSearchTerm,
    handleModalOpen,
    handleModalClose,
    handleProductSelection,
    handleFormSubmit,
    setActiveToast
  } = useBundleManager();
  const getProductsForBundle = (bundle) => {
    return bundle.productIds.map((numericId) => {
      const gid = getGidProductId(numericId);
      return productMap.get(gid) || {
        id: gid,
        title: `Product ${numericId} (Not found)`,
        handle: "#",
        imageUrl: null,
        numericId
      };
    });
  };
  const toastMarkup = activeToast ? /* @__PURE__ */ jsx(Toast, { content: toastMessage, onDismiss: () => setActiveToast(false), error: toastError }) : null;
  return /* @__PURE__ */ jsxs(Page, { fullWidth: true, children: [
    /* @__PURE__ */ jsx(TitleBar, { title: "Review Bundles Management" }),
    /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
      /* @__PURE__ */ jsx(
        Banner,
        {
          title: "Review Syndication Feature",
          tone: "info",
          children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
            /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyMd", children: "Create **Review Bundles** to automatically share approved reviews between a group of products." }),
            /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyMd", fontWeight: "semibold", children: "The **first product selected** in a bundle will be designated as the main bundle ID." }),
            /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodySm", tone: "subdued", children: "If any product in a bundle receives an approved review, that review will be syndicated (copied) to all other products in that bundle." })
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        BundleListSection,
        {
          bundles,
          isSubmitting,
          handleModalOpen,
          getProductsForBundle
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsx(
      BundleFormModal,
      {
        activeModal,
        modalType,
        handleModalClose,
        currentBundleName: currentBundle == null ? void 0 : currentBundle.name,
        bundleName,
        setBundleName,
        handleFormSubmit,
        isSubmitting,
        selectedProductGids,
        productMap,
        productSearchTerm,
        setProductSearchTerm,
        filteredProducts,
        handleProductSelection,
        currentBundleId: currentBundle == null ? void 0 : currentBundle.id,
        getNumericProductId
      }
    ),
    /* @__PURE__ */ jsx(
      DeleteBundleModal,
      {
        activeModal,
        modalType,
        handleModalClose,
        currentBundleName: currentBundle == null ? void 0 : currentBundle.name,
        handleFormSubmit,
        currentBundleId: currentBundle == null ? void 0 : currentBundle.id,
        isSubmitting
      }
    ),
    toastMarkup
  ] });
}
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2,
  default: BundleReviewsPage,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
function AdditionalPage() {
  return /* @__PURE__ */ jsxs(Page, { children: [
    /* @__PURE__ */ jsx(TitleBar, { title: "Additional page" }),
    /* @__PURE__ */ jsxs(Layout, { children: [
      /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
        /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodyMd", children: [
          "The app template comes with an additional page which demonstrates how to create multiple pages within app navigation using",
          " ",
          /* @__PURE__ */ jsx(
            Link$1,
            {
              url: "https://shopify.dev/docs/apps/tools/app-bridge",
              target: "_blank",
              removeUnderline: true,
              children: "App Bridge"
            }
          ),
          "."
        ] }),
        /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodyMd", children: [
          "To create your own page and have it show up in the app navigation, add a page inside ",
          /* @__PURE__ */ jsx(Code, { children: "app/routes" }),
          ", and a link to it in the ",
          /* @__PURE__ */ jsx(Code, { children: "<NavMenu>" }),
          " component found in ",
          /* @__PURE__ */ jsx(Code, { children: "app/routes/app.jsx" }),
          "."
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx(Layout.Section, { variant: "oneThird", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
        /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingMd", children: "Resources" }),
        /* @__PURE__ */ jsx(List, { children: /* @__PURE__ */ jsx(List.Item, { children: /* @__PURE__ */ jsx(
          Link$1,
          {
            url: "https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav",
            target: "_blank",
            removeUnderline: true,
            children: "App nav best practices"
          }
        ) }) })
      ] }) }) })
    ] })
  ] });
}
function Code({ children }) {
  return /* @__PURE__ */ jsx(
    Box,
    {
      as: "span",
      padding: "025",
      paddingInlineStart: "100",
      paddingInlineEnd: "100",
      background: "bg-surface-active",
      borderWidth: "025",
      borderColor: "border",
      borderRadius: "100",
      children: /* @__PURE__ */ jsx("code", { children })
    }
  );
}
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdditionalPage
}, Symbol.toStringTag, { value: "Module" }));
const hexToHsb = (hex) => {
  if (!hex) return { hue: 0, saturation: 0, brightness: 0, alpha: 1 };
  hex = hex.replace(/^#/, "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else if (max === b) h = (r - g) / d + 4;
    h /= 6;
  }
  return {
    hue: h * 360,
    saturation: max === 0 ? 0 : d / max,
    brightness: max,
    alpha: 1
  };
};
const getFontFamilyValue = (fontFamily, options) => {
  if (fontFamily === "theme") return "theme";
  if (fontFamily === "") return "custom";
  const predefinedValues = options.map((opt) => opt.value);
  return predefinedValues.includes(fontFamily) ? fontFamily : "custom";
};
const hsbToHex = (hsb) => {
  return rgbToHex(hsbToRgb(hsb));
};
const ColorSettingCard = ({
  title,
  description,
  color,
  onChange
}) => /* @__PURE__ */ jsx(Card, { padding: "400", children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
  /* @__PURE__ */ jsxs(InlineStack, { align: "space-between", blockAlign: "center", children: [
    /* @__PURE__ */ jsxs(BlockStack, { gap: "100", children: [
      /* @__PURE__ */ jsx(Text, { as: "h4", variant: "bodyMd", fontWeight: "semibold", children: title }),
      /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodySm", tone: "subdued", children: description })
    ] }),
    /* @__PURE__ */ jsx(Badge, { tone: "info", children: hsbToHex(color).toUpperCase() })
  ] }),
  /* @__PURE__ */ jsx(Box, { padding: "200", children: /* @__PURE__ */ jsx(
    ColorPicker,
    {
      onChange,
      color,
      allowAlpha: false
    }
  ) })
] }) });
const TextStylingSection = (props) => {
  const {
    headingText,
    setHeadingText,
    headingFontFamily,
    setHeadingFontFamily,
    headingFontSize,
    handleHeadingFontSizeChange,
    headingFontWeight,
    setHeadingFontWeight,
    headingFontStyle,
    setHeadingFontStyle,
    headingTextTransform,
    setHeadingTextTransform,
    headingLetterSpacing,
    handleHeadingLetterSpacingChange,
    headingLineHeight,
    handleHeadingLineHeightChange,
    headingTextShadow,
    setHeadingTextShadow,
    ratingLabelText,
    setRatingLabelText,
    ratingLabelFontFamily,
    setRatingLabelFontFamily,
    ratingLabelFontSize,
    handleRatingLabelFontSizeChange,
    ratingLabelFontWeight,
    setRatingLabelFontWeight,
    ratingLabelColor,
    handleRatingLabelColorChange,
    ratingValueFontFamily,
    setRatingValueFontFamily,
    ratingValueFontSize,
    handleRatingValueFontSizeChange,
    ratingValueFontWeight,
    setRatingValueFontWeight,
    ratingValueColor,
    handleRatingValueColorChange,
    reviewCountPrefix,
    setReviewCountPrefix,
    reviewCountSuffix,
    setReviewCountSuffix,
    reviewCountFontFamily,
    setReviewCountFontFamily,
    reviewCountFontSize,
    handleReviewCountFontSizeChange,
    reviewCountFontWeight,
    setReviewCountFontWeight,
    reviewCountColor,
    handleReviewCountColorChange,
    fontFamilyOptions: fontFamilyOptions2,
    fontWeightOptions: fontWeightOptions2,
    fontStyleOptions: fontStyleOptions2,
    textTransformOptions: textTransformOptions2,
    headingColor
  } = props;
  return /* @__PURE__ */ jsx(Box, { children: /* @__PURE__ */ jsxs(InlineGrid, { columns: { xs: "1fr", md: "1fr 2fr" }, gap: "600", alignItems: "start", children: [
    /* @__PURE__ */ jsx(BlockStack, { gap: "400", children: /* @__PURE__ */ jsxs(InlineStack, { gap: "300", blockAlign: "center", children: [
      /* @__PURE__ */ jsx(Box, { background: "bg-fill-brand", padding: "200", borderRadius: "300", children: /* @__PURE__ */ jsx("div", { style: { width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "bold" }, children: "🅰️" }) }),
      /* @__PURE__ */ jsxs(BlockStack, { gap: "100", children: [
        /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingMd", fontWeight: "semibold", children: "Text Styling" }),
        /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodySm", tone: "subdued", children: "Customize the appearance of all text elements in your review display." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Card, { padding: "400", children: /* @__PURE__ */ jsxs(BlockStack, { gap: "500", children: [
      /* @__PURE__ */ jsx(Box, { padding: "400", background: "bg-surface-secondary", borderRadius: "200", children: /* @__PURE__ */ jsx(Text, { as: "h3", variant: "headingSm", fontWeight: "semibold", children: "Main Heading" }) }),
      /* @__PURE__ */ jsxs(InlineGrid, { columns: { xs: "1fr", sm: "1fr 1fr" }, gap: "400", children: [
        /* @__PURE__ */ jsx(TextField, { label: "Heading Text", value: headingText, onChange: setHeadingText, helpText: "Main title text for the review section", autoComplete: "off" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            Select,
            {
              label: "Font Family",
              options: fontFamilyOptions2,
              value: getFontFamilyValue(headingFontFamily, fontFamilyOptions2),
              onChange: (value) => value === "custom" ? setHeadingFontFamily("") : setHeadingFontFamily(value),
              helpText: "Select 'Use theme body font' to match your store's typography, or choose from predefined fonts"
            }
          ),
          (headingFontFamily === "" || getFontFamilyValue(headingFontFamily, fontFamilyOptions2) === "custom") && /* @__PURE__ */ jsx(Box, { paddingBlockStart: "200", children: /* @__PURE__ */ jsx(TextField, { label: "Custom Font Family", value: headingFontFamily, onChange: setHeadingFontFamily, helpText: "Enter custom font family (e.g., 'Roboto, sans-serif')", autoComplete: "off", placeholder: "e.g., Roboto, sans-serif" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(InlineGrid, { columns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: "400", children: [
        /* @__PURE__ */ jsx(TextField, { label: "Font Size", value: headingFontSize === 0 ? "" : String(headingFontSize), onChange: handleHeadingFontSizeChange, type: "number", min: 10, max: 100, helpText: "Font size in pixels", autoComplete: "off", suffix: "px" }),
        /* @__PURE__ */ jsx(Select, { label: "Font Weight", options: fontWeightOptions2, value: headingFontWeight, onChange: setHeadingFontWeight, helpText: "Font weight (boldness)" }),
        /* @__PURE__ */ jsx(Select, { label: "Text Transform", options: textTransformOptions2, value: headingTextTransform, onChange: setHeadingTextTransform, helpText: "Text transformation" })
      ] }),
      /* @__PURE__ */ jsxs(InlineGrid, { columns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: "400", children: [
        /* @__PURE__ */ jsx(Select, { label: "Font Style", options: fontStyleOptions2, value: headingFontStyle, onChange: setHeadingFontStyle, helpText: "Font style" }),
        /* @__PURE__ */ jsx(TextField, { label: "Letter Spacing", value: headingLetterSpacing === 0 ? "" : String(headingLetterSpacing), onChange: handleHeadingLetterSpacingChange, type: "number", min: -10, max: 50, helpText: "Space between letters in pixels", autoComplete: "off", suffix: "px" }),
        /* @__PURE__ */ jsx(TextField, { label: "Line Height", value: headingLineHeight === 0 ? "" : String(headingLineHeight), onChange: handleHeadingLineHeightChange, type: "number", min: 0.5, max: 3, step: 0.1, helpText: "Line height multiplier", autoComplete: "off" })
      ] }),
      /* @__PURE__ */ jsx(TextField, { label: "Text Shadow", value: headingTextShadow, onChange: setHeadingTextShadow, helpText: "CSS text-shadow property (e.g., '2px 2px 4px rgba(0,0,0,0.5)')", autoComplete: "off" }),
      /* @__PURE__ */ jsx(Box, { padding: "400", background: "bg-surface-secondary", borderRadius: "200", children: /* @__PURE__ */ jsx(Text, { as: "h3", variant: "headingSm", fontWeight: "semibold", children: "Rating Summary" }) }),
      /* @__PURE__ */ jsxs(InlineGrid, { columns: { xs: "1fr", sm: "1fr 1fr" }, gap: "400", children: [
        /* @__PURE__ */ jsx(TextField, { label: "Rating Label Text", value: ratingLabelText, onChange: setRatingLabelText, helpText: "Text for the rating label (e.g., 'Excellent')", autoComplete: "off" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            Select,
            {
              label: "Font Family",
              options: fontFamilyOptions2,
              value: getFontFamilyValue(ratingLabelFontFamily, fontFamilyOptions2),
              onChange: (value) => value === "custom" ? setRatingLabelFontFamily("") : setRatingLabelFontFamily(value),
              helpText: "Select 'Use theme font' to match your store's body font, or choose from predefined fonts"
            }
          ),
          (ratingLabelFontFamily === "" || getFontFamilyValue(ratingLabelFontFamily, fontFamilyOptions2) === "custom") && /* @__PURE__ */ jsx(Box, { paddingBlockStart: "200", children: /* @__PURE__ */ jsx(TextField, { label: "Custom Font Family", value: ratingLabelFontFamily, onChange: setRatingLabelFontFamily, helpText: "Enter custom font family (e.g., 'Roboto, sans-serif')", autoComplete: "off", placeholder: "e.g., Roboto, sans-serif" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(InlineGrid, { columns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: "400", children: [
        /* @__PURE__ */ jsx(TextField, { label: "Font Size", value: ratingLabelFontSize === 0 ? "" : String(ratingLabelFontSize), onChange: handleRatingLabelFontSizeChange, type: "number", min: 8, max: 40, helpText: "Font size in pixels", autoComplete: "off", suffix: "px" }),
        /* @__PURE__ */ jsx(Select, { label: "Font Weight", options: fontWeightOptions2, value: ratingLabelFontWeight, onChange: setRatingLabelFontWeight, helpText: "Font weight" }),
        /* @__PURE__ */ jsx(ColorSettingCard, { title: "Label Color", description: "Color for the rating label", color: ratingLabelColor, onChange: handleRatingLabelColorChange })
      ] }),
      /* @__PURE__ */ jsx(Box, { padding: "400", background: "bg-surface-secondary", borderRadius: "200", children: /* @__PURE__ */ jsx(Text, { as: "h3", variant: "headingSm", fontWeight: "semibold", children: "Average Rating" }) }),
      /* @__PURE__ */ jsxs(InlineGrid, { columns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: "400", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            Select,
            {
              label: "Font Family",
              options: fontFamilyOptions2,
              value: getFontFamilyValue(ratingValueFontFamily, fontFamilyOptions2),
              onChange: (value) => value === "custom" ? setRatingValueFontFamily("") : setRatingValueFontFamily(value),
              helpText: "Select 'Use theme font' to match your store's body font, or choose from predefined fonts"
            }
          ),
          (ratingValueFontFamily === "" || getFontFamilyValue(ratingValueFontFamily, fontFamilyOptions2) === "custom") && /* @__PURE__ */ jsx(Box, { paddingBlockStart: "200", children: /* @__PURE__ */ jsx(TextField, { label: "Custom Font Family", value: ratingValueFontFamily, onChange: setRatingValueFontFamily, helpText: "Enter custom font family (e.g., 'Roboto, sans-serif')", autoComplete: "off", placeholder: "e.g., Roboto, sans-serif" }) })
        ] }),
        /* @__PURE__ */ jsx(TextField, { label: "Font Size", value: ratingValueFontSize === 0 ? "" : String(ratingValueFontSize), onChange: handleRatingValueFontSizeChange, type: "number", min: 8, max: 40, helpText: "Font size in pixels", autoComplete: "off", suffix: "px" }),
        /* @__PURE__ */ jsx(Select, { label: "Font Weight", options: fontWeightOptions2, value: ratingValueFontWeight, onChange: setRatingValueFontWeight, helpText: "Font weight" })
      ] }),
      /* @__PURE__ */ jsx(ColorSettingCard, { title: "Rating Value Color", description: "Color for the average rating number", color: ratingValueColor, onChange: handleRatingValueColorChange }),
      /* @__PURE__ */ jsx(Box, { padding: "400", background: "bg-surface-secondary", borderRadius: "200", children: /* @__PURE__ */ jsx(Text, { as: "h3", variant: "headingSm", fontWeight: "semibold", children: "Review Count" }) }),
      /* @__PURE__ */ jsxs(InlineGrid, { columns: { xs: "1fr", sm: "1fr 1fr" }, gap: "400", children: [
        /* @__PURE__ */ jsx(TextField, { label: "Count Prefix", value: reviewCountPrefix, onChange: setReviewCountPrefix, helpText: "Text before review count (e.g., 'Based on')", autoComplete: "off" }),
        /* @__PURE__ */ jsx(TextField, { label: "Count Suffix", value: reviewCountSuffix, onChange: setReviewCountSuffix, helpText: "Text after review count (e.g., 'reviews')", autoComplete: "off" })
      ] }),
      /* @__PURE__ */ jsxs(InlineGrid, { columns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: "400", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            Select,
            {
              label: "Font Family",
              options: fontFamilyOptions2,
              value: getFontFamilyValue(reviewCountFontFamily, fontFamilyOptions2),
              onChange: (value) => value === "custom" ? setReviewCountFontFamily("") : setReviewCountFontFamily(value),
              helpText: "Select 'Use theme font' to match your store's body font, or choose from predefined fonts"
            }
          ),
          (reviewCountFontFamily === "" || getFontFamilyValue(reviewCountFontFamily, fontFamilyOptions2) === "custom") && /* @__PURE__ */ jsx(Box, { paddingBlockStart: "200", children: /* @__PURE__ */ jsx(TextField, { label: "Custom Font Family", value: reviewCountFontFamily, onChange: setReviewCountFontFamily, helpText: "Enter custom font family (e.g., 'Roboto, sans-serif')", autoComplete: "off", placeholder: "e.g., Roboto, sans-serif" }) })
        ] }),
        /* @__PURE__ */ jsx(TextField, { label: "Font Size", value: reviewCountFontSize === 0 ? "" : String(reviewCountFontSize), onChange: handleReviewCountFontSizeChange, type: "number", min: 8, max: 30, helpText: "Font size in pixels", autoComplete: "off", suffix: "px" }),
        /* @__PURE__ */ jsx(Select, { label: "Font Weight", options: fontWeightOptions2, value: reviewCountFontWeight, onChange: setReviewCountFontWeight, helpText: "Font weight" })
      ] }),
      /* @__PURE__ */ jsx(ColorSettingCard, { title: "Review Count Color", description: "Color for the review count text", color: reviewCountColor, onChange: handleReviewCountColorChange }),
      /* @__PURE__ */ jsx(Box, { padding: "400", background: "bg-surface-brand", borderRadius: "200", children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
        /* @__PURE__ */ jsx(Text, { as: "h3", variant: "headingSm", fontWeight: "semibold", children: "Text Preview" }),
        /* @__PURE__ */ jsx(Box, { padding: "400", background: "bg-surface", borderRadius: "200", children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
          /* @__PURE__ */ jsx("div", { style: {
            fontFamily: headingFontFamily === "theme" ? "inherit" : headingFontFamily || "Arial, sans-serif",
            fontSize: `${headingFontSize}px`,
            fontWeight: headingFontWeight,
            fontStyle: headingFontStyle,
            textTransform: headingTextTransform,
            letterSpacing: `${headingLetterSpacing}px`,
            lineHeight: headingLineHeight,
            textShadow: headingTextShadow,
            color: hsbToHex(headingColor),
            textAlign: "center"
          }, children: headingTextTransform === "capitalize" ? headingText.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) : headingText }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontFamily: ratingLabelFontFamily === "theme" ? "inherit" : ratingLabelFontFamily || "Arial, sans-serif", fontSize: `${ratingLabelFontSize}px`, fontWeight: ratingLabelFontWeight, color: hsbToHex(ratingLabelColor) }, children: ratingLabelText }),
            /* @__PURE__ */ jsx("span", { style: { fontFamily: ratingValueFontFamily === "theme" ? "inherit" : ratingValueFontFamily || "Arial, sans-serif", fontSize: `${ratingValueFontSize}px`, fontWeight: ratingValueFontWeight, color: hsbToHex(ratingValueColor) }, children: "4.5" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { fontFamily: reviewCountFontFamily === "theme" ? "inherit" : reviewCountFontFamily || "Arial, sans-serif", fontSize: `${reviewCountFontSize}px`, fontWeight: reviewCountFontWeight, color: hsbToHex(reviewCountColor), textAlign: "center" }, children: [
            reviewCountPrefix,
            " ",
            /* @__PURE__ */ jsx("strong", { children: "24" }),
            " ",
            reviewCountSuffix
          ] })
        ] }) })
      ] }) })
    ] }) })
  ] }) });
};
const LayoutDisplaySection = (props) => {
  const {
    displayType,
    setDisplayType,
    displayTypeOptions: displayTypeOptions2,
    reviewsPerSlide,
    handleReviewsPerSlideChange,
    gridRows,
    handleGridRowsChange,
    gridColumns,
    handleGridColumnsChange,
    sectionBorderRadius,
    handleSectionBorderRadiusChange
  } = props;
  return /* @__PURE__ */ jsx(Box, { children: /* @__PURE__ */ jsxs(InlineGrid, { columns: { xs: "1fr", md: "1fr 2fr" }, gap: "600", alignItems: "start", children: [
    /* @__PURE__ */ jsx(BlockStack, { gap: "400", children: /* @__PURE__ */ jsxs(InlineStack, { gap: "300", blockAlign: "center", children: [
      /* @__PURE__ */ jsx(Box, { background: "bg-fill-brand", padding: "200", borderRadius: "300", children: /* @__PURE__ */ jsx("div", { style: { width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "bold" }, children: "⚡" }) }),
      /* @__PURE__ */ jsxs(BlockStack, { gap: "100", children: [
        /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingMd", fontWeight: "semibold", children: "Layout & Display" }),
        /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodySm", tone: "subdued", children: "Configure how reviews are organized and displayed to your customers." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Card, { padding: "400", children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
      /* @__PURE__ */ jsx(Select, { label: "Display Type", options: displayTypeOptions2, value: displayType, onChange: setDisplayType, helpText: "Choose how reviews are displayed on your store" }),
      displayType === "slider" && /* @__PURE__ */ jsx(TextField, { label: "Reviews per slide", value: reviewsPerSlide === 0 ? "" : String(reviewsPerSlide), onChange: handleReviewsPerSlideChange, type: "number", min: 1, max: 6, helpText: "Number of review cards visible at one time in slider", autoComplete: "off" }),
      displayType === "grid" && /* @__PURE__ */ jsxs(InlineGrid, { columns: { xs: "1fr", sm: "1fr 1fr" }, gap: "400", children: [
        /* @__PURE__ */ jsx(TextField, { label: "Grid Rows", value: gridRows === 0 ? "" : String(gridRows), onChange: handleGridRowsChange, type: "number", min: 1, max: 6, helpText: "Number of rows in the grid", autoComplete: "off" }),
        /* @__PURE__ */ jsx(TextField, { label: "Grid Columns", value: gridColumns === 0 ? "" : String(gridColumns), onChange: handleGridColumnsChange, type: "number", min: 1, max: 6, helpText: "Number of columns in the grid", autoComplete: "off" })
      ] }),
      /* @__PURE__ */ jsx(TextField, { label: "Section Border Radius", value: sectionBorderRadius === 0 ? "" : String(sectionBorderRadius), onChange: handleSectionBorderRadiusChange, type: "number", min: 0, max: 50, helpText: "Border radius for the entire review section (0-50px)", autoComplete: "off", suffix: "px" }),
      /* @__PURE__ */ jsx(Box, { padding: "200", background: "bg-surface-secondary", borderRadius: "200", children: /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodySm", tone: "subdued", children: displayType === "slider" ? `Slider will show ${reviewsPerSlide} review${reviewsPerSlide !== 1 ? "s" : ""} per slide with ${sectionBorderRadius}px border radius` : `Grid layout: ${gridRows} row${gridRows !== 1 ? "s" : ""} × ${gridColumns} column${gridColumns !== 1 ? "s" : ""} (${gridRows * gridColumns} total reviews visible) with ${sectionBorderRadius}px border radius` }) })
    ] }) })
  ] }) });
};
const SliderBehaviorSection = (props) => {
  const {
    sliderEffect,
    setSliderEffect,
    effectOptions: effectOptions2,
    sliderDirection,
    setSliderDirection,
    directionOptions: directionOptions2,
    sliderSpeed,
    handleSliderSpeedChange,
    spaceBetween,
    handleSpaceBetweenChange,
    sliderAutoplay,
    setSliderAutoplay,
    sliderLoop,
    setSliderLoop,
    showNavigation,
    setShowNavigation
  } = props;
  return /* @__PURE__ */ jsx(Box, { children: /* @__PURE__ */ jsxs(InlineGrid, { columns: { xs: "1fr", md: "1fr 2fr" }, gap: "600", alignItems: "start", children: [
    /* @__PURE__ */ jsx(BlockStack, { gap: "400", children: /* @__PURE__ */ jsxs(InlineStack, { gap: "300", blockAlign: "center", children: [
      /* @__PURE__ */ jsx(Box, { background: "bg-fill-brand", padding: "200", borderRadius: "300", children: /* @__PURE__ */ jsx("div", { style: { width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "bold" }, children: "⚙️" }) }),
      /* @__PURE__ */ jsxs(BlockStack, { gap: "100", children: [
        /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingMd", fontWeight: "semibold", children: "Slider Behavior" }),
        /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodySm", tone: "subdued", children: "Configure how the review slider behaves and appears to customers." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Card, { padding: "400", children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
      /* @__PURE__ */ jsxs(InlineGrid, { columns: { xs: "1fr", sm: "1fr 1fr" }, gap: "400", children: [
        /* @__PURE__ */ jsx(Select, { label: "Transition Effect", options: effectOptions2, value: sliderEffect, onChange: setSliderEffect, helpText: "Animation effect between slides" }),
        /* @__PURE__ */ jsx(Select, { label: "Direction", options: directionOptions2, value: sliderDirection, onChange: setSliderDirection, helpText: "Slider movement direction" })
      ] }),
      /* @__PURE__ */ jsxs(InlineGrid, { columns: { xs: "1fr", sm: "1fr 1fr" }, gap: "400", children: [
        /* @__PURE__ */ jsx(TextField, { label: "Autoplay Speed", value: sliderSpeed === 0 ? "" : String(sliderSpeed), onChange: handleSliderSpeedChange, type: "number", min: 2e3, max: 12e3, step: 1e3, helpText: "Time between slides (2000-12000 milliseconds)", autoComplete: "off", suffix: "ms" }),
        /* @__PURE__ */ jsx(TextField, { label: "Space Between", value: spaceBetween === 0 ? "" : String(spaceBetween), onChange: handleSpaceBetweenChange, type: "number", min: 0, max: 100, helpText: "Space between slides (0-100px)", autoComplete: "off", suffix: "px" })
      ] }),
      /* @__PURE__ */ jsxs(InlineGrid, { columns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: "400", children: [
        /* @__PURE__ */ jsxs(Box, { padding: "200", children: [
          /* @__PURE__ */ jsxs(InlineStack, { gap: "200", blockAlign: "center", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", id: "sliderAutoplay", checked: sliderAutoplay, onChange: (e) => setSliderAutoplay(e.target.checked), style: { margin: 0 } }),
            /* @__PURE__ */ jsx("label", { htmlFor: "sliderAutoplay", style: { fontSize: "14px", fontWeight: "normal" }, children: "Autoplay" })
          ] }),
          /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodySm", tone: "subdued", children: "Automatically advance slides" })
        ] }),
        /* @__PURE__ */ jsxs(Box, { padding: "200", children: [
          /* @__PURE__ */ jsxs(InlineStack, { gap: "200", blockAlign: "center", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", id: "sliderLoop", checked: sliderLoop, onChange: (e) => setSliderLoop(e.target.checked), style: { margin: 0 } }),
            /* @__PURE__ */ jsx("label", { htmlFor: "sliderLoop", style: { fontSize: "14px", fontWeight: "normal" }, children: "Infinite Loop" })
          ] }),
          /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodySm", tone: "subdued", children: "Continuously loop through slides" })
        ] }),
        /* @__PURE__ */ jsxs(Box, { padding: "200", children: [
          /* @__PURE__ */ jsxs(InlineStack, { gap: "200", blockAlign: "center", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", id: "showNavigation", checked: showNavigation, onChange: (e) => setShowNavigation(e.target.checked), style: { margin: 0 } }),
            /* @__PURE__ */ jsx("label", { htmlFor: "showNavigation", style: { fontSize: "14px", fontWeight: "normal" }, children: "Show Navigation" })
          ] }),
          /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodySm", tone: "subdued", children: "Display next/previous buttons" })
        ] })
      ] })
    ] }) })
  ] }) });
};
const ColorSchemeSection = (props) => {
  const {
    starColor,
    handleStarColorChange,
    backgroundColor,
    handleBackgroundColorChange,
    headingColor,
    handleHeadingColorChange,
    reviewCardColor,
    handleReviewCardColorChange
  } = props;
  return /* @__PURE__ */ jsx(Box, { children: /* @__PURE__ */ jsxs(InlineGrid, { columns: { xs: "1fr", md: "1fr 2fr" }, gap: "600", alignItems: "start", children: [
    /* @__PURE__ */ jsx(BlockStack, { gap: "400", children: /* @__PURE__ */ jsxs(InlineStack, { gap: "300", blockAlign: "center", children: [
      /* @__PURE__ */ jsx(Box, { background: "bg-fill-brand", padding: "200", borderRadius: "300", children: /* @__PURE__ */ jsx("div", { style: { width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "bold" }, children: "🎨" }) }),
      /* @__PURE__ */ jsxs(BlockStack, { gap: "100", children: [
        /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingMd", fontWeight: "semibold", children: "Color Scheme" }),
        /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodySm", tone: "subdued", children: "Customize colors to match your brand identity and create a cohesive look." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(BlockStack, { gap: "400", children: /* @__PURE__ */ jsxs(InlineGrid, { columns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }, gap: "400", children: [
      /* @__PURE__ */ jsx(ColorSettingCard, { title: "Star Color", description: "Color of rating stars", color: starColor, onChange: handleStarColorChange }),
      /* @__PURE__ */ jsx(ColorSettingCard, { title: "Background", description: "Main background color", color: backgroundColor, onChange: handleBackgroundColorChange }),
      /* @__PURE__ */ jsx(ColorSettingCard, { title: "Heading Text", description: "Color for headings and titles", color: headingColor, onChange: handleHeadingColorChange }),
      /* @__PURE__ */ jsx(ColorSettingCard, { title: "Card Background", description: "Review card background color", color: reviewCardColor, onChange: handleReviewCardColorChange })
    ] }) })
  ] }) });
};
const PreviewSection = (props) => {
  const {
    headingFontFamily,
    headingFontSize,
    headingFontWeight,
    headingFontStyle,
    headingTextTransform,
    headingLetterSpacing,
    headingLineHeight,
    headingTextShadow,
    headingColor,
    headingText,
    ratingLabelFontFamily,
    ratingLabelFontSize,
    ratingLabelFontWeight,
    ratingLabelColor,
    ratingLabelText,
    ratingValueFontFamily,
    ratingValueFontSize,
    ratingValueFontWeight,
    ratingValueColor,
    reviewCountFontFamily,
    reviewCountFontSize,
    reviewCountFontWeight,
    reviewCountColor,
    reviewCountPrefix,
    reviewCountSuffix,
    starColor,
    backgroundColor,
    reviewCardColor,
    sectionBorderRadius
  } = props;
  return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(InlineGrid, { columns: { xs: "1fr", md: "1fr 2fr" }, gap: "600", alignItems: "start", children: [
    /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
      /* @__PURE__ */ jsx(Text, { as: "h3", variant: "headingSm", fontWeight: "medium", children: "Color Preview" }),
      /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodySm", tone: "subdued", children: "Your selected colors will be applied to the review components throughout your store." })
    ] }),
    /* @__PURE__ */ jsxs(InlineStack, { gap: "400", children: [
      /* @__PURE__ */ jsxs(BlockStack, { gap: "100", align: "center", children: [
        /* @__PURE__ */ jsx("div", { style: {
          width: "60px",
          height: "60px",
          backgroundColor: hsbToHex(starColor),
          borderRadius: "8px",
          border: "1px solid #dfe3e8"
        } }),
        /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyXs", alignment: "center", children: "Star" })
      ] }),
      /* @__PURE__ */ jsxs(BlockStack, { gap: "100", align: "center", children: [
        /* @__PURE__ */ jsx("div", { style: {
          width: "60px",
          height: "60px",
          backgroundColor: hsbToHex(backgroundColor),
          borderRadius: "8px",
          border: "1px solid #dfe3e8"
        } }),
        /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyXs", alignment: "center", children: "Background" })
      ] }),
      /* @__PURE__ */ jsxs(BlockStack, { gap: "100", align: "center", children: [
        /* @__PURE__ */ jsx("div", { style: {
          width: "60px",
          height: "60px",
          backgroundColor: hsbToHex(headingColor),
          borderRadius: "8px",
          border: "1px solid #dfe3e8"
        } }),
        /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyXs", alignment: "center", children: "Heading" })
      ] }),
      /* @__PURE__ */ jsxs(BlockStack, { gap: "100", align: "center", children: [
        /* @__PURE__ */ jsx("div", { style: {
          width: "60px",
          height: "60px",
          backgroundColor: hsbToHex(reviewCardColor),
          borderRadius: "8px",
          border: "1px solid #dfe3e8"
        } }),
        /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyXs", alignment: "center", children: "Card" })
      ] })
    ] })
  ] }) });
};
function useSettingsForm() {
  const loaderData = useLoaderData();
  const {
    starColor: initialStarColor = "#FFD700",
    backgroundColor: initialBackgroundColor = "#F9F9F9",
    headingColor: initialHeadingColor = "#222222",
    reviewCardColor: initialReviewCardColor = "#FFFFFF",
    reviewsPerSlide: initialReviewsPerSlide = 3,
    displayType: initialDisplayType = "slider",
    gridRows: initialGridRows = 2,
    gridColumns: initialGridColumns = 2,
    sectionBorderRadius: initialSectionBorderRadius = 12,
    sliderAutoplay: initialSliderAutoplay = true,
    sliderSpeed: initialSliderSpeed = 3e3,
    sliderLoop: initialSliderLoop = true,
    sliderDirection: initialSliderDirection = "horizontal",
    spaceBetween: initialSpaceBetween = 20,
    showNavigation: initialShowNavigation = true,
    sliderEffect: initialSliderEffect = "slide",
    headingText: initialHeadingText = "CUSTOMER TESTIMONIALS",
    headingFontFamily: initialHeadingFontFamily = "theme",
    headingFontSize: initialHeadingFontSize = 40,
    headingFontWeight: initialHeadingFontWeight = "bold",
    headingFontStyle: initialHeadingFontStyle = "normal",
    headingTextTransform: initialHeadingTextTransform = "uppercase",
    headingLetterSpacing: initialHeadingLetterSpacing = 0,
    headingLineHeight: initialHeadingLineHeight = 1.2,
    headingTextShadow: initialHeadingTextShadow = "none",
    ratingLabelText: initialRatingLabelText = "Excellent",
    ratingLabelFontFamily: initialRatingLabelFontFamily = "theme",
    ratingLabelFontSize: initialRatingLabelFontSize = 18,
    ratingLabelFontWeight: initialRatingLabelFontWeight = "600",
    ratingLabelColor: initialRatingLabelColor = "#555555",
    ratingValueFontFamily: initialRatingValueFontFamily = "theme",
    ratingValueFontSize: initialRatingValueFontSize = 18,
    ratingValueFontWeight: initialRatingValueFontWeight = "600",
    ratingValueColor: initialRatingValueColor = "#555555",
    reviewCountPrefix: initialReviewCountPrefix = "Based on",
    reviewCountSuffix: initialReviewCountSuffix = "reviews",
    reviewCountFontFamily: initialReviewCountFontFamily = "theme",
    reviewCountFontSize: initialReviewCountFontSize = 16,
    reviewCountFontWeight: initialReviewCountFontWeight = "normal",
    reviewCountColor: initialReviewCountColor = "#777777"
  } = loaderData;
  const actionData = useActionData();
  const submit = useSubmit();
  const navigation = useNavigation();
  const [starColor, setStarColor] = useState(hexToHsb(initialStarColor));
  const [backgroundColor, setBackgroundColor] = useState(hexToHsb(initialBackgroundColor));
  const [headingColor, setHeadingColor] = useState(hexToHsb(initialHeadingColor));
  const [reviewCardColor, setReviewCardColor] = useState(hexToHsb(initialReviewCardColor));
  const [reviewsPerSlide, setReviewsPerSlide] = useState(initialReviewsPerSlide);
  const [displayType, setDisplayType] = useState(initialDisplayType);
  const [gridRows, setGridRows] = useState(initialGridRows);
  const [gridColumns, setGridColumns] = useState(initialGridColumns);
  const [sectionBorderRadius, setSectionBorderRadius] = useState(initialSectionBorderRadius);
  const [sliderAutoplay, setSliderAutoplay] = useState(initialSliderAutoplay);
  const [sliderSpeed, setSliderSpeed] = useState(initialSliderSpeed);
  const [sliderLoop, setSliderLoop] = useState(initialSliderLoop);
  const [sliderDirection, setSliderDirection] = useState(initialSliderDirection);
  const [spaceBetween, setSpaceBetween] = useState(initialSpaceBetween);
  const [showNavigation, setShowNavigation] = useState(initialShowNavigation);
  const [sliderEffect, setSliderEffect] = useState(initialSliderEffect);
  const [headingText, setHeadingText] = useState(initialHeadingText);
  const [headingFontFamily, setHeadingFontFamily] = useState(initialHeadingFontFamily);
  const [headingFontSize, setHeadingFontSize] = useState(initialHeadingFontSize);
  const [headingFontWeight, setHeadingFontWeight] = useState(initialHeadingFontWeight);
  const [headingFontStyle, setHeadingFontStyle] = useState(initialHeadingFontStyle);
  const [headingTextTransform, setHeadingTextTransform] = useState(initialHeadingTextTransform);
  const [headingLetterSpacing, setHeadingLetterSpacing] = useState(initialHeadingLetterSpacing);
  const [headingLineHeight, setHeadingLineHeight] = useState(initialHeadingLineHeight);
  const [headingTextShadow, setHeadingTextShadow] = useState(initialHeadingTextShadow);
  const [ratingLabelText, setRatingLabelText] = useState(initialRatingLabelText);
  const [ratingLabelFontFamily, setRatingLabelFontFamily] = useState(initialRatingLabelFontFamily);
  const [ratingLabelFontSize, setRatingLabelFontSize] = useState(initialRatingLabelFontSize);
  const [ratingLabelFontWeight, setRatingLabelFontWeight] = useState(initialRatingLabelFontWeight);
  const [ratingLabelColor, setRatingLabelColor] = useState(hexToHsb(initialRatingLabelColor));
  const [ratingValueFontFamily, setRatingValueFontFamily] = useState(initialRatingValueFontFamily);
  const [ratingValueFontSize, setRatingValueFontSize] = useState(initialRatingValueFontSize);
  const [ratingValueFontWeight, setRatingValueFontWeight] = useState(initialRatingValueFontWeight);
  const [ratingValueColor, setRatingValueColor] = useState(hexToHsb(initialRatingValueColor));
  const [reviewCountPrefix, setReviewCountPrefix] = useState(initialReviewCountPrefix);
  const [reviewCountSuffix, setReviewCountSuffix] = useState(initialReviewCountSuffix);
  const [reviewCountFontFamily, setReviewCountFontFamily] = useState(initialReviewCountFontFamily);
  const [reviewCountFontSize, setReviewCountFontSize] = useState(initialReviewCountFontSize);
  const [reviewCountFontWeight, setReviewCountFontWeight] = useState(initialReviewCountFontWeight);
  const [reviewCountColor, setReviewCountColor] = useState(hexToHsb(initialReviewCountColor));
  const [activeToast, setActiveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastError, setToastError] = useState(false);
  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        setToastMessage(actionData.message || "Settings saved!");
        setToastError(false);
      } else {
        setToastMessage(actionData.error || "Failed to save settings.");
        setToastError(true);
      }
      setActiveToast(true);
    }
  }, [actionData]);
  const handleStarColorChange = useCallback((value) => setStarColor({ ...value }), []);
  const handleBackgroundColorChange = useCallback((value) => setBackgroundColor({ ...value }), []);
  const handleHeadingColorChange = useCallback((value) => setHeadingColor({ ...value }), []);
  const handleReviewCardColorChange = useCallback((value) => setReviewCardColor({ ...value }), []);
  const handleReviewsPerSlideChange = useCallback((value) => {
    const parsedValue = parseInt(value, 10);
    if (value === "" || !isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= 6) {
      setReviewsPerSlide(value === "" ? 0 : parsedValue);
    }
  }, []);
  const handleGridRowsChange = useCallback((value) => {
    const parsedValue = parseInt(value, 10);
    if (value === "" || !isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= 6) {
      setGridRows(value === "" ? 0 : parsedValue);
    }
  }, []);
  const handleGridColumnsChange = useCallback((value) => {
    const parsedValue = parseInt(value, 10);
    if (value === "" || !isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= 6) {
      setGridColumns(value === "" ? 0 : parsedValue);
    }
  }, []);
  const handleSectionBorderRadiusChange = useCallback((value) => {
    const parsedValue = parseInt(value, 10);
    if (value === "" || !isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 50) {
      setSectionBorderRadius(value === "" ? 0 : parsedValue);
    }
  }, []);
  const handleSliderSpeedChange = useCallback((value) => {
    const parsedValue = parseInt(value, 10);
    if (value === "" || !isNaN(parsedValue) && parsedValue >= 0) {
      setSliderSpeed(value === "" ? 0 : parsedValue);
    }
  }, []);
  const handleSpaceBetweenChange = useCallback((value) => {
    const parsedValue = parseInt(value, 10);
    if (value === "" || !isNaN(parsedValue) && parsedValue >= 0) {
      setSpaceBetween(value === "" ? 0 : parsedValue);
    }
  }, []);
  const handleHeadingFontSizeChange = useCallback((value) => {
    const parsedValue = parseInt(value, 10);
    if (value === "" || !isNaN(parsedValue) && parsedValue >= 0) {
      setHeadingFontSize(value === "" ? 0 : parsedValue);
    }
  }, []);
  const handleHeadingLetterSpacingChange = useCallback((value) => {
    const parsedValue = parseInt(value, 10);
    if (value === "" || !isNaN(parsedValue)) {
      setHeadingLetterSpacing(value === "" ? 0 : parsedValue);
    }
  }, []);
  const handleHeadingLineHeightChange = useCallback((value) => {
    const parsedValue = parseFloat(value);
    if (value === "" || !isNaN(parsedValue)) {
      setHeadingLineHeight(value === "" ? 0 : parsedValue);
    }
  }, []);
  const handleRatingLabelFontSizeChange = useCallback((value) => {
    const parsedValue = parseInt(value, 10);
    if (value === "" || !isNaN(parsedValue) && parsedValue >= 0) {
      setRatingLabelFontSize(value === "" ? 0 : parsedValue);
    }
  }, []);
  const handleRatingValueFontSizeChange = useCallback((value) => {
    const parsedValue = parseInt(value, 10);
    if (value === "" || !isNaN(parsedValue) && parsedValue >= 0) {
      setRatingValueFontSize(value === "" ? 0 : parsedValue);
    }
  }, []);
  const handleReviewCountFontSizeChange = useCallback((value) => {
    const parsedValue = parseInt(value, 10);
    if (value === "" || !isNaN(parsedValue) && parsedValue >= 0) {
      setReviewCountFontSize(value === "" ? 0 : parsedValue);
    }
  }, []);
  const handleRatingLabelColorChange = useCallback((value) => setRatingLabelColor({ ...value }), []);
  const handleRatingValueColorChange = useCallback((value) => setRatingValueColor({ ...value }), []);
  const handleReviewCountColorChange = useCallback((value) => setReviewCountColor({ ...value }), []);
  const handleSubmit = useCallback(() => {
    const formData = new FormData();
    formData.append("starColor", hsbToHex(starColor));
    formData.append("backgroundColor", hsbToHex(backgroundColor));
    formData.append("headingColor", hsbToHex(headingColor));
    formData.append("reviewCardColor", hsbToHex(reviewCardColor));
    formData.append("reviewsPerSlide", String(reviewsPerSlide));
    formData.append("displayType", displayType);
    formData.append("gridRows", String(gridRows));
    formData.append("gridColumns", String(gridColumns));
    formData.append("sectionBorderRadius", String(sectionBorderRadius));
    formData.append("sliderAutoplay", String(sliderAutoplay));
    formData.append("sliderSpeed", String(sliderSpeed));
    formData.append("sliderLoop", String(sliderLoop));
    formData.append("sliderDirection", sliderDirection);
    formData.append("spaceBetween", String(spaceBetween));
    formData.append("showNavigation", String(showNavigation));
    formData.append("sliderEffect", sliderEffect);
    formData.append("headingText", headingText);
    formData.append("headingFontFamily", headingFontFamily);
    formData.append("headingFontSize", String(headingFontSize));
    formData.append("headingFontWeight", headingFontWeight);
    formData.append("headingFontStyle", headingFontStyle);
    formData.append("headingTextTransform", headingTextTransform);
    formData.append("headingLetterSpacing", String(headingLetterSpacing));
    formData.append("headingLineHeight", String(headingLineHeight));
    formData.append("headingTextShadow", headingTextShadow);
    formData.append("ratingLabelText", ratingLabelText);
    formData.append("ratingLabelFontFamily", ratingLabelFontFamily);
    formData.append("ratingLabelFontSize", String(ratingLabelFontSize));
    formData.append("ratingLabelFontWeight", ratingLabelFontWeight);
    formData.append("ratingLabelColor", hsbToHex(ratingLabelColor));
    formData.append("ratingValueFontFamily", ratingValueFontFamily);
    formData.append("ratingValueFontSize", String(ratingValueFontSize));
    formData.append("ratingValueFontWeight", ratingValueFontWeight);
    formData.append("ratingValueColor", hsbToHex(ratingValueColor));
    formData.append("reviewCountPrefix", reviewCountPrefix);
    formData.append("reviewCountSuffix", reviewCountSuffix);
    formData.append("reviewCountFontFamily", reviewCountFontFamily);
    formData.append("reviewCountFontSize", String(reviewCountFontSize));
    formData.append("reviewCountFontWeight", reviewCountFontWeight);
    formData.append("reviewCountColor", hsbToHex(reviewCountColor));
    submit(formData, { method: "post" });
  }, [
    starColor,
    backgroundColor,
    headingColor,
    reviewCardColor,
    reviewsPerSlide,
    displayType,
    gridRows,
    gridColumns,
    sectionBorderRadius,
    sliderAutoplay,
    sliderSpeed,
    sliderLoop,
    sliderDirection,
    spaceBetween,
    showNavigation,
    sliderEffect,
    headingText,
    headingFontFamily,
    headingFontSize,
    headingFontWeight,
    headingFontStyle,
    headingTextTransform,
    headingLetterSpacing,
    headingLineHeight,
    headingTextShadow,
    ratingLabelText,
    ratingLabelFontFamily,
    ratingLabelFontSize,
    ratingLabelFontWeight,
    ratingLabelColor,
    ratingValueFontFamily,
    ratingValueFontSize,
    ratingValueFontWeight,
    ratingValueColor,
    reviewCountPrefix,
    reviewCountSuffix,
    reviewCountFontFamily,
    reviewCountFontSize,
    reviewCountFontWeight,
    reviewCountColor,
    submit
  ]);
  const isLoading = navigation.state === "submitting";
  return {
    starColor,
    backgroundColor,
    headingColor,
    reviewCardColor,
    reviewsPerSlide,
    displayType,
    gridRows,
    gridColumns,
    sectionBorderRadius,
    sliderAutoplay,
    sliderSpeed,
    sliderLoop,
    sliderDirection,
    spaceBetween,
    showNavigation,
    sliderEffect,
    headingText,
    headingFontFamily,
    headingFontSize,
    headingFontWeight,
    headingFontStyle,
    headingTextTransform,
    headingLetterSpacing,
    headingLineHeight,
    headingTextShadow,
    ratingLabelText,
    ratingLabelFontFamily,
    ratingLabelFontSize,
    ratingLabelFontWeight,
    ratingLabelColor,
    ratingValueFontFamily,
    ratingValueFontSize,
    ratingValueFontWeight,
    ratingValueColor,
    reviewCountPrefix,
    reviewCountSuffix,
    reviewCountFontFamily,
    reviewCountFontSize,
    reviewCountFontWeight,
    reviewCountColor,
    activeToast,
    toastMessage,
    toastError,
    setActiveToast,
    handleStarColorChange,
    handleBackgroundColorChange,
    handleHeadingColorChange,
    handleReviewCardColorChange,
    handleReviewsPerSlideChange,
    handleGridRowsChange,
    handleGridColumnsChange,
    handleSectionBorderRadiusChange,
    handleSliderSpeedChange,
    handleSpaceBetweenChange,
    handleHeadingFontSizeChange,
    handleHeadingLetterSpacingChange,
    handleHeadingLineHeightChange,
    handleRatingLabelFontSizeChange,
    handleRatingValueFontSizeChange,
    handleReviewCountFontSizeChange,
    handleRatingLabelColorChange,
    handleRatingValueColorChange,
    handleReviewCountColorChange,
    handleSubmit,
    isLoading,
    setHeadingText,
    setHeadingFontFamily,
    setHeadingFontWeight,
    setHeadingFontStyle,
    setHeadingTextTransform,
    setHeadingTextShadow,
    setRatingLabelText,
    setRatingLabelFontFamily,
    setRatingLabelFontWeight,
    setRatingValueFontFamily,
    setRatingValueFontWeight,
    setReviewCountPrefix,
    setReviewCountSuffix,
    setReviewCountFontFamily,
    setReviewCountFontWeight,
    setDisplayType,
    setSliderEffect,
    setSliderDirection,
    setSliderAutoplay,
    setSliderLoop,
    setShowNavigation
  };
}
const fontFamilyOptions = [
  { label: "Use theme body font", value: "theme" },
  { label: "System Default", value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' },
  { label: "Serif", value: 'Georgia, "Times New Roman", serif' },
  { label: "Monospace", value: 'Monaco, Consolas, "Courier New", monospace' },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Open Sans", value: '"Open Sans", sans-serif' },
  { label: "Lato", value: "Lato, sans-serif" },
  { label: "Montserrat", value: "Montserrat, sans-serif" },
  { label: "Custom Font...", value: "custom" }
];
const fontWeightOptions = [
  { label: "Normal (400)", value: "normal" },
  { label: "Medium (500)", value: "500" },
  { label: "Semi-bold (600)", value: "600" },
  { label: "Bold (700)", value: "bold" },
  { label: "Extra-bold (800)", value: "800" }
];
const fontStyleOptions = [
  { label: "Normal", value: "normal" },
  { label: "Italic", value: "italic" }
];
const textTransformOptions = [
  { label: "None", value: "none" },
  { label: "Uppercase", value: "uppercase" },
  { label: "Lowercase", value: "lowercase" },
  { label: "Capitalize", value: "capitalize" }
];
const displayTypeOptions = [
  { label: "Slider Carousel", value: "slider" },
  { label: "Grid Layout", value: "grid" }
];
const directionOptions = [
  { label: "Horizontal", value: "horizontal" },
  { label: "Vertical", value: "vertical" }
];
const effectOptions = [
  { label: "Slide", value: "slide" },
  { label: "Fade", value: "fade" },
  { label: "Cube", value: "cube" },
  { label: "Coverflow", value: "coverflow" },
  { label: "Flip", value: "flip" }
];
async function loader$1({ request }) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  try {
    let appSettings = await db$1.appSettings.findUnique({
      where: { shop }
    });
    if (!appSettings) {
      appSettings = await db$1.appSettings.create({
        data: {
          shop,
          starColor: APP_CONFIG.SETTINGS_DEFAULTS.STAR_COLOR,
          backgroundColor: APP_CONFIG.SETTINGS_DEFAULTS.BACKGROUND_COLOR,
          headingColor: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_COLOR,
          reviewCardColor: APP_CONFIG.SETTINGS_DEFAULTS.REVIEW_CARD_COLOR,
          reviewsPerSlide: APP_CONFIG.SETTINGS_DEFAULTS.REVIEWS_PER_SLIDE,
          displayType: APP_CONFIG.SETTINGS_DEFAULTS.DISPLAY_TYPE,
          gridRows: APP_CONFIG.SETTINGS_DEFAULTS.GRID_ROWS,
          gridColumns: APP_CONFIG.SETTINGS_DEFAULTS.GRID_COLUMNS,
          sliderAutoplay: APP_CONFIG.SETTINGS_DEFAULTS.SLIDER_AUTOPLAY,
          sliderSpeed: APP_CONFIG.SETTINGS_DEFAULTS.SLIDER_SPEED,
          sliderLoop: APP_CONFIG.SETTINGS_DEFAULTS.SLIDER_LOOP,
          sliderDirection: APP_CONFIG.SETTINGS_DEFAULTS.SLIDER_DIRECTION,
          spaceBetween: APP_CONFIG.SETTINGS_DEFAULTS.SPACE_BETWEEN,
          showNavigation: APP_CONFIG.SETTINGS_DEFAULTS.SHOW_NAVIGATION,
          sliderEffect: APP_CONFIG.SETTINGS_DEFAULTS.SLIDER_EFFECT,
          sectionBorderRadius: APP_CONFIG.SETTINGS_DEFAULTS.SECTION_BORDER_RADIUS,
          headingText: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_TEXT,
          headingFontFamily: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_FONT_FAMILY,
          headingFontSize: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_FONT_SIZE,
          headingFontWeight: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_FONT_WEIGHT,
          headingFontStyle: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_FONT_STYLE,
          headingTextTransform: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_TEXT_TRANSFORM,
          headingLetterSpacing: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_LETTER_SPACING,
          headingLineHeight: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_LINE_HEIGHT,
          headingTextShadow: APP_CONFIG.SETTINGS_DEFAULTS.HEADING_TEXT_SHADOW,
          ratingLabelText: APP_CONFIG.SETTINGS_DEFAULTS.RATING_LABEL_TEXT,
          ratingLabelFontFamily: APP_CONFIG.SETTINGS_DEFAULTS.RATING_LABEL_FONT_FAMILY,
          ratingLabelFontSize: APP_CONFIG.SETTINGS_DEFAULTS.RATING_LABEL_FONT_SIZE,
          ratingLabelFontWeight: APP_CONFIG.SETTINGS_DEFAULTS.RATING_LABEL_FONT_WEIGHT,
          ratingLabelColor: APP_CONFIG.SETTINGS_DEFAULTS.RATING_LABEL_COLOR,
          ratingValueFontFamily: APP_CONFIG.SETTINGS_DEFAULTS.RATING_VALUE_FONT_FAMILY,
          ratingValueFontSize: APP_CONFIG.SETTINGS_DEFAULTS.RATING_VALUE_FONT_SIZE,
          ratingValueFontWeight: APP_CONFIG.SETTINGS_DEFAULTS.RATING_VALUE_FONT_WEIGHT,
          ratingValueColor: APP_CONFIG.SETTINGS_DEFAULTS.RATING_VALUE_COLOR,
          reviewCountPrefix: APP_CONFIG.SETTINGS_DEFAULTS.REVIEW_COUNT_PREFIX,
          reviewCountSuffix: APP_CONFIG.SETTINGS_DEFAULTS.REVIEW_COUNT_SUFFIX,
          reviewCountFontFamily: APP_CONFIG.SETTINGS_DEFAULTS.REVIEW_COUNT_FONT_FAMILY,
          reviewCountFontSize: APP_CONFIG.SETTINGS_DEFAULTS.REVIEW_COUNT_FONT_SIZE,
          reviewCountFontWeight: APP_CONFIG.SETTINGS_DEFAULTS.REVIEW_COUNT_FONT_WEIGHT,
          reviewCountColor: APP_CONFIG.SETTINGS_DEFAULTS.REVIEW_COUNT_COLOR
        }
      });
    }
    return json$1({
      ...appSettings,
      gridRows: appSettings.gridRows || APP_CONFIG.SETTINGS_DEFAULTS.GRID_ROWS,
      gridColumns: appSettings.gridColumns || APP_CONFIG.SETTINGS_DEFAULTS.GRID_COLUMNS
    });
  } catch (error) {
    return json$1({ error: "Failed to load settings" }, { status: 500 });
  }
}
async function action$1({ request }) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  const settingsData = {
    starColor: String(formData.get("starColor")),
    backgroundColor: String(formData.get("backgroundColor")),
    headingColor: String(formData.get("headingColor")),
    reviewCardColor: String(formData.get("reviewCardColor")),
    reviewsPerSlide: Number(formData.get("reviewsPerSlide")),
    displayType: String(formData.get("displayType")),
    gridRows: Number(formData.get("gridRows")),
    gridColumns: Number(formData.get("gridColumns")),
    sliderAutoplay: formData.get("sliderAutoplay") === "true",
    sliderSpeed: Number(formData.get("sliderSpeed")),
    sliderLoop: formData.get("sliderLoop") === "true",
    sliderDirection: String(formData.get("sliderDirection")),
    spaceBetween: Number(formData.get("spaceBetween")),
    showNavigation: formData.get("showNavigation") === "true",
    sliderEffect: String(formData.get("sliderEffect")),
    sectionBorderRadius: Number(formData.get("sectionBorderRadius")),
    headingText: String(formData.get("headingText")),
    headingFontFamily: String(formData.get("headingFontFamily")),
    headingFontSize: Number(formData.get("headingFontSize")),
    headingFontWeight: String(formData.get("headingFontWeight")),
    headingFontStyle: String(formData.get("headingFontStyle")),
    headingTextTransform: String(formData.get("headingTextTransform")),
    headingLetterSpacing: Number(formData.get("headingLetterSpacing")),
    headingLineHeight: Number(formData.get("headingLineHeight")),
    headingTextShadow: String(formData.get("headingTextShadow")),
    ratingLabelText: String(formData.get("ratingLabelText")),
    ratingLabelFontFamily: String(formData.get("ratingLabelFontFamily")),
    ratingLabelFontSize: Number(formData.get("ratingLabelFontSize")),
    ratingLabelFontWeight: String(formData.get("ratingLabelFontWeight")),
    ratingLabelColor: String(formData.get("ratingLabelColor")),
    ratingValueFontFamily: String(formData.get("ratingValueFontFamily")),
    ratingValueFontSize: Number(formData.get("ratingValueFontSize")),
    ratingValueFontWeight: String(formData.get("ratingValueFontWeight")),
    ratingValueColor: String(formData.get("ratingValueColor")),
    reviewCountPrefix: String(formData.get("reviewCountPrefix")),
    reviewCountSuffix: String(formData.get("reviewCountSuffix")),
    reviewCountFontFamily: String(formData.get("reviewCountFontFamily")),
    reviewCountFontSize: Number(formData.get("reviewCountFontSize")),
    reviewCountFontWeight: String(formData.get("reviewCountFontWeight")),
    reviewCountColor: String(formData.get("reviewCountColor"))
  };
  try {
    const settings = await db$1.appSettings.findUnique({
      where: { shop }
    });
    if (settings) {
      await db$1.appSettings.update({
        where: { shop },
        data: settingsData
      });
    } else {
      await db$1.appSettings.create({
        data: {
          ...settingsData,
          shop
        }
      });
    }
    return json$1({ success: true, message: "Settings saved successfully" });
  } catch (error) {
    return json$1({ success: false, error: "Failed to save settings" }, { status: 500 });
  }
}
function SettingsPage() {
  const {
    starColor,
    backgroundColor,
    headingColor,
    reviewCardColor,
    reviewsPerSlide,
    displayType,
    gridRows,
    gridColumns,
    sectionBorderRadius,
    sliderAutoplay,
    sliderSpeed,
    sliderLoop,
    sliderDirection,
    spaceBetween,
    showNavigation,
    sliderEffect,
    headingText,
    headingFontFamily,
    headingFontSize,
    headingFontWeight,
    headingFontStyle,
    headingTextTransform,
    headingLetterSpacing,
    headingLineHeight,
    headingTextShadow,
    ratingLabelText,
    ratingLabelFontFamily,
    ratingLabelFontSize,
    ratingLabelFontWeight,
    ratingLabelColor,
    ratingValueFontFamily,
    ratingValueFontSize,
    ratingValueFontWeight,
    ratingValueColor,
    reviewCountPrefix,
    reviewCountSuffix,
    reviewCountFontFamily,
    reviewCountFontSize,
    reviewCountFontWeight,
    reviewCountColor,
    activeToast,
    toastMessage,
    toastError,
    setActiveToast,
    handleStarColorChange,
    handleBackgroundColorChange,
    handleHeadingColorChange,
    handleReviewCardColorChange,
    handleReviewsPerSlideChange,
    handleGridRowsChange,
    handleGridColumnsChange,
    handleSectionBorderRadiusChange,
    handleSliderSpeedChange,
    handleSpaceBetweenChange,
    handleHeadingFontSizeChange,
    handleHeadingLetterSpacingChange,
    handleHeadingLineHeightChange,
    handleRatingLabelFontSizeChange,
    handleRatingValueFontSizeChange,
    handleReviewCountFontSizeChange,
    handleRatingLabelColorChange,
    handleRatingValueColorChange,
    handleReviewCountColorChange,
    handleSubmit,
    isLoading,
    setHeadingText,
    setHeadingFontFamily,
    setHeadingFontWeight,
    setHeadingFontStyle,
    setHeadingTextTransform,
    setHeadingTextShadow,
    setRatingLabelText,
    setRatingLabelFontFamily,
    setRatingLabelFontWeight,
    setRatingValueFontFamily,
    setRatingValueFontWeight,
    setReviewCountPrefix,
    setReviewCountSuffix,
    setReviewCountFontFamily,
    setReviewCountFontWeight,
    setDisplayType,
    setSliderEffect,
    setSliderDirection,
    setSliderAutoplay,
    setSliderLoop,
    setShowNavigation
  } = useSettingsForm();
  const toastMarkup = activeToast ? /* @__PURE__ */ jsx(Toast, { content: toastMessage, error: toastError, onDismiss: () => setActiveToast(false) }) : null;
  return /* @__PURE__ */ jsxs(Page, { fullWidth: true, children: [
    /* @__PURE__ */ jsx(TitleBar, { title: "Review Display Settings" }),
    /* @__PURE__ */ jsx(BlockStack, { gap: "500", children: /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "500", children: [
      /* @__PURE__ */ jsx(
        TextStylingSection,
        {
          headingText,
          setHeadingText,
          headingFontFamily,
          setHeadingFontFamily,
          headingFontSize,
          handleHeadingFontSizeChange,
          headingFontWeight,
          setHeadingFontWeight,
          headingFontStyle,
          setHeadingFontStyle,
          headingTextTransform,
          setHeadingTextTransform,
          headingLetterSpacing,
          handleHeadingLetterSpacingChange,
          headingLineHeight,
          handleHeadingLineHeightChange,
          headingTextShadow,
          setHeadingTextShadow,
          ratingLabelText,
          setRatingLabelText,
          ratingLabelFontFamily,
          setRatingLabelFontFamily,
          ratingLabelFontSize,
          handleRatingLabelFontSizeChange,
          ratingLabelFontWeight,
          setRatingLabelFontWeight,
          ratingLabelColor,
          handleRatingLabelColorChange,
          ratingValueFontFamily,
          setRatingValueFontFamily,
          ratingValueFontSize,
          handleRatingValueFontSizeChange,
          ratingValueFontWeight,
          setRatingValueFontWeight,
          ratingValueColor,
          handleRatingValueColorChange,
          reviewCountPrefix,
          setReviewCountPrefix,
          reviewCountSuffix,
          setReviewCountSuffix,
          reviewCountFontFamily,
          setReviewCountFontFamily,
          reviewCountFontSize,
          handleReviewCountFontSizeChange,
          reviewCountFontWeight,
          setReviewCountFontWeight,
          reviewCountColor,
          handleReviewCountColorChange,
          fontFamilyOptions,
          fontWeightOptions,
          fontStyleOptions,
          textTransformOptions,
          headingColor
        }
      ),
      /* @__PURE__ */ jsx(Divider, {}),
      /* @__PURE__ */ jsx(
        LayoutDisplaySection,
        {
          displayType,
          setDisplayType,
          displayTypeOptions,
          reviewsPerSlide,
          handleReviewsPerSlideChange,
          gridRows,
          handleGridRowsChange,
          gridColumns,
          handleGridColumnsChange,
          sectionBorderRadius,
          handleSectionBorderRadiusChange
        }
      ),
      displayType === "slider" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Divider, {}),
        /* @__PURE__ */ jsx(
          SliderBehaviorSection,
          {
            sliderEffect,
            setSliderEffect,
            effectOptions,
            sliderDirection,
            setSliderDirection,
            directionOptions,
            sliderSpeed,
            handleSliderSpeedChange,
            spaceBetween,
            handleSpaceBetweenChange,
            sliderAutoplay,
            setSliderAutoplay,
            sliderLoop,
            setSliderLoop,
            showNavigation,
            setShowNavigation
          }
        )
      ] }),
      /* @__PURE__ */ jsx(Divider, {}),
      /* @__PURE__ */ jsx(
        ColorSchemeSection,
        {
          starColor,
          handleStarColorChange,
          backgroundColor,
          handleBackgroundColorChange,
          headingColor,
          handleHeadingColorChange,
          reviewCardColor,
          handleReviewCardColorChange
        }
      ),
      /* @__PURE__ */ jsx(Divider, {}),
      /* @__PURE__ */ jsx(
        PreviewSection,
        {
          headingText,
          headingFontFamily,
          headingFontSize,
          headingFontWeight,
          headingFontStyle,
          headingTextTransform,
          headingLetterSpacing,
          headingLineHeight,
          headingTextShadow,
          headingColor,
          ratingLabelText,
          ratingLabelFontFamily,
          ratingLabelFontSize,
          ratingLabelFontWeight,
          ratingLabelColor,
          ratingValueFontFamily,
          ratingValueFontSize,
          ratingValueFontWeight,
          ratingValueColor,
          reviewCountPrefix,
          reviewCountSuffix,
          reviewCountFontFamily,
          reviewCountFontSize,
          reviewCountFontWeight,
          reviewCountColor,
          starColor,
          backgroundColor,
          reviewCardColor,
          sectionBorderRadius
        }
      ),
      /* @__PURE__ */ jsx(Box, { paddingBlockEnd: "500", children: /* @__PURE__ */ jsx(InlineStack, { align: "end", children: /* @__PURE__ */ jsx(
        Button,
        {
          variant: "primary",
          onClick: handleSubmit,
          loading: isLoading,
          size: "large",
          children: "Save Settings"
        }
      ) }) })
    ] }) }) }) }),
    toastMarkup
  ] });
}
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: SettingsPage,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
function StatsCard({ totalReviews, averageRating }) {
  const [collapsed, setCollapsed] = useState(false);
  const stats = [
    { value: averageRating, label: "Average Rating", icon: StarFilledIcon, valueTone: "success", iconColor: "success" },
    { value: totalReviews, label: "Total Reviews", icon: ChatIcon, valueTone: "subdued", iconColor: "interactive" }
  ];
  return /* @__PURE__ */ jsx(Card, { background: "bg-surface-secondary", children: /* @__PURE__ */ jsxs(BlockStack, { gap: "500", children: [
    /* @__PURE__ */ jsxs(InlineStack, { align: "space-between", blockAlign: "center", children: [
      /* @__PURE__ */ jsx(Text, { as: "h1", variant: "headingLg", children: "Review Summary" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "plain",
          icon: collapsed ? ChevronDownIcon : ChevronUpIcon,
          onClick: () => setCollapsed(!collapsed),
          accessibilityLabel: collapsed ? "Expand summary" : "Collapse summary"
        }
      )
    ] }),
    !collapsed && /* @__PURE__ */ jsx(InlineGrid, { columns: 2, gap: "600", children: stats.map((stat, index2) => /* @__PURE__ */ jsx(
      Box,
      {
        padding: "600",
        background: "bg-surface",
        borderRadius: "300",
        shadow: "400",
        children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", align: "center", children: [
          /* @__PURE__ */ jsx(
            Box,
            {
              background: "bg-fill-secondary",
              borderRadius: "full",
              padding: "300",
              children: /* @__PURE__ */ jsx(Icon, { source: stat.icon, tone: stat.iconColor })
            }
          ),
          /* @__PURE__ */ jsx(Text, { as: "p", variant: "heading2xl", fontWeight: "semibold", alignment: "center", tone: stat.valueTone, children: stat.value }),
          /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyMd", tone: "subdued", alignment: "center", children: stat.label })
        ] })
      },
      index2
    )) })
  ] }) });
}
function useHomeDashboard() {
  const {
    reviews,
    totalReviews,
    averageRating,
    currentPage,
    reviewsPerPage,
    productSummaries,
    bundles,
    shopifyProducts
  } = useLoaderData();
  useActionData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useSubmit();
  const navigation = useNavigation();
  const exportFetcher = useFetcher();
  const importFetcher = useFetcher();
  const sampleFetcher = useFetcher();
  const [csvFile, setCsvFile] = useState(null);
  const [activeToast, setActiveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastError, setToastError] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedBundleId, setSelectedBundleId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [sortOption, setSortOption] = useState("highest-rating");
  const isExporting = exportFetcher.state === "submitting";
  const isImporting = importFetcher.state === "submitting" || importFetcher.state === "loading";
  const isDownloadingSample = sampleFetcher.state === "submitting";
  const isSubmitting = navigation.state === "submitting";
  const pageCount = Math.ceil(totalReviews / reviewsPerPage);
  const hasNext = currentPage < pageCount;
  const hasPrevious = currentPage > 1;
  const handlePageChange = (newPage) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", String(newPage));
    navigate(`?${newSearchParams.toString()}`);
  };
  const handleFileChange = useCallback((event) => {
    var _a2;
    const file = ((_a2 = event.target.files) == null ? void 0 : _a2[0]) || null;
    setCsvFile(file);
  }, []);
  const handleRemoveFile = useCallback(() => {
    setCsvFile(null);
    const fileInput = document.getElementById("csv-file-input");
    if (fileInput) {
      fileInput.value = "";
    }
  }, []);
  const toggleActiveToast = useCallback(() => setActiveToast((active) => !active), []);
  const handleExportCSV = useCallback(() => {
    const formData = new FormData();
    formData.append("actionType", "export_csv");
    exportFetcher.submit(formData, { method: "post" });
  }, [exportFetcher]);
  const handleDownloadSampleCSV = useCallback(() => {
    const formData = new FormData();
    formData.append("actionType", "download_sample_csv");
    sampleFetcher.submit(formData, { method: "post" });
  }, [sampleFetcher]);
  const handleImportCSV = useCallback(() => {
    if (!csvFile) {
      setToastMessage("Please select a CSV file to import");
      setToastError(true);
      setActiveToast(true);
      return;
    }
    const formData = new FormData();
    formData.append("actionType", "import_csv");
    formData.append("csvFile", csvFile);
    importFetcher.submit(formData, {
      method: "post",
      encType: "multipart/form-data"
    });
  }, [csvFile, importFetcher]);
  useEffect(() => {
    var _a2, _b;
    if (((_a2 = exportFetcher.data) == null ? void 0 : _a2.csvData) && exportFetcher.data.fileName) {
      const blob = new Blob([exportFetcher.data.csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = exportFetcher.data.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else if ((_b = exportFetcher.data) == null ? void 0 : _b.error) {
      setToastMessage(exportFetcher.data.error);
      setToastError(true);
      setActiveToast(true);
    }
  }, [exportFetcher.data]);
  useEffect(() => {
    var _a2;
    if (((_a2 = sampleFetcher.data) == null ? void 0 : _a2.csvData) && sampleFetcher.data.fileName) {
      const blob = new Blob([sampleFetcher.data.csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = sampleFetcher.data.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  }, [sampleFetcher.data]);
  useEffect(() => {
    if (importFetcher.data) {
      setToastMessage(importFetcher.data.message || importFetcher.data.error || "Import completed.");
      setToastError(!importFetcher.data.success);
      setActiveToast(true);
      if (importFetcher.data.success) {
        setCsvFile(null);
        const fileInput = document.getElementById("csv-file-input");
        if (fileInput) fileInput.value = "";
      }
    }
  }, [importFetcher.data]);
  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelectedTab(selectedTabIndex);
    setSelectedBundleId(null);
    setSelectedProductId(null);
  }, []);
  const handleSortChange = useCallback((value) => {
    setSortOption(value);
  }, []);
  return {
    reviews,
    totalReviews,
    averageRating,
    currentPage,
    reviewsPerPage,
    productSummaries,
    bundles,
    shopifyProducts,
    csvFile,
    activeToast,
    toastMessage,
    toastError,
    selectedTab,
    selectedBundleId,
    selectedProductId,
    sortOption,
    isSubmitting,
    isExporting,
    isImporting,
    isDownloadingSample,
    pageCount,
    hasNext,
    hasPrevious,
    handlePageChange,
    handleFileChange,
    handleRemoveFile,
    toggleActiveToast,
    handleExportCSV,
    handleDownloadSampleCSV,
    handleImportCSV,
    handleTabChange,
    handleSortChange,
    setSelectedBundleId,
    setSelectedProductId,
    setActiveToast
  };
}
function BulkManagementSection({
  isExporting,
  isImporting,
  isDownloadingSample,
  handleExportCSV,
  csvFile,
  handleFileChange,
  handleRemoveFile,
  handleImportCSV,
  handleDownloadSampleCSV
}) {
  const [collapsed, setCollapsed] = useState(false);
  return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "600", children: [
    /* @__PURE__ */ jsxs(InlineStack, { align: "space-between", blockAlign: "center", children: [
      /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingXl", fontWeight: "bold", children: "Bulk Review Management" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "plain",
          icon: collapsed ? ChevronDownIcon : ChevronUpIcon,
          onClick: () => setCollapsed(!collapsed),
          accessibilityLabel: collapsed ? "Expand bulk management" : "Collapse bulk management"
        }
      )
    ] }),
    !collapsed && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Banner, { tone: "info", children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
        /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyLg", children: "Export your reviews to CSV for backup or analysis, or import reviews from a CSV or Excel file. Download the sample template to see the required format." }),
        /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodyMd", tone: "subdued", children: [
          /* @__PURE__ */ jsx("strong", { children: "Important:" }),
          " When importing, reviews for existing products will be imported successfully. Reviews for non-existent products will be skipped with a warning message."
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Divider, {}),
      /* @__PURE__ */ jsxs(InlineStack, { gap: "800", align: "start", blockAlign: "center", children: [
        /* @__PURE__ */ jsx("div", { style: { flex: 1 }, children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "primary",
              onClick: handleExportCSV,
              disabled: isExporting,
              icon: ExportIcon,
              fullWidth: true,
              size: "large",
              children: isExporting ? "Exporting..." : "Download CSV"
            }
          ),
          /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyMd", tone: "subdued", alignment: "center", children: "Export all reviews as CSV file" })
        ] }) }),
        /* @__PURE__ */ jsx("div", { style: { width: "1px", height: "100px", background: "var(--p-color-border-secondary)" } }),
        /* @__PURE__ */ jsx("div", { style: { flex: 1 }, children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
          !csvFile ? /* @__PURE__ */ jsx(Box, { width: "100%", children: /* @__PURE__ */ jsx(
            "input",
            {
              id: "csv-file-input",
              type: "file",
              accept: ".csv, .xls, .xlsx",
              onChange: handleFileChange,
              style: {
                width: "100%",
                padding: "12px",
                border: "1px solid #c4cdd5",
                borderRadius: "8px",
                background: "transparent",
                cursor: "pointer",
                fontSize: "14px",
                marginBottom: "8px"
              }
            }
          ) }) : /* @__PURE__ */ jsx(Box, { width: "100%", children: /* @__PURE__ */ jsx(
            Box,
            {
              background: "bg-fill-success-secondary",
              borderRadius: "300",
              padding: "400",
              children: /* @__PURE__ */ jsxs(InlineStack, { align: "space-between", blockAlign: "center", children: [
                /* @__PURE__ */ jsxs(InlineStack, { gap: "300", blockAlign: "center", children: [
                  /* @__PURE__ */ jsx(Box, { background: "bg-fill-success", borderRadius: "200", padding: "200", children: /* @__PURE__ */ jsx(Text, { as: "span", variant: "bodyLg", fontWeight: "bold", tone: "text-inverse", children: "✓" }) }),
                  /* @__PURE__ */ jsxs(BlockStack, { gap: "100", children: [
                    /* @__PURE__ */ jsx(Text, { as: "span", variant: "bodyLg", fontWeight: "bold", children: csvFile.name }),
                    /* @__PURE__ */ jsxs(Text, { as: "span", variant: "bodySm", tone: "subdued", children: [
                      (csvFile.size / 1024).toFixed(2),
                      " KB"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(Button, { variant: "tertiary", onClick: handleRemoveFile, tone: "critical", children: "Remove" })
              ] })
            }
          ) }),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "primary",
              onClick: handleImportCSV,
              disabled: !csvFile || isImporting,
              fullWidth: true,
              size: "large",
              children: isImporting ? "Importing..." : "Upload & Import"
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(Divider, {}),
      /* @__PURE__ */ jsx(InlineStack, { align: "center", children: /* @__PURE__ */ jsx(
        Button,
        {
          variant: "tertiary",
          onClick: handleDownloadSampleCSV,
          disabled: isDownloadingSample,
          loading: isDownloadingSample,
          children: "Download Sample CSV Template"
        }
      ) })
    ] })
  ] }) });
}
const REVIEW_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected"
};
const BADGE_TONE = {
  SUCCESS: "success",
  CRITICAL: "critical",
  ATTENTION: "attention",
  WARNING: "warning"
};
const STATUS_BADGE_TONE_MAP = {
  [REVIEW_STATUS.APPROVED]: BADGE_TONE.SUCCESS,
  [REVIEW_STATUS.REJECTED]: BADGE_TONE.CRITICAL,
  [REVIEW_STATUS.PENDING]: BADGE_TONE.ATTENTION
};
const RATING_BADGE_TONE_MAP = {
  getByRating: (rating) => {
    if (rating >= 4.5) return BADGE_TONE.SUCCESS;
    if (rating >= 4) return BADGE_TONE.SUCCESS;
    if (rating >= 3) return BADGE_TONE.WARNING;
    if (rating >= 2) return BADGE_TONE.CRITICAL;
    return BADGE_TONE.CRITICAL;
  }
};
const STATUS_OPTIONS = [
  { label: "Pending", value: REVIEW_STATUS.PENDING },
  { label: "Approved", value: REVIEW_STATUS.APPROVED },
  { label: "Rejected", value: REVIEW_STATUS.REJECTED }
];
const RATING_OPTIONS = [
  { label: "⭐ 1 Star", value: "1" },
  { label: "⭐⭐ 2 Stars", value: "2" },
  { label: "⭐⭐⭐ 3 Stars", value: "3" },
  { label: "⭐⭐⭐⭐ 4 Stars", value: "4" },
  { label: "⭐⭐⭐⭐⭐ 5 Stars", value: "5" }
];
function EditReviewModal({
  review,
  isOpen,
  isSubmitting,
  onClose,
  onSubmit
}) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    rating: "5",
    author: "",
    email: "",
    status: "pending"
  });
  const [selectedStatus, setSelectedStatus] = useState("");
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  useEffect(() => {
    if (review) {
      setFormData({
        title: review.title || "",
        content: review.content,
        rating: review.rating.toString(),
        author: review.author,
        email: review.email || "",
        status: review.status
      });
      setSelectedStatus(review.status);
      setCurrentImages(review.images || []);
      setImagesToRemove([]);
    }
  }, [review]);
  const handleRemoveImage = useCallback((imageId) => {
    setImagesToRemove((prev) => [...prev, imageId]);
    setCurrentImages((prev) => prev.filter((img) => img.id !== imageId));
  }, []);
  const handleSubmit = useCallback(() => {
    if (!review) return;
    const submitData = new FormData();
    submitData.append("intent", "edit");
    submitData.append("title", formData.title);
    submitData.append("content", formData.content);
    submitData.append("rating", formData.rating);
    submitData.append("author", formData.author);
    submitData.append("email", formData.email);
    submitData.append("status", selectedStatus || formData.status);
    imagesToRemove.forEach((imageId) => {
      submitData.append("imagesToRemove[]", imageId);
    });
    onSubmit(submitData);
  }, [review, formData, selectedStatus, imagesToRemove, onSubmit]);
  const getStatusOptions = (currentStatus) => {
    return STATUS_OPTIONS.filter((option) => option.value !== currentStatus);
  };
  return /* @__PURE__ */ jsx(
    Modal,
    {
      open: isOpen,
      onClose,
      title: "Edit Review",
      primaryAction: {
        content: "Save Changes",
        onAction: handleSubmit,
        loading: isSubmitting
      },
      secondaryActions: [
        {
          content: "Cancel",
          onAction: onClose
        }
      ],
      children: /* @__PURE__ */ jsx(Modal.Section, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "500", children: [
        /* @__PURE__ */ jsx(
          TextField,
          {
            label: "Title",
            value: formData.title,
            onChange: (value) => setFormData((prev) => ({ ...prev, title: value })),
            autoComplete: "off",
            disabled: isSubmitting
          }
        ),
        /* @__PURE__ */ jsx(
          TextField,
          {
            label: "Review Content",
            value: formData.content,
            onChange: (value) => setFormData((prev) => ({ ...prev, content: value })),
            multiline: 4,
            autoComplete: "off",
            disabled: isSubmitting
          }
        ),
        /* @__PURE__ */ jsxs(InlineGrid, { columns: 2, gap: "400", children: [
          /* @__PURE__ */ jsx(
            Select,
            {
              label: "Rating",
              options: [...RATING_OPTIONS],
              value: formData.rating,
              onChange: (value) => setFormData((prev) => ({ ...prev, rating: value })),
              disabled: isSubmitting
            }
          ),
          /* @__PURE__ */ jsx(
            Select,
            {
              label: "Change Status",
              options: [...getStatusOptions(formData.status)],
              value: selectedStatus,
              onChange: setSelectedStatus,
              disabled: isSubmitting,
              helpText: `Current status: ${formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}`,
              placeholder: "Select new status"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(InlineGrid, { columns: 2, gap: "400", children: [
          /* @__PURE__ */ jsx(
            TextField,
            {
              label: "Author Name",
              value: formData.author,
              onChange: (value) => setFormData((prev) => ({ ...prev, author: value })),
              autoComplete: "off",
              disabled: isSubmitting
            }
          ),
          /* @__PURE__ */ jsx(
            TextField,
            {
              label: "Email",
              value: formData.email,
              onChange: (value) => setFormData((prev) => ({ ...prev, email: value })),
              type: "email",
              autoComplete: "off",
              disabled: isSubmitting
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(Box, { children: [
          /* @__PURE__ */ jsx(Text, { as: "h4", variant: "headingSm", fontWeight: "medium", children: "Review Images" }),
          /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
            currentImages.length > 0 ? /* @__PURE__ */ jsxs(Box, { children: [
              /* @__PURE__ */ jsxs(
                Text,
                {
                  as: "p",
                  variant: "bodySm",
                  fontWeight: "medium",
                  tone: "subdued",
                  children: [
                    "Images (",
                    currentImages.length,
                    ")",
                    imagesToRemove.length > 0 && /* @__PURE__ */ jsxs(Text, { as: "span", variant: "bodySm", tone: "critical", children: [
                      " ",
                      "(",
                      imagesToRemove.length,
                      " marked for removal)"
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(InlineStack, { gap: "300", wrap: true, children: currentImages.map((image, index2) => /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    position: "relative",
                    textAlign: "right",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: imagesToRemove.includes(image.id) ? "3px solid var(--p-color-border-critical)" : "1px solid var(--p-color-border-subdued)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.2s ease-in-out",
                    opacity: imagesToRemove.includes(image.id) ? 0.4 : 1,
                    cursor: "default"
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleRemoveImage(image.id),
                        disabled: isSubmitting,
                        style: {
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          minHeight: "24px",
                          height: "24px",
                          width: "24px",
                          padding: "0",
                          borderRadius: "50%",
                          fontSize: "12px",
                          fontWeight: "bold",
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 10,
                          visibility: imagesToRemove.includes(image.id) ? "hidden" : "visible",
                          backgroundColor: "var(--p-color-bg-fill-critical)",
                          color: "var(--p-color-text-on-color)",
                          border: "none",
                          cursor: isSubmitting ? "not-allowed" : "pointer"
                        },
                        children: "×"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: image.url,
                        alt: image.altText || `Review image ${index2 + 1}`,
                        style: {
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          display: "block"
                        }
                      }
                    )
                  ]
                },
                image.id
              )) })
            ] }) : /* @__PURE__ */ jsx(
              Box,
              {
                padding: "400",
                background: "bg-surface-secondary",
                borderRadius: "200",
                children: /* @__PURE__ */ jsx(
                  Text,
                  {
                    as: "p",
                    variant: "bodySm",
                    tone: "subdued",
                    alignment: "center",
                    children: "No images attached to this review."
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx(Box, { padding: "200", children: /* @__PURE__ */ jsx(
              Text,
              {
                as: "p",
                variant: "bodySm",
                tone: "subdued",
                alignment: "center",
                children: "You can only remove existing images from this editor."
              }
            ) })
          ] })
        ] }),
        isSubmitting && /* @__PURE__ */ jsx(
          Box,
          {
            padding: "300",
            background: "bg-surface-secondary",
            borderRadius: "200",
            children: /* @__PURE__ */ jsx(
              Text,
              {
                as: "p",
                variant: "bodySm",
                tone: "subdued",
                alignment: "center",
                children: "💾 Saving changes..."
              }
            )
          }
        )
      ] }) })
    }
  );
}
function DeleteReviewModal({
  review,
  isOpen,
  isSubmitting,
  onClose,
  onConfirm
}) {
  return /* @__PURE__ */ jsx(
    Modal,
    {
      open: isOpen,
      onClose,
      title: "Delete Review",
      primaryAction: {
        content: "Delete Review",
        onAction: onConfirm,
        destructive: true,
        loading: isSubmitting
      },
      secondaryActions: [
        {
          content: "Cancel",
          onAction: onClose
        }
      ],
      children: /* @__PURE__ */ jsx(Modal.Section, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
        /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyMd", children: "Are you sure you want to delete this review? This action cannot be undone." }),
        review && /* @__PURE__ */ jsxs(
          Box,
          {
            padding: "400",
            background: "bg-surface-secondary",
            borderRadius: "200",
            children: [
              /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodySm", fontWeight: "medium", children: review.title || "No Title" }),
              /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodySm", tone: "subdued", children: [
                "by ",
                review.author,
                " • Rating: ",
                review.rating,
                "/5"
              ] }),
              /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodySm", tone: "subdued", children: [
                review.content.substring(0, 100),
                "..."
              ] })
            ]
          }
        ),
        isSubmitting && /* @__PURE__ */ jsx(Box, { padding: "200", children: /* @__PURE__ */ jsx(
          Text,
          {
            as: "p",
            variant: "bodySm",
            tone: "subdued",
            alignment: "center",
            children: "Deleting review..."
          }
        ) })
      ] }) })
    }
  );
}
function ReviewCard({
  review,
  isSubmitting,
  isStatusChanging,
  onEdit,
  onDelete,
  onChangeStatus
}) {
  const formatDate = (dateValue) => {
    try {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch (e) {
      return "";
    }
  };
  return /* @__PURE__ */ jsx(
    Box,
    {
      padding: "600",
      background: "bg-surface",
      borderRadius: "400",
      onClick: () => onEdit(review),
      style: {
        padding: "16px",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        border: "1px solid var(--p-color-border-subdued)"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.backgroundColor = "var(--p-color-bg-surface-hover)";
        e.currentTarget.style.boxShadow = "0 3px 8px rgba(0, 0, 0, 0.12)";
        e.currentTarget.style.transform = "translateY(-1px)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.backgroundColor = "var(--p-color-bg-surface)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
        e.currentTarget.style.transform = "translateY(0)";
      },
      children: /* @__PURE__ */ jsxs(BlockStack, { gap: "500", children: [
        /* @__PURE__ */ jsxs(InlineStack, { align: "space-between", blockAlign: "start", children: [
          /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
            /* @__PURE__ */ jsxs(InlineStack, { gap: "300", blockAlign: "center", wrap: false, children: [
              /* @__PURE__ */ jsx(Text, { as: "h3", variant: "headingMd", fontWeight: "semibold", children: review.title || "Untitled Review" }),
              /* @__PURE__ */ jsxs(InlineStack, { gap: "100", blockAlign: "center", children: [
                /* @__PURE__ */ jsx(Icon, { source: StarFilledIcon, tone: "warning" }),
                /* @__PURE__ */ jsx(Text, { as: "span", variant: "bodyMd", fontWeight: "medium", children: `${review.rating}/5` })
              ] }),
              /* @__PURE__ */ jsx(
                Badge,
                {
                  tone: STATUS_BADGE_TONE_MAP[review.status] || "attention",
                  size: "large",
                  children: (review.status || "pending").charAt(0).toUpperCase() + (review.status || "pending").slice(1)
                }
              ),
              review.isBundleReview && /* @__PURE__ */ jsx(Badge, { tone: "info", size: "large", children: "Syndicated" })
            ] }),
            /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodySm", tone: "subdued", children: [
              "by ",
              review.author,
              " • ",
              formatDate(review.createdAt || ""),
              review.email && review.email !== "" && ` • ${review.email}`
            ] })
          ] }),
          /* @__PURE__ */ jsxs(ButtonGroup, { children: [
            ((review.status || "pending") === "pending" || (review.status || "pending") === "rejected") && /* @__PURE__ */ jsx(
              Button,
              {
                size: "slim",
                variant: "primary",
                onClick: (e) => {
                  e.stopPropagation();
                  onChangeStatus(review.id, "approved");
                },
                disabled: isStatusChanging,
                loading: isStatusChanging,
                children: "Approve"
              }
            ),
            (review.status || "pending") === "approved" && /* @__PURE__ */ jsx(
              Button,
              {
                size: "slim",
                tone: "critical",
                variant: "primary",
                onClick: (e) => {
                  e.stopPropagation();
                  onChangeStatus(review.id, "rejected");
                },
                disabled: isStatusChanging,
                loading: isStatusChanging,
                children: "Reject"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                icon: DeleteIcon,
                onClick: (e) => {
                  e.stopPropagation();
                  onDelete(review);
                },
                variant: "tertiary",
                tone: "critical",
                size: "slim",
                disabled: isSubmitting,
                children: "Delete"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx(Box, { paddingBlockStart: "200", children: /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyLg", tone: "subdued", lineHeight: "1.6", children: review.content }) }),
        review.images && review.images.length > 0 && /* @__PURE__ */ jsxs(Box, { paddingBlockStart: "400", children: [
          /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodySm", fontWeight: "medium", tone: "subdued", children: [
            "Images (",
            review.images.length,
            ")"
          ] }),
          /* @__PURE__ */ jsx(InlineStack, { gap: "300", wrap: true, children: review.images.map((image, index2) => /* @__PURE__ */ jsx(
            Box,
            {
              style: {
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid var(--p-color-border-subdued)",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
              },
              children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: image.url,
                  alt: image.altText || `Review image ${index2 + 1}`,
                  style: {
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    display: "block"
                  }
                }
              )
            },
            image.id || index2
          )) })
        ] })
      ] })
    }
  );
}
function ReviewList({
  reviews,
  externalSubmit,
  onReviewsUpdate,
  actionSource = "individual"
}) {
  useSubmit();
  const fetcher = useFetcher();
  const statusFetcher = useFetcher();
  const [editingReview, setEditingReview] = useState(null);
  const [deletingReview, setDeletingReview] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const data = fetcher.data;
    if (fetcher.state === "idle" && data) {
      if (data.success) {
        setError(null);
        if (editingReview) {
          setEditingReview(null);
        }
        if (deletingReview) {
          setDeletingReview(null);
        }
        if (onReviewsUpdate) {
          setTimeout(onReviewsUpdate, 100);
        }
      } else if (data.error) {
        setError(data.error);
      }
    }
  }, [fetcher.state, fetcher.data, editingReview, deletingReview, onReviewsUpdate]);
  useEffect(() => {
    const statusData = statusFetcher.data;
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
  const handleChangeStatus = useCallback((reviewId, newStatus) => {
    const formData = new FormData();
    formData.append("status", newStatus);
    formData.append("actionSource", actionSource);
    formData.append("reviewId", reviewId);
    statusFetcher.submit(formData, {
      method: "post",
      action: `/app/reviews/${reviewId}/status`
    });
  }, [actionSource, statusFetcher]);
  const handleEdit = useCallback((review) => {
    setEditingReview(review);
    setError(null);
  }, []);
  const handleDelete = useCallback((review) => {
    setDeletingReview(review);
    setError(null);
  }, []);
  const handleEditSubmit = useCallback((formData) => {
    if (!editingReview) return;
    formData.append("actionSource", actionSource);
    formData.append("reviewId", editingReview.id);
    fetcher.submit(formData, {
      method: "post",
      action: `/app/reviews/${editingReview.id}/actions`
    });
  }, [editingReview, fetcher, actionSource]);
  const handleDeleteConfirm = useCallback(() => {
    if (!deletingReview) return;
    const formData = new FormData();
    formData.append("intent", "delete");
    formData.append("actionSource", actionSource);
    formData.append("reviewId", deletingReview.id);
    fetcher.submit(formData, {
      method: "post",
      action: `/app/reviews/${deletingReview.id}/actions`
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
  return /* @__PURE__ */ jsxs(BlockStack, { gap: "600", children: [
    error && /* @__PURE__ */ jsx(Box, { padding: "400", children: /* @__PURE__ */ jsx(InlineError, { message: error, fieldID: "review-error" }) }),
    /* @__PURE__ */ jsx(
      EditReviewModal,
      {
        review: editingReview,
        isOpen: !!editingReview,
        isSubmitting: fetcher.state === "submitting",
        onClose: handleEditModalClose,
        onSubmit: handleEditSubmit
      }
    ),
    /* @__PURE__ */ jsx(
      DeleteReviewModal,
      {
        review: deletingReview,
        isOpen: !!deletingReview,
        isSubmitting: fetcher.state === "submitting",
        onClose: handleDeleteModalClose,
        onConfirm: handleDeleteConfirm
      }
    ),
    reviews && reviews.length > 0 ? /* @__PURE__ */ jsx(BlockStack, { gap: "500", children: reviews.map((review) => {
      var _a2, _b;
      return /* @__PURE__ */ jsx(
        ReviewCard,
        {
          review,
          isSubmitting: fetcher.state !== "idle" && ((_a2 = fetcher.formData) == null ? void 0 : _a2.get("reviewId")) === review.id,
          isStatusChanging: statusFetcher.state !== "idle" && ((_b = statusFetcher.formData) == null ? void 0 : _b.get("reviewId")) === review.id,
          onEdit: handleEdit,
          onDelete: handleDelete,
          onChangeStatus: handleChangeStatus
        },
        review.id
      );
    }) }) : /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          padding: "var(--p-space-1200)",
          background: "var(--p-color-bg-surface)",
          borderRadius: "var(--p-border-radius-400)",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          border: "1px solid var(--p-color-border-subdued)"
        },
        children: /* @__PURE__ */ jsx("p", { style: { paddingInline: "var(--p-space-400)", textAlign: "center" }, children: /* @__PURE__ */ jsx(Text, { as: "span", variant: "bodyLg", fontWeight: "medium", tone: "subdued", children: "No reviews yet. Be the first to review!" }) })
      }
    )
  ] });
}
function ProductOverviewTable({
  productSummaries,
  actionSource = "individual"
}) {
  const [activeModal, setActiveModal] = useState(false);
  const [selectedProductReviews, setSelectedProductReviews] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState("");
  const submit = useSubmit();
  const handleViewReviews = useCallback((product) => {
    setSelectedProductReviews(product.individualReviews);
    setSelectedProductName(product.productName);
    setActiveModal(true);
  }, []);
  const handleModalClose = useCallback(() => {
    setActiveModal(false);
    setSelectedProductReviews([]);
    setSelectedProductName("");
  }, []);
  const getPendingReviewsCount = (reviews) => {
    return reviews.filter((review) => review.status === "pending").length;
  };
  return /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
    productSummaries.length > 0 ? /* @__PURE__ */ jsx(Card, { padding: "0", children: /* @__PURE__ */ jsx(
      ResourceList,
      {
        resourceName: { singular: "product", plural: "products" },
        items: productSummaries,
        renderItem: (item) => {
          const { productId, productName, productImageUrl, averageRating, totalReviews, individualReviews } = item;
          const pendingReviewsCount = getPendingReviewsCount(individualReviews);
          return /* @__PURE__ */ jsx(
            ResourceItem,
            {
              id: productId,
              url: "#",
              media: /* @__PURE__ */ jsx(Box, { paddingInlineEnd: "200", children: /* @__PURE__ */ jsx(
                Thumbnail,
                {
                  source: productImageUrl || APP_CONFIG.IMAGES.getPlaceholderUrl(productName.split(" ")[0]),
                  alt: `Image of ${productName}`,
                  size: "medium"
                }
              ) }),
              accessibilityLabel: `View reviews for ${productName}`,
              onClick: () => handleViewReviews(item),
              children: /* @__PURE__ */ jsxs(InlineGrid, { columns: "1fr auto", gap: "400", alignItems: "center", children: [
                /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
                  /* @__PURE__ */ jsx(Text, { as: "h3", variant: "bodyLg", fontWeight: "semibold", children: productName }),
                  /* @__PURE__ */ jsxs(InlineStack, { gap: "300", align: "start", blockAlign: "center", children: [
                    /* @__PURE__ */ jsxs(InlineStack, { gap: "100", align: "center", children: [
                      /* @__PURE__ */ jsx(Icon, { source: StarFilledIcon, tone: "warning" }),
                      /* @__PURE__ */ jsx(Text, { as: "span", variant: "bodyMd", fontWeight: "medium", children: averageRating }),
                      /* @__PURE__ */ jsx(Text, { as: "span", variant: "bodyMd", tone: "subdued", children: "/5" })
                    ] }),
                    /* @__PURE__ */ jsx(Text, { as: "span", variant: "bodyMd", tone: "subdued", children: "•" }),
                    /* @__PURE__ */ jsxs(Text, { as: "span", variant: "bodyMd", tone: "subdued", children: [
                      totalReviews,
                      " review",
                      totalReviews !== 1 ? "s" : ""
                    ] }),
                    pendingReviewsCount > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Text, { as: "span", variant: "bodyMd", tone: "subdued", children: "•" }),
                      /* @__PURE__ */ jsx(Badge, { tone: "attention", size: "small", children: `${pendingReviewsCount} pending` })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  Badge,
                  {
                    tone: RATING_BADGE_TONE_MAP.getByRating(parseFloat(averageRating)),
                    size: "large",
                    children: averageRating
                  }
                )
              ] })
            }
          );
        }
      }
    ) }) : /* @__PURE__ */ jsx(Card, { padding: "600", children: /* @__PURE__ */ jsx(Box, { paddingBlockStart: "400", paddingBlockEnd: "400", children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", align: "center", children: [
      /* @__PURE__ */ jsx("div", { style: {
        background: "var(--p-color-bg-fill-tertiary)",
        borderRadius: "var(--p-border-radius-400)",
        padding: "var(--p-space-400)",
        marginBottom: "var(--p-space-200)"
      }, children: /* @__PURE__ */ jsx(Icon, { source: StarFilledIcon, tone: "subdued" }) }),
      /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyLg", alignment: "center", tone: "subdued", children: "No products with reviews yet." }),
      /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyMd", alignment: "center", tone: "subdued", children: "Customer reviews will appear here once they start coming in." })
    ] }) }) }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        activator: /* @__PURE__ */ jsx("div", { style: { display: "none" } }),
        open: activeModal,
        onClose: handleModalClose,
        title: /* @__PURE__ */ jsxs(InlineStack, { align: "space-between", blockAlign: "center", gap: "400", children: [
          /* @__PURE__ */ jsxs(InlineStack, { gap: "200", align: "center", children: [
            /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingLg", children: selectedProductName }),
            /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodyMd", tone: "subdued", children: [
              "• Customer Reviews (",
              selectedProductReviews.length,
              ")"
            ] })
          ] }),
          selectedProductReviews.length > 0 && /* @__PURE__ */ jsx(Badge, { tone: "attention", children: `${getPendingReviewsCount(selectedProductReviews)} pending` })
        ] }),
        size: "large",
        primaryAction: {
          content: "Close",
          onAction: handleModalClose
        },
        children: /* @__PURE__ */ jsx(Modal.Section, { children: /* @__PURE__ */ jsx(BlockStack, { gap: "400", children: selectedProductReviews.length > 0 ? /* @__PURE__ */ jsx(
          ReviewList,
          {
            reviews: selectedProductReviews,
            externalSubmit: submit,
            onReviewsUpdate: handleModalClose,
            actionSource
          }
        ) : /* @__PURE__ */ jsx(Card, { padding: "600", children: /* @__PURE__ */ jsx(Box, { paddingBlockStart: "400", paddingBlockEnd: "400", children: /* @__PURE__ */ jsxs(BlockStack, { gap: "400", align: "center", children: [
          /* @__PURE__ */ jsx("div", { style: {
            background: "var(--p-color-bg-fill-tertiary)",
            borderRadius: "var(--p-border-radius-400)",
            padding: "var(--p-space-400)",
            marginBottom: "var(--p-space-200)"
          }, children: /* @__PURE__ */ jsx(Icon, { source: StarFilledIcon, tone: "subdued" }) }),
          /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyLg", alignment: "center", tone: "subdued", children: "No reviews available for this product." }),
          /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyMd", alignment: "center", tone: "subdued", children: "Check back later for customer feedback." })
        ] }) }) }) }) })
      }
    )
  ] });
}
function ReviewTabsSection({
  selectedTab,
  handleTabChange,
  totalReviews,
  reviews,
  pageCount,
  currentPage,
  hasPrevious,
  hasNext,
  handlePageChange,
  productSummaries,
  sortOptions,
  sortOption,
  handleSortChange,
  bundles,
  selectedBundleId,
  setSelectedBundleId,
  selectedProductId,
  setSelectedProductId,
  shopifyProducts,
  getNumericProductId: getNumericProductId2,
  getGidProductId: getGidProductId2,
  getProductTitleFromNumericId,
  getProductImageFromNumericId
}) {
  var _a2;
  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive2) => !popoverActive2),
    []
  );
  const handleSortSelection = useCallback(
    (value) => {
      handleSortChange(value);
      setPopoverActive(false);
    },
    [handleSortChange]
  );
  const tabs = [
    { id: "all-reviews", content: "All Reviews", panelID: "all-reviews-panel", badge: totalReviews > 0 ? String(totalReviews) : void 0 },
    { id: "product-summary", content: "Product Ratings Overview", panelID: "product-summary-panel", badge: productSummaries.length > 0 ? String(productSummaries.length) : void 0 },
    { id: "bundle-reviews", content: "Bundle Review Approvals", panelID: "bundle-reviews-panel", badge: bundles.length > 0 ? String(bundles.length) : void 0 }
  ];
  const sortedProductSummaries = [...productSummaries].sort((a, b) => {
    switch (sortOption) {
      case "highest-rating":
        return parseFloat(b.averageRating) - parseFloat(a.averageRating);
      case "lowest-rating":
        return parseFloat(a.averageRating) - parseFloat(b.averageRating);
      case "most-reviews":
        return b.totalReviews - a.totalReviews;
      case "least-reviews":
        return a.totalReviews - b.totalReviews;
      default:
        return 0;
    }
  });
  const currentSortLabel = ((_a2 = sortOptions.find((option) => option.value === sortOption)) == null ? void 0 : _a2.label) || "Sort by";
  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
          /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingLg", fontWeight: "semibold", children: "All Customer Reviews" }),
          /* @__PURE__ */ jsx(Divider, {}),
          /* @__PURE__ */ jsx(Box, { padding: "500", children: reviews.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(ReviewList, { reviews, actionSource: "individual" }),
            pageCount > 1 && /* @__PURE__ */ jsx(Box, { paddingBlockStart: "400", paddingBlockEnd: "200", children: /* @__PURE__ */ jsx(InlineStack, { align: "center", children: /* @__PURE__ */ jsx(
              Pagination,
              {
                hasPrevious,
                onPrevious: () => handlePageChange(currentPage - 1),
                hasNext,
                onNext: () => handlePageChange(currentPage + 1),
                label: `Page ${currentPage} of ${pageCount}`
              }
            ) }) })
          ] }) : /* @__PURE__ */ jsx(Text, { as: "p", children: "No reviews yet." }) })
        ] });
      case 1:
        return /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
          /* @__PURE__ */ jsxs(InlineStack, { align: "space-between", blockAlign: "center", children: [
            /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingLg", fontWeight: "semibold", children: "Product Ratings Overview (Individual Approvals)" }),
            /* @__PURE__ */ jsx(
              Popover,
              {
                active: popoverActive,
                activator: /* @__PURE__ */ jsx(Button, { onClick: togglePopoverActive, disclosure: true, icon: SortIcon, children: currentSortLabel }),
                onClose: togglePopoverActive,
                children: /* @__PURE__ */ jsx(
                  ActionList,
                  {
                    items: sortOptions.map((option) => ({
                      content: option.label,
                      onAction: () => handleSortSelection(option.value),
                      active: sortOption === option.value
                    }))
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsx(Divider, {}),
          /* @__PURE__ */ jsx(Box, { padding: "500", children: sortedProductSummaries.length > 0 ? /* @__PURE__ */ jsx(ProductOverviewTable, { productSummaries: sortedProductSummaries, actionSource: "individual" }) : /* @__PURE__ */ jsx(Text, { as: "p", children: "No products with reviews yet." }) })
        ] });
      case 2:
        const currentBundle = bundles.find((b) => b.id === selectedBundleId);
        const currentProductSummary = productSummaries.find((p) => getNumericProductId2(p.productId) === selectedProductId);
        if (currentProductSummary && selectedProductId && currentBundle) {
          const allReviewsForProduct = currentProductSummary.individualReviews;
          return /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
            /* @__PURE__ */ jsx(Box, { padding: "400", background: "bg-fill-info-secondary", borderRadius: "200", children: /* @__PURE__ */ jsxs(InlineStack, { align: "start", blockAlign: "center", gap: "400", children: [
              /* @__PURE__ */ jsx(Button, { onClick: () => setSelectedProductId(null), size: "slim", children: "← Back to Bundle Products" }),
              /* @__PURE__ */ jsxs(BlockStack, { gap: "100", children: [
                /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingLg", fontWeight: "semibold", children: currentProductSummary.productName }),
                /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodyMd", tone: "subdued", children: [
                  "Part of Bundle: ",
                  currentBundle.name
                ] }),
                /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodySm", tone: "subdued", children: [
                  "Status: ",
                  allReviewsForProduct.filter((r) => r.status === "pending").length,
                  " Pending,",
                  allReviewsForProduct.filter((r) => r.status === "approved").length,
                  " Approved,",
                  allReviewsForProduct.filter((r) => r.status === "rejected").length,
                  " Rejected"
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs(Text, { as: "h3", variant: "headingMd", fontWeight: "medium", children: [
              "All Reviews for Syndication (",
              allReviewsForProduct.length,
              ")"
            ] }),
            /* @__PURE__ */ jsx(Divider, {}),
            /* @__PURE__ */ jsx(Box, { padding: "500", children: allReviewsForProduct.length > 0 ? /* @__PURE__ */ jsx(ReviewList, { reviews: allReviewsForProduct, actionSource: "bundle" }) : /* @__PURE__ */ jsx(Text, { as: "p", children: "No reviews found for this product." }) })
          ] });
        }
        if (currentBundle && selectedBundleId) {
          const productsInBundle = currentBundle.productIds;
          return /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
            /* @__PURE__ */ jsx(Box, { padding: "400", background: "bg-fill-info-secondary", borderRadius: "200", children: /* @__PURE__ */ jsxs(InlineStack, { align: "start", blockAlign: "center", gap: "400", children: [
              /* @__PURE__ */ jsx(Button, { onClick: () => setSelectedBundleId(null), size: "slim", children: "← Back to Bundles List" }),
              /* @__PURE__ */ jsxs(BlockStack, { gap: "100", children: [
                /* @__PURE__ */ jsxs(Text, { as: "h2", variant: "headingLg", fontWeight: "semibold", children: [
                  "Bundle: ",
                  currentBundle.name
                ] }),
                /* @__PURE__ */ jsxs(Text, { as: "p", variant: "bodyMd", tone: "subdued", children: [
                  "Products: ",
                  productsInBundle.length
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(Text, { as: "h3", variant: "headingMd", fontWeight: "medium", children: "Products in Bundle" }),
            /* @__PURE__ */ jsx(Divider, {}),
            /* @__PURE__ */ jsx(Box, { padding: "500", children: /* @__PURE__ */ jsx(
              ResourceList,
              {
                resourceName: { singular: "product", plural: "products" },
                items: productsInBundle,
                renderItem: (numericId) => {
                  const productTitle = getProductTitleFromNumericId(numericId);
                  const productImage = getProductImageFromNumericId(numericId);
                  const productSummary = productSummaries.find((p) => getNumericProductId2(p.productId) === numericId);
                  const totalReviewsCount = (productSummary == null ? void 0 : productSummary.individualReviews.length) || 0;
                  const pendingCount = (productSummary == null ? void 0 : productSummary.individualReviews.filter((r) => r.status === "pending").length) || 0;
                  const approvedCount = (productSummary == null ? void 0 : productSummary.individualReviews.filter((r) => r.status === "approved").length) || 0;
                  const productGid = getGidProductId2(numericId);
                  return /* @__PURE__ */ jsx(
                    ResourceItem,
                    {
                      id: productGid,
                      url: "#",
                      media: /* @__PURE__ */ jsx(
                        Thumbnail,
                        {
                          source: productImage || "https://via.placeholder.com/80",
                          alt: productTitle,
                          size: "small"
                        }
                      ),
                      accessibilityLabel: `View reviews for ${productTitle}`,
                      onClick: () => setSelectedProductId(numericId),
                      children: /* @__PURE__ */ jsxs(BlockStack, { gap: "100", children: [
                        /* @__PURE__ */ jsx(Text, { as: "h3", variant: "bodyLg", fontWeight: "semibold", children: productTitle }),
                        /* @__PURE__ */ jsxs(InlineStack, { gap: "200", blockAlign: "center", children: [
                          numericId === currentBundle.bundleProductId && /* @__PURE__ */ jsx(Badge, { tone: "success", size: "small", children: "Main" }),
                          /* @__PURE__ */ jsx(Badge, { tone: "info", size: "small", children: `${totalReviewsCount} Total Review${totalReviewsCount !== 1 ? "s" : ""}` }),
                          pendingCount > 0 && /* @__PURE__ */ jsx(Badge, { tone: "attention", size: "small", children: `${pendingCount} Pending` }),
                          approvedCount > 0 && /* @__PURE__ */ jsx(Badge, { tone: "success", size: "small", children: `${approvedCount} Approved` }),
                          /* @__PURE__ */ jsx(Badge, { size: "small", children: `ID: ${numericId}` })
                        ] })
                      ] })
                    }
                  );
                }
              }
            ) })
          ] });
        }
        return /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
          /* @__PURE__ */ jsxs(InlineStack, { align: "space-between", blockAlign: "center", children: [
            /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingLg", fontWeight: "semibold", children: "Select Bundle for Approval" }),
            /* @__PURE__ */ jsx(Badge, { tone: "info", size: "large", children: `${bundles.length} bundles created` })
          ] }),
          /* @__PURE__ */ jsx(Divider, {}),
          /* @__PURE__ */ jsx(Box, { padding: "500", children: bundles.length > 0 ? /* @__PURE__ */ jsx(
            ResourceList,
            {
              resourceName: { singular: "bundle", plural: "bundles" },
              items: bundles,
              renderItem: (bundle) => {
                const productsInBundleCount = bundle.productIds.length;
                const mainProductTitle = getProductTitleFromNumericId(bundle.bundleProductId);
                return /* @__PURE__ */ jsx(
                  ResourceItem,
                  {
                    id: bundle.id,
                    url: "#",
                    media: /* @__PURE__ */ jsx(Icon, { source: FolderIcon, tone: "base" }),
                    accessibilityLabel: `View bundle ${bundle.name}`,
                    onClick: () => setSelectedBundleId(bundle.id),
                    children: /* @__PURE__ */ jsxs(BlockStack, { gap: "100", children: [
                      /* @__PURE__ */ jsx(Text, { as: "h3", variant: "bodyLg", fontWeight: "semibold", children: bundle.name }),
                      /* @__PURE__ */ jsxs(InlineStack, { gap: "100", blockAlign: "center", wrap: false, children: [
                        /* @__PURE__ */ jsx(Badge, { size: "small", tone: "success", children: `Main: ${mainProductTitle}` }),
                        /* @__PURE__ */ jsx(Badge, { size: "small", children: `+${productsInBundleCount - 1} ${productsInBundleCount - 1 === 1 ? "Product" : "Products"}` })
                      ] })
                    ] })
                  }
                );
              }
            }
          ) : /* @__PURE__ */ jsxs(BlockStack, { gap: "200", align: "center", children: [
            /* @__PURE__ */ jsx(Text, { as: "p", alignment: "center", children: "No Review Bundles configured yet." }),
            /* @__PURE__ */ jsx(Link$1, { url: "/app/create-bundle", children: "Create your first bundle now." })
          ] }) })
        ] });
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsx(Tabs, { tabs, selected: selectedTab, onSelect: handleTabChange, children: /* @__PURE__ */ jsx(Box, { paddingBlockStart: "400", children: renderTabContent() }) });
}
async function checkProductExists(productId, admin) {
  var _a2;
  try {
    const gid = `gid://shopify/Product/${productId}`;
    const response = await admin.graphql(`
      query productExists($id: ID!) {
        product(id: $id) { id title }
      }`, { variables: { id: gid } });
    const data = await response.json();
    return !!((_a2 = data.data) == null ? void 0 : _a2.product);
  } catch (error) {
    console.error(`Error checking product ${productId}:`, error);
    return false;
  }
}
async function fetchProductSummaries(admin, shop) {
  var _a2;
  const allProductReviews = await db$1.productReview.findMany({
    where: { shop },
    orderBy: { createdAt: "desc" },
    include: { images: true }
  });
  const productMap = /* @__PURE__ */ new Map();
  const uniqueProductGids = /* @__PURE__ */ new Set();
  allProductReviews.forEach((review) => {
    const productGid = ensureShopifyGid(review.productId);
    uniqueProductGids.add(productGid);
    if (!productMap.has(productGid)) {
      productMap.set(productGid, { totalRating: 0, count: 0, reviews: [] });
    }
    const productData = productMap.get(productGid);
    productData.totalRating += review.rating;
    productData.count++;
    productData.reviews.push(review);
  });
  const productsData = {};
  if (uniqueProductGids.size > 0) {
    const idsToFetch = Array.from(uniqueProductGids);
    const query = `query ProductsByIds($ids: [ID!]!) { nodes(ids: $ids) { ... on Product { id title images(first: 1) { edges { node { url } } } } } }`;
    const response = await admin.graphql(query, { variables: { ids: idsToFetch } });
    const data = await response.json();
    if ((_a2 = data.data) == null ? void 0 : _a2.nodes) {
      data.data.nodes.forEach((node) => {
        var _a3, _b, _c;
        if (node && node.id && node.title) {
          productsData[node.id] = {
            title: node.title,
            imageUrl: ((_c = (_b = (_a3 = node.images) == null ? void 0 : _a3.edges[0]) == null ? void 0 : _b.node) == null ? void 0 : _c.url) || null
          };
        }
      });
    }
  }
  const productSummaries = Array.from(productMap.entries()).map(([productIdGid, data]) => {
    var _a3, _b;
    return {
      productId: productIdGid,
      productName: ((_a3 = productsData[productIdGid]) == null ? void 0 : _a3.title) || `Product ${getNumericProductId(productIdGid)}`,
      productImageUrl: ((_b = productsData[productIdGid]) == null ? void 0 : _b.imageUrl) || null,
      averageRating: (data.totalRating / data.count).toFixed(1),
      totalReviews: data.count,
      individualReviews: data.reviews.map((r) => ({
        id: r.id,
        productId: r.productId,
        rating: r.rating,
        author: r.author,
        email: r.email,
        title: r.title,
        content: r.content,
        status: r.status,
        createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
        updatedAt: r.updatedAt instanceof Date ? r.updatedAt.toISOString() : r.updatedAt,
        images: r.images.map((img) => ({
          id: img.id,
          url: img.url,
          altText: img.altText,
          order: img.order,
          createdAt: img.createdAt instanceof Date ? img.createdAt.toISOString() : img.createdAt,
          updatedAt: img.updatedAt instanceof Date ? img.updatedAt.toISOString() : img.updatedAt
        }))
      }))
    };
  });
  productSummaries.sort((a, b) => parseFloat(b.averageRating) - parseFloat(a.averageRating));
  return productSummaries;
}
async function loader({ request }) {
  var _a2, _b, _c;
  const url = new URL(request.url);
  const pageParam = url.searchParams.get("page");
  const reviewsPerPage = 10;
  const currentPage = parseInt(pageParam || "1", 10);
  const skip = (currentPage - 1) * reviewsPerPage;
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;
  try {
    const totalReviews = await db$1.productReview.count({ where: { shop } });
    const allProductReviews = await db$1.productReview.findMany({
      where: { shop },
      orderBy: { createdAt: "desc" },
      skip,
      take: reviewsPerPage,
      include: { images: true }
    });
    const sumAllRatings = await db$1.productReview.aggregate({
      where: { shop },
      _sum: { rating: true }
    });
    const totalRatingSum = ((_a2 = sumAllRatings == null ? void 0 : sumAllRatings._sum) == null ? void 0 : _a2.rating) || 0;
    const averageAppRating = totalReviews > 0 ? (totalRatingSum / totalReviews).toFixed(1) : "0.0";
    const serializableAllReviews = allProductReviews.map((review) => ({
      ...review,
      createdAt: review.createdAt instanceof Date ? review.createdAt.toISOString() : review.createdAt,
      updatedAt: review.updatedAt instanceof Date ? review.updatedAt.toISOString() : review.updatedAt,
      images: review.images.map((image) => ({
        ...image,
        createdAt: image.createdAt instanceof Date ? image.createdAt.toISOString() : image.createdAt,
        updatedAt: image.updatedAt instanceof Date ? image.updatedAt.toISOString() : image.updatedAt
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
    const shopifyProducts = (((_c = (_b = data.data) == null ? void 0 : _b.products) == null ? void 0 : _c.edges) || []).map((edge) => {
      var _a3, _b2, _c2, _d;
      return {
        id: edge.node.id,
        title: edge.node.title,
        handle: edge.node.handle,
        imageUrl: ((_d = (_c2 = (_b2 = (_a3 = edge.node.images) == null ? void 0 : _a3.edges) == null ? void 0 : _b2[0]) == null ? void 0 : _c2.node) == null ? void 0 : _d.url) || null,
        numericId: getNumericProductId(edge.node.id)
      };
    });
    const productSummaries = await fetchProductSummaries(admin, shop);
    const bundles = await db$1.reviewBundle.findMany({
      where: { shop },
      orderBy: { createdAt: "desc" }
    });
    const serializableBundles = bundles.map((b) => ({
      ...b,
      productIds: b.productIds.split(",")
    }));
    return json$1({
      reviews: serializableAllReviews,
      totalReviews,
      averageRating: averageAppRating,
      currentPage,
      reviewsPerPage,
      productSummaries,
      bundles: serializableBundles,
      shopifyProducts
    });
  } catch (error) {
    console.error("Error fetching data in GWL Hub loader:", error);
    return json$1({
      reviews: [],
      totalReviews: 0,
      averageRating: "0.0",
      currentPage: 1,
      reviewsPerPage,
      productSummaries: [],
      bundles: [],
      shopifyProducts: []
    });
  }
}
async function action({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  const actionType = formData.get("actionType");
  if (actionType === "export_csv") {
    try {
      const reviews = await db$1.productReview.findMany({
        where: { shop },
        orderBy: { createdAt: "desc" },
        include: { images: true }
      });
      const csvHeaders = "Product ID,Rating,Author,Email,Title,Content,Status,Created At\n";
      const csvRows = reviews.map((review) => {
        const escapedContent = review.content ? `"${review.content.replace(/"/g, '""')}"` : "";
        const escapedTitle = review.title ? `"${review.title.replace(/"/g, '""')}"` : "";
        return [
          review.productId,
          review.rating,
          review.author || "",
          review.email || "",
          escapedTitle,
          escapedContent,
          review.status,
          review.createdAt instanceof Date ? review.createdAt.toISOString() : review.createdAt
        ].join(",");
      }).join("\n");
      const csvData = csvHeaders + csvRows;
      return json$1({
        success: true,
        csvData,
        fileName: `reviews-export-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`
      });
    } catch (error) {
      console.error("Export error:", error);
      return json$1({ success: false, error: "Failed to export reviews" }, { status: 500 });
    }
  }
  if (actionType === "download_sample_csv") {
    const sampleData = `Product ID,Rating,Author,Email,Title,Content,Status,Created At
gid://shopify/Product/123456789,5,John Doe,john@example.com,"Great product!","This product is amazing and works perfectly.",approved,2024-01-15T10:30:00.000Z
gid://shopify/Product/123456789,4,Jane Smith,jane@example.com,"Good quality","Pretty good but could be improved in some areas.",pending,2024-01-16T14:20:00.000Z
gid://shopify/Product/987654321,3,Bob Wilson,bob@example.com,"Average product","It's okay for the price, but not exceptional.",rejected,2024-01-17T09:15:00.000Z`;
    return json$1({
      success: true,
      csvData: sampleData,
      fileName: "reviews-sample-template.csv"
    });
  }
  if (actionType === "import_csv") {
    try {
      const csvFile = formData.get("csvFile");
      if (!csvFile) {
        return json$1({ success: false, error: "No file provided" }, { status: 400 });
      }
      const arrayBuffer = await csvFile.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      if (rawData.length < 2) {
        return json$1({ success: false, error: "File is empty or invalid" }, { status: 400 });
      }
      const headers2 = rawData[0].map((h) => h == null ? void 0 : h.trim());
      const requiredHeaders = ["Product ID", "Rating", "Author", "Email", "Title", "Content", "Status", "Created At"];
      const missingHeaders = requiredHeaders.filter((h) => !headers2.includes(h));
      if (missingHeaders.length > 0) {
        return json$1({
          success: false,
          error: `Missing required headers: ${missingHeaders.join(", ")}`
        }, { status: 400 });
      }
      const headerMap = {};
      headers2.forEach((h, i) => {
        headerMap[h] = i;
      });
      const importedReviews = [];
      const skippedProducts = [];
      const duplicateReviews = [];
      for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.length === 0) continue;
        const getValue = (header) => {
          const idx = headerMap[header];
          return row[idx] !== void 0 ? String(row[idx]).trim() : "";
        };
        const productIdStr = getValue("Product ID");
        if (!productIdStr) continue;
        const productId = getNumericProductId(productIdStr);
        const productExists = await checkProductExists(productId, admin);
        if (!productExists) {
          skippedProducts.push(productId);
          continue;
        }
        const email = getValue("Email");
        const content2 = getValue("Content");
        const rating = parseInt(getValue("Rating") || "0", 10);
        const author = getValue("Author");
        const title = getValue("Title");
        const status = getValue("Status");
        const createdAtStr = getValue("Created At");
        const createdAt = createdAtStr ? new Date(createdAtStr) : /* @__PURE__ */ new Date();
        const existingReview = await db$1.productReview.findFirst({
          where: {
            shop,
            productId,
            email,
            content: content2
            // Check content to be sure it's the same review
          }
        });
        if (existingReview) {
          duplicateReviews.push(i + 1);
          continue;
        }
        try {
          const newReview = await db$1.productReview.create({
            data: {
              shop,
              productId,
              rating,
              author,
              email,
              title,
              content: content2,
              status: status || "pending",
              createdAt,
              updatedAt: /* @__PURE__ */ new Date()
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
      return json$1({
        success: true,
        message,
        invalidProducts: skippedProducts.length > 0 ? [...new Set(skippedProducts)] : void 0
      });
    } catch (error) {
      console.error("Import error:", error);
      return json$1({ success: false, error: "Failed to import file" }, { status: 500 });
    }
  }
  return json$1({ success: false, error: "Unknown action type" });
}
function HomePage() {
  const {
    reviews,
    totalReviews,
    averageRating,
    currentPage,
    productSummaries,
    bundles,
    shopifyProducts,
    csvFile,
    activeToast,
    toastMessage,
    toastError,
    selectedTab,
    selectedBundleId,
    selectedProductId,
    sortOption,
    isExporting,
    isImporting,
    isDownloadingSample,
    pageCount,
    hasNext,
    hasPrevious,
    handlePageChange,
    handleFileChange,
    handleRemoveFile,
    handleExportCSV,
    handleDownloadSampleCSV,
    handleImportCSV,
    handleTabChange,
    handleSortChange,
    setSelectedBundleId,
    setSelectedProductId,
    setActiveToast
  } = useHomeDashboard();
  const getProductTitleFromNumericId = (numericId) => {
    const product = shopifyProducts.find((p) => p.numericId === numericId);
    return (product == null ? void 0 : product.title) || `Product ${numericId}`;
  };
  const getProductImageFromNumericId = (numericId) => {
    const product = shopifyProducts.find((p) => p.numericId === numericId);
    return (product == null ? void 0 : product.imageUrl) || null;
  };
  const sortOptions = [
    { label: "Highest Rating", value: "highest-rating" },
    { label: "Lowest Rating", value: "lowest-rating" },
    { label: "Most Reviews", value: "most-reviews" },
    { label: "Least Reviews", value: "least-reviews" }
  ];
  const toastMarkup = activeToast ? /* @__PURE__ */ jsx(Toast, { content: toastMessage, onDismiss: () => setActiveToast(false), error: toastError }) : null;
  return /* @__PURE__ */ jsxs(Page, { fullWidth: true, children: [
    /* @__PURE__ */ jsxs(BlockStack, { gap: "400", children: [
      /* @__PURE__ */ jsx(TitleBar, { title: "GWL - Reviews Management Hub" }),
      /* @__PURE__ */ jsxs(Layout, { children: [
        /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(BlockStack, { gap: "400", children: /* @__PURE__ */ jsx(
          StatsCard,
          {
            totalReviews,
            averageRating
          }
        ) }) }),
        /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(
          BulkManagementSection,
          {
            isExporting,
            isImporting,
            isDownloadingSample,
            handleExportCSV,
            csvFile,
            handleFileChange,
            handleRemoveFile,
            handleImportCSV,
            handleDownloadSampleCSV
          }
        ) }),
        /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(
          ReviewTabsSection,
          {
            selectedTab,
            handleTabChange,
            totalReviews,
            reviews,
            pageCount,
            currentPage,
            hasPrevious,
            hasNext,
            handlePageChange,
            productSummaries,
            sortOptions,
            sortOption,
            handleSortChange,
            bundles,
            selectedBundleId,
            setSelectedBundleId,
            selectedProductId,
            setSelectedProductId,
            shopifyProducts,
            getNumericProductId,
            getGidProductId,
            getProductTitleFromNumericId,
            getProductImageFromNumericId
          }
        ) })
      ] })
    ] }),
    toastMarkup
  ] });
}
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: HomePage,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DZDKqP22.js", "imports": ["/assets/index-C2MVcWue.js", "/assets/components-C2Kax0p1.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-CLHAW1CN.js", "imports": ["/assets/index-C2MVcWue.js", "/assets/components-C2Kax0p1.js", "/assets/en-Bqy5T29M.js", "/assets/app.config-WQ-Mt3dF.js", "/assets/AppProvider-Bsut-mA5.js", "/assets/hooks-DVLPNyJj.js", "/assets/context-BTfEV6tP.js", "/assets/Modal-CzgmPlWy.js", "/assets/use-deep-effect-D6mXDaV_.js", "/assets/context-C3QIEavF.js"], "css": ["/assets/styles-C7YjYK5e.css"] }, "routes/webhooks.app.scopes_update": { "id": "routes/webhooks.app.scopes_update", "parentId": "root", "path": "webhooks/app/scopes_update", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/webhooks.app.scopes_update-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/webhooks.app.uninstalled": { "id": "routes/webhooks.app.uninstalled", "parentId": "root", "path": "webhooks/app/uninstalled", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/webhooks.app.uninstalled-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/proxy.$app.reviews": { "id": "routes/proxy.$app.reviews", "parentId": "root", "path": "proxy/:app/reviews", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/proxy._app.reviews-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.productreview": { "id": "routes/api.productreview", "parentId": "root", "path": "api/productreview", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.productreview-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.settings": { "id": "routes/api.settings", "parentId": "root", "path": "api/settings", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.settings-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.reviews": { "id": "routes/api.reviews", "parentId": "root", "path": "api/reviews", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.reviews-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.reviews.export": { "id": "routes/api.reviews.export", "parentId": "routes/api.reviews", "path": "export", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.reviews.export-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/auth.login": { "id": "routes/auth.login", "parentId": "root", "path": "auth/login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-BzalT9Ul.js", "imports": ["/assets/index-C2MVcWue.js", "/assets/styles-B62FO-Tg.js", "/assets/components-C2Kax0p1.js", "/assets/AppProvider-Bsut-mA5.js", "/assets/Page-D05pyoXj.js", "/assets/FormLayout-SOrlQt4I.js", "/assets/hooks-DVLPNyJj.js", "/assets/context-BTfEV6tP.js", "/assets/context-C3QIEavF.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-BMOlIQbq.js", "imports": ["/assets/index-C2MVcWue.js", "/assets/components-C2Kax0p1.js"], "css": ["/assets/route-TqOIn4DE.css"] }, "routes/auth.$": { "id": "routes/auth.$", "parentId": "root", "path": "auth/*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/auth._-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/app": { "id": "routes/app", "parentId": "root", "path": "app", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/app-D0kowvPq.js", "imports": ["/assets/index-C2MVcWue.js", "/assets/en-Bqy5T29M.js", "/assets/components-C2Kax0p1.js", "/assets/AppProvider-Bsut-mA5.js", "/assets/styles-B62FO-Tg.js", "/assets/context-BTfEV6tP.js", "/assets/context-C3QIEavF.js"], "css": [] }, "routes/app.reviews.$id.actions": { "id": "routes/app.reviews.$id.actions", "parentId": "routes/app", "path": "reviews/:id/actions", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.reviews._id.actions-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/app.reviews.$id.status": { "id": "routes/app.reviews.$id.status", "parentId": "routes/app", "path": "reviews/:id/status", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.reviews._id.status-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/app.create-bundle": { "id": "routes/app.create-bundle", "parentId": "routes/app", "path": "create-bundle", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.create-bundle-CEZAsoR_.js", "imports": ["/assets/index-C2MVcWue.js", "/assets/product.helpers-vfyxMMcL.js", "/assets/components-C2Kax0p1.js", "/assets/Page-D05pyoXj.js", "/assets/hooks-DVLPNyJj.js", "/assets/Toast-DBnrqZxP.js", "/assets/Modal-CzgmPlWy.js", "/assets/use-deep-effect-D6mXDaV_.js", "/assets/TitleBar-CSDd_GFP.js", "/assets/banner-context-DY3IUZWM.js", "/assets/context-BTfEV6tP.js", "/assets/context-C3QIEavF.js"], "css": [] }, "routes/app.additional": { "id": "routes/app.additional", "parentId": "routes/app", "path": "additional", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.additional-Bdaz3eqZ.js", "imports": ["/assets/index-C2MVcWue.js", "/assets/Page-D05pyoXj.js", "/assets/TitleBar-CSDd_GFP.js", "/assets/hooks-DVLPNyJj.js", "/assets/Link-CaZ9q6rI.js", "/assets/context-BTfEV6tP.js", "/assets/banner-context-DY3IUZWM.js"], "css": [] }, "routes/app.settings": { "id": "routes/app.settings", "parentId": "routes/app", "path": "settings", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.settings-C1rn8vJY.js", "imports": ["/assets/index-C2MVcWue.js", "/assets/Page-D05pyoXj.js", "/assets/hooks-DVLPNyJj.js", "/assets/context-BTfEV6tP.js", "/assets/use-deep-effect-D6mXDaV_.js", "/assets/Toast-DBnrqZxP.js", "/assets/components-C2Kax0p1.js", "/assets/TitleBar-CSDd_GFP.js"], "css": [] }, "routes/app._index": { "id": "routes/app._index", "parentId": "routes/app", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app._index-D9rUjopr.js", "imports": ["/assets/index-C2MVcWue.js", "/assets/Page-D05pyoXj.js", "/assets/hooks-DVLPNyJj.js", "/assets/use-deep-effect-D6mXDaV_.js", "/assets/components-C2Kax0p1.js", "/assets/product.helpers-vfyxMMcL.js", "/assets/Toast-DBnrqZxP.js", "/assets/Modal-CzgmPlWy.js", "/assets/app.config-WQ-Mt3dF.js", "/assets/context-BTfEV6tP.js", "/assets/FormLayout-SOrlQt4I.js", "/assets/Link-CaZ9q6rI.js", "/assets/TitleBar-CSDd_GFP.js", "/assets/banner-context-DY3IUZWM.js", "/assets/context-C3QIEavF.js"], "css": [] } }, "url": "/assets/manifest-938a4a87.js", "version": "938a4a87" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": true, "v3_singleFetch": false, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/webhooks.app.scopes_update": {
    id: "routes/webhooks.app.scopes_update",
    parentId: "root",
    path: "webhooks/app/scopes_update",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/webhooks.app.uninstalled": {
    id: "routes/webhooks.app.uninstalled",
    parentId: "root",
    path: "webhooks/app/uninstalled",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/proxy.$app.reviews": {
    id: "routes/proxy.$app.reviews",
    parentId: "root",
    path: "proxy/:app/reviews",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/api.productreview": {
    id: "routes/api.productreview",
    parentId: "root",
    path: "api/productreview",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/api.settings": {
    id: "routes/api.settings",
    parentId: "root",
    path: "api/settings",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/api.reviews": {
    id: "routes/api.reviews",
    parentId: "root",
    path: "api/reviews",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/api.reviews.export": {
    id: "routes/api.reviews.export",
    parentId: "routes/api.reviews",
    path: "export",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/auth.login": {
    id: "routes/auth.login",
    parentId: "root",
    path: "auth/login",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route9
  },
  "routes/auth.$": {
    id: "routes/auth.$",
    parentId: "root",
    path: "auth/*",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/app": {
    id: "routes/app",
    parentId: "root",
    path: "app",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/app.reviews.$id.actions": {
    id: "routes/app.reviews.$id.actions",
    parentId: "routes/app",
    path: "reviews/:id/actions",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/app.reviews.$id.status": {
    id: "routes/app.reviews.$id.status",
    parentId: "routes/app",
    path: "reviews/:id/status",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/app.create-bundle": {
    id: "routes/app.create-bundle",
    parentId: "routes/app",
    path: "create-bundle",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/app.additional": {
    id: "routes/app.additional",
    parentId: "routes/app",
    path: "additional",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/app.settings": {
    id: "routes/app.settings",
    parentId: "routes/app",
    path: "settings",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "routes/app._index": {
    id: "routes/app._index",
    parentId: "routes/app",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route17
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
