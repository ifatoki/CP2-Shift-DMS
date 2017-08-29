import axios from 'axios';
import lodash from 'lodash';
import actionTypes from './actionTypes';
import Validator from '../../server/utils/Validator';

const config = {
  headers: { 'Content-Type': 'application/json' }
};

const documentActions = {
  /**
   * @function documentGetRequest
   *
   * @returns {Object} Action
   */
  documentGetRequest() {
    return {
      type: actionTypes.DOCUMENT_GET_REQUEST
    };
  },

  /**
   * Dispatches a DOCUMENT_GET_SUCCESSFUL action
   * @function documentGetSuccessful
   *
   * @param {Object} payload - Action payload
   * @returns {Object} Action
   */
  documentGetSuccessful(payload) {
    return {
      type: actionTypes.DOCUMENT_GET_SUCCESSFUL,
      payload
    };
  },

  /**
   * Dispatches a DOCUMENT_GET_FAILED action
   * @function documentGetFailed
   *
   * @param {string} payload - Error Message
   * @returns {Object} Action
   */
  documentGetFailed(payload) {
    return {
      type: actionTypes.DOCUMENT_GET_FAILED,
      payload
    };
  },

  /**
   * Dispatches a DOCUMENT_DELETE_REQUEST action
   * @function documentDeleteRequest
   *
   * @returns {Object} Action
   */
  documentDeleteRequest() {
    return {
      type: actionTypes.DOCUMENT_DELETE_REQUEST
    };
  },

  /**
   * Dispatches a DOCUMENT_DELETE_SUCCESSFUL action
   * @function documentDeleteSuccessful
   *
   * @param {Object} payload - Action payload
   * @returns {Object} Action
   */
  documentDeleteSuccessful(payload) {
    return {
      type: actionTypes.DOCUMENT_DELETE_SUCCESSFUL,
      payload
    };
  },

  /**
   * Dispatches a DOCUMENT_DELETE_FAILED action
   * @function documentDeleteFailed
   *
   * @param {string} payload - Error Message
   * @returns {Object} Action
   */
  documentDeleteFailed(payload) {
    return {
      type: actionTypes.DOCUMENT_DELETE_FAILED,
      payload
    };
  },

  /**
   * Dispatches a DOCUMENTS_FETCH_REQUEST action
   * @function documentsFetchRequest
   *
   * @returns {Object} Action
   */
  documentsFetchRequest() {
    return {
      type: actionTypes.DOCUMENTS_FETCH_REQUEST
    };
  },

  /**
   * Dispatches a DOCUMENTS_FETCH_SUCCESSFUL action
   * @function documentsFetchSuccessful
   *
   * @param {Object} payload - Action payload
   * @param {string} type
   * @returns {Object} Action
   */
  documentsFetchSuccessful(payload, type) {
    return {
      type: actionTypes.DOCUMENTS_FETCH_SUCCESSFUL,
      documentsType: type,
      payload
    };
  },

  /**
   * Dispatches a DOCUMENTS_FETCH_FAILED action
   * @function documentsFetchFailed
   *
   * @param {Object} payload - Action payload
   * @returns {Object} Action
   */
  documentsFetchFailed(payload) {
    return {
      type: actionTypes.DOCUMENTS_FETCH_FAILED,
      payload
    };
  },

  /**
   * Dispatches a DOCUMENT_SAVE_REQUEST action
   * @function documentSaveRequest
   *
   * @returns {Object} Action
   */
  documentSaveRequest() {
    return {
      type: actionTypes.DOCUMENT_SAVE_REQUEST
    };
  },

  /**
   * Dispatches a DOCUMENT_SAVE_SUCCESSFUL action
   * @function documentSaveSuccessful
   *
   * @param {Object} payload - Action payload
   * @returns {Object} Action
   */
  documentSaveSuccessful(payload) {
    return {
      type: actionTypes.DOCUMENT_SAVE_SUCCESSFUL,
      payload
    };
  },

  /**
   * Dispatches a DOCUMENT_SAVE_FAILED action
   * @function documentSaveFailed
   *
   * @param {string} payload - Error Message
   * @returns {Object} Action
   */
  documentSaveFailed(payload) {
    return {
      type: actionTypes.DOCUMENT_SAVE_FAILED,
      payload
    };
  },

  /**
   * Dispatches a DOCUMENT_MODIFY_REQUEST action
   * @function documentModifyRequest
   *
   * @returns {Object} Action
   */
  documentModifyRequest() {
    return {
      type: actionTypes.DOCUMENT_MODIFY_REQUEST
    };
  },

  /**
   * Dispatches a DOCUMENT_MODIFY_SUCCESSFUL action
   * @function documentModifySuccessful
   *
   * @param {Object} payload - Action payload
   * @returns {Object} Action
   */
  documentModifySuccessful(payload) {
    return {
      type: actionTypes.DOCUMENT_MODIFY_SUCCESSFUL,
      payload
    };
  },

  /**
   * Dispatches a DOCUMENT_MODIFY_FAILED action
   * @function documentModifyFailed
   *
   * @param {string} payload - Error Message
   * @returns {Object} Action
   */
  documentModifyFailed(payload) {
    return {
      type: actionTypes.DOCUMENT_MODIFY_FAILED,
      payload
    };
  },

  /**
   * Dispatches a DOCUMENTS_SEARCH_REQUEST action
   * @function documentsSearchRequest
   *
   * @returns {Object} Action
   */
  documentsSearchRequest() {
    return {
      type: actionTypes.DOCUMENTS_SEARCH_REQUEST
    };
  },

  /**
   * Dispatches a DOCUMENTS_SEARCH_SUCCESSFUL action
   * @function documentsSearchSuccessful
   *
   * @param {Object} payload - Action payload
   * @returns {Object} Action
   */
  documentsSearchSuccessful(payload) {
    return {
      type: actionTypes.DOCUMENTS_SEARCH_SUCCESSFUL,
      payload
    };
  },

  /**
   * Dispatches a DOCUMENT_SEARCH_FAILED action
   * @function documentsSearchFailed
   *
   * @param {string} payload - Error Message
   * @returns {Object} Action
   */
  documentsSearchFailed(payload) {
    return {
      type: actionTypes.DOCUMENTS_SEARCH_FAILED,
      payload
    };
  },

  /**
   * Returns error messages formatted as html
   * @function getErrorMessage
   *
   * @param {Object} errors - Errors Object containing validation errors
   * @returns {string} Error message
   */
  getErrorMessage(errors) {
    return lodash.reduce(errors, (result, error) =>
      `${error}<br/>${result}`
    , '');
  },

  /**
   * Dispatches a DOCUMENT_CANCELLED action
   * @function cancelNewDocument
   *
   * @returns {Object} Action
   */
  cancelNewDocument() {
    return dispatch =>
      dispatch({
        type: actionTypes.DOCUMENT_CANCELLED
      });
  },

  /**
   * Dispatches actions associated with getting documents
   * @function getDocument
   *
   * @param {number} documentId - Required documents Id
   * @returns {Object} Action
   */
  getDocument(documentId) {
    return (dispatch) => {
      dispatch(documentActions.documentGetRequest());
      return axios
        .get(`api/v1/documents/${documentId}`)
        .then((response) => {
          dispatch(documentActions.documentGetSuccessful(response.data));
        })
        .catch((error) => {
          dispatch(documentActions
            .documentGetFailed(error.response.data.message));
        });
    };
  },

  /**
   * Dispatch actions associated with deleting documents
   * @function deleteDocument
   *
   * @param {number} documentId - Required Documents Id
   * @returns {Object} Action
   */
  deleteDocument(documentId) {
    return (dispatch) => {
      dispatch(documentActions.documentDeleteRequest());
      return axios
        .delete(`api/v1/documents/${documentId}`)
        .then((response) => {
          dispatch(documentActions
            .documentDeleteSuccessful(response.data.message));
        })
        .catch((error) => {
          dispatch(documentActions
            .documentDeleteFailed(error.response.data.message));
        });
    };
  },

  /**
   * Dispatches actions associated with fetchDocuments
   * @function fetchDocuments
   *
   * @param {string} type - Type of documents to be fetched
   * @param {number} offset - Number of documents to be offset in result
   * @returns {Object} Action
   */
  fetchDocuments(type, offset) {
    return (dispatch) => {
      dispatch(documentActions.documentsFetchRequest());
      return axios
        .get('/api/v1/documents', {
          params: {
            type,
            offset,
            limit: 9
          }
        })
        .then((response) => {
          dispatch(documentActions.documentsFetchSuccessful(
            response.data, type
          ));
        })
        .catch((error) => {
          dispatch(documentActions
            .documentsFetchFailed(error.response.data.message));
        }
      );
    };
  },

  /**
   * Dispatches actions associated with saving new documents
   * @function saveNewDocument
   *
   * @param {Object} documentData - Data to be used to create document
   * @returns {Object} Action
   */
  saveNewDocument(documentData) {
    const validation = Validator.validateNewDocument(documentData);
    return (dispatch) => {
      dispatch(documentActions.documentSaveRequest());
      if (validation.isValid) {
        return axios
          .post('api/v1/documents', documentData, config)
          .then((response) => {
            dispatch(documentActions
              .documentSaveSuccessful(response.data.document));
          })
          .catch((error) => {
            dispatch(documentActions
              .documentSaveFailed(error.response.data.message));
          });
      }
      dispatch(documentActions.documentSaveFailed(
        documentActions.getErrorMessage(validation.errors)
      ));
    };
  },

  /**
   * Dispatches actions associated with modifying documents
   * @function modifyDocument
   *
   * @param {number} documentId - Id of document to be modified
   * @param {Object} documentData - document data to be updated
   * @returns {Object} Action
   */
  modifyDocument(documentId, documentData) {
    const validation = Validator.validateDocumentEdit(documentData);
    return (dispatch) => {
      dispatch(documentActions.documentModifyRequest());
      if (validation.isValid) {
        return axios
          .put(`api/v1/documents/${documentId}`, documentData, config)
          .then((response) => {
            dispatch(documentActions
              .documentModifySuccessful(response.data.document));
          })
          .catch((error) => {
            dispatch(documentActions
              .documentModifyFailed(error.response.data.message));
          }
        );
      }
      dispatch(documentActions.documentModifyFailed(
        documentActions.getErrorMessage(validation.errors)
      ));
    };
  },

  /**
   * Dispatches actions associated with searching through documents
   * @function searchDocuments
   *
   * @param {string} query - Search string
   * @returns {Object} Action
   */
  searchDocuments(query) {
    return (dispatch) => {
      dispatch(documentActions.documentsSearchRequest());
      return axios
        .get(`api/v1/search/documents?q=${query}`, config)
        .then((response) => {
          dispatch(documentActions.documentsSearchSuccessful(response.data));
        })
        .catch((error) => {
          dispatch(documentActions
            .documentsSearchFailed(error.response.data.message));
        }
      );
    };
  }
};

export default documentActions;
