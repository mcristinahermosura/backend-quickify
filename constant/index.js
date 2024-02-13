const RESPONSE_STATUS = {
  SUCCESS: "success",
  ERROR: "error",
  FAILED: "failed",
};

const RESPONSE_MESSAGE = {
  PRODUCT_CREATED_SUCCESS: "Product created successfully!",
  PRODUCT_CREATE_FAILED:
    "Failed to create the product. Please try again later.",
  PRODUCT_UPDATED_SUCCESS: "Product updated successfully!",
  PRODUCT_UPDATE_FAILED:
    "Failed to update the product. Please try again later.",
  PRODUCT_STATUS_UPDATED_SUCCESS: "Product status updated successfully!",
  PRODUCT_STATUS_UPDATE_FAILED:
    "Failed to update the product status. Please try again later.",
  ERROR_OCCURRED:
    "An error occurred during the process. Please try again later.",
};

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/bmp": "bmp",
  "image/webp": "webp",
};

module.exports = { RESPONSE_STATUS, RESPONSE_MESSAGE, MIME_TYPES };
