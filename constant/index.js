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

module.exports = { RESPONSE_STATUS, RESPONSE_MESSAGE };
