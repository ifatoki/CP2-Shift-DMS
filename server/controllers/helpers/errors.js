const errors = {
  documentErrors: {
    DOCUMENT_NOT_FOUND: 201,
    DOCUMENT_DUPLICATE_TITLE: 202,
    DOCUMENT_UNAUTHORIZED_ACCESS: 203
  },

  userErrors: {
    USER_INVALID_ID: 301,
    USER_NOT_FOUND: 302,
  },

  genericErrors: {
    SERVER_ERROR: 101,
    VALIDATION_ERROR: 102,
    INVALID_ID: 103,
  }
};

export default errors;
