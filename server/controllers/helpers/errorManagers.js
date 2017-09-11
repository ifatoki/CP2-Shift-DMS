import errors from '../helpers/errors';

const {
  genericErrors,
  documentErrors,
} = errors;

const errorManagers = {
  handleErrors(error, res) {
    let status;
    let message = '';

    switch (parseInt(error.message, 10)) {
    case genericErrors.INVALID_ID:
      status = 400;
      message = 'id must be an integer';
      break;
    case documentErrors.DOCUMENT_UNAUTHORIZED_ACCESS:
      status = 401;
      message = 'you are not authorized to access this document';
      break;
    case documentErrors.DOCUMENT_NOT_FOUND:
      status = 404;
      message = 'document not found';
      break;
    case documentErrors.DOCUMENT_DUPLICATE_TITLE:
      status = 409;
      message = 'a document with that title already exists';
      break;
    case genericErrors.SERVER_ERROR:
    default:
      status = 500;
      message = 'oops, we just encountered an error. please try again';
      break;
    }
    res.status(status).send({ message });
  },

  throwError(errorMessage) {
    throw new Error(errorMessage);
  }
};

export default errorManagers;
