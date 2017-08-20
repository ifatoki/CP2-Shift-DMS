import axios from 'axios';
import _ from 'lodash';
import ActionTypes from './ActionTypes';
import Validator from '../../server/utils/Validator';

const config = {
  headers: { 'Content-Type': 'application/json' }
};

const DocumentActions = {
  /**
   * @function documentGetRequest
   *
   * @returns {object} Action
   */
  documentGetRequest() {
    return {
      type: ActionTypes.DOCUMENT_GET_REQUEST
    };
  },

  /**
   * @function documentGetSuccessful
   *
   * @param {any} payload
   * @returns {object} Action
   */
  documentGetSuccessful(payload) {
    return {
      type: ActionTypes.DOCUMENT_GET_SUCCESSFUL,
      payload
    };
  },

  /**
   * @function documentGetFailed
   *
   * @param {any} payload
   * @returns {object} Action
   */
  documentGetFailed(payload) {
    return {
      type: ActionTypes.DOCUMENT_GET_FAILED,
      payload
    };
  },

  /**
   * @function documentDeleteRequest
   *
   * @returns {object} Action
   */
  documentDeleteRequest() {
    return {
      type: ActionTypes.DOCUMENT_DELETE_REQUEST
    };
  },

  /**
   * @function documentDeleteSuccessful
   *
   * @param {any} payload
   * @returns {object} Action
   */
  documentDeleteSuccessful(payload) {
    return {
      type: ActionTypes.DOCUMENT_DELETE_SUCCESSFUL,
      payload
    };
  },

  /**
   * @function documentDeleteFailed
   *
   * @param {any} payload
   * @returns {object} Action
   */
  documentDeleteFailed(payload) {
    return {
      type: ActionTypes.DOCUMENT_DELETE_FAILED,
      payload
    };
  },

  /**
   * @function documentsFetchRequest
   *
   * @returns {object} Action
   */
  documentsFetchRequest() {
    return {
      type: ActionTypes.DOCUMENTS_FETCH_REQUEST
    };
  },

  /**
   * @function documentsFetchSuccessful
   *
   * @param {any} payload
   * @param {any} type
   * @returns {object} Action
   */
  documentsFetchSuccessful(payload, type) {
    return {
      type: ActionTypes.DOCUMENTS_FETCH_SUCCESSFUL,
      documentsType: type,
      payload
    };
  },

  /**
   * @function documentsFetchFailed
   *
   * @param {any} payload
   * @returns {object} Action
   */
  documentsFetchFailed(payload) {
    return {
      type: ActionTypes.DOCUMENTS_FETCH_FAILED,
      payload
    };
  },

  /**
   * @function documentSaveRequest
   *
   * @returns {object} Action
   */
  documentSaveRequest() {
    return {
      type: ActionTypes.DOCUMENT_SAVE_REQUEST
    };
  },

  /**
   * @function documentSaveSuccessful
   *
   * @param {any} payload
   * @returns {object} Action
   */
  documentSaveSuccessful(payload) {
    return {
      type: ActionTypes.DOCUMENT_SAVE_SUCCESSFUL,
      payload
    };
  },

  /**
   * @function documentSaveFailed
   *
   * @param {any} payload
   * @returns {object} Action
   */
  documentSaveFailed(payload) {
    return {
      type: ActionTypes.DOCUMENT_SAVE_FAILED,
      payload
    };
  },

  /**
   * @function documentModifyRequest
   *
   * @returns {object} Action
   */
  documentModifyRequest() {
    return {
      type: ActionTypes.DOCUMENT_MODIFY_REQUEST
    };
  },

  /**
   * @function documentModifySuccessful
   *
   * @param {any} payload
   * @returns {object} Action
   */
  documentModifySuccessful(payload) {
    return {
      type: ActionTypes.DOCUMENT_MODIFY_SUCCESSFUL,
      payload
    };
  },

  /**
   * @function documentModifyFailed
   *
   * @param {any} payload
   * @returns {object} Action
   */
  documentModifyFailed(payload) {
    return {
      type: ActionTypes.DOCUMENT_MODIFY_FAILED,
      payload
    };
  },

  /**
   * @function documentsSearchRequest
   *
   * @returns {object} Action
   */
  documentsSearchRequest() {
    return {
      type: ActionTypes.DOCUMENTS_SEARCH_REQUEST
    };
  },

  /**
   * @function documentsSearchSuccessful
   *
   * @param {any} payload
   * @returns {object} Action
   */
  documentsSearchSuccessful(payload) {
    return {
      type: ActionTypes.DOCUMENTS_SEARCH_SUCCESSFUL,
      payload
    };
  },

  /**
   * @function documentsSearchFailed
   *
   * @param {any} payload
   * @returns {object} Action
   */
  documentsSearchFailed(payload) {
    return {
      type: ActionTypes.DOCUMENTS_SEARCH_FAILED,
      payload
    };
  },

  /**
   * Returns error messages formatted as html
   * @function getErrorMessage
   *
   * @param {any} errors
   * @returns {string} Error message
   */
  getErrorMessage(errors) {
    return _.reduce(errors, (result, error) =>
      `${error}<br/>${result}`
    , '');
  },

  /**
   * @function cancelNewDocument
   *
   * @returns {object} Action
   */
  cancelNewDocument() {
    return dispatch =>
      dispatch({
        type: ActionTypes.DOCUMENT_CANCELLED
      });
  },

  /**
   * Dispatches actions associated with getting documents
   * @function getDocument
   *
   * @param {any} documentId
   * @returns {object} Action
   */
  getDocument(documentId) {
    return (dispatch) => {
      dispatch(DocumentActions.documentGetRequest());
      return axios
        .get(`api/v1/documents/${documentId}`)
        .then((response) => {
          dispatch(DocumentActions.documentGetSuccessful(response.data));
        })
        .catch((error) => {
          dispatch(DocumentActions
            .documentGetFailed(error.response.data.message));
        });
    };
  },

  /**
   * Dispatch actions associated with deleting documents
   * @function deleteDocument
   *
   * @param {any} documentId
   * @returns {object} Action
   */
  deleteDocument(documentId) {
    return (dispatch) => {
      dispatch(DocumentActions.documentDeleteRequest());
      return axios
        .delete(`api/v1/documents/${documentId}`)
        .then((response) => {
          dispatch(DocumentActions
            .documentDeleteSuccessful(response.data.message));
        })
        .catch((error) => {
          dispatch(DocumentActions
            .documentDeleteFailed(error.response.data.message));
        });
    };
  },

  /**
   * Dispatches actions associated with fetchDocuments
   * @function fetchDocuments
   *
   * @param {any} userId
   * @param {any} type
   * @returns {object} Action
   */
  fetchDocuments(userId, type) {
    return (dispatch) => {
      dispatch(DocumentActions.documentsFetchRequest());
      return axios
        .get('/api/v1/documents', {
          params: {
            userId,
            type
          }
        })
        .then((response) => {
          dispatch(DocumentActions.documentsFetchSuccessful(
            response.data.documents, type
          ));
        })
        .catch((error) => {
          dispatch(DocumentActions
            .documentsFetchFailed(error.response.data.message));
        }
      );
    };
  },

  /**
   * Dispatches actions associated with saving new documents
   * @function saveNewDocument
   *
   * @param {any} documentData
   * @returns {object} Action
   */
  saveNewDocument(documentData) {
    const validation = Validator.validateNewDocument(documentData);
    return (dispatch) => {
      dispatch(DocumentActions.documentSaveRequest());
      if (validation.isValid) {
        return axios
          .post('api/v1/documents', documentData, config)
          .then((response) => {
            dispatch(DocumentActions
              .documentSaveSuccessful(response.data.document));
          })
          .catch((error) => {
            dispatch(DocumentActions
              .documentSaveFailed(error.response.data.message));
          });
      }
      dispatch(DocumentActions.documentSaveFailed(
        DocumentActions.getErrorMessage(validation.errors)
      ));
    };
  },

  /**
   * Dispatches actions associated with modifying documents
   * @function modifyDocument
   *
   * @param {any} documentId
   * @param {any} documentData
   * @returns {object} Action
   */
  modifyDocument(documentId, documentData) {
    const validation = Validator.validateDocumentEdit(documentData);
    return (dispatch) => {
      dispatch(DocumentActions.documentModifyRequest());
      if (validation.isValid) {
        return axios
          .put(`api/v1/documents/${documentId}`, documentData, config)
          .then((response) => {
            dispatch(DocumentActions
              .documentModifySuccessful(response.data.document));
          })
          .catch((error) => {
            dispatch(DocumentActions
              .documentModifyFailed(error.response.data.message));
          }
        );
      }
      dispatch(DocumentActions.documentModifyFailed(
        DocumentActions.getErrorMessage(validation.errors)
      ));
    };
  },

  /**
   * Dispatches actions associated with searching through documents
   * @function searchDocuments
   *
   * @param {any} query
   * @returns {object} Action
   */
  searchDocuments(query) {
    return (dispatch) => {
      dispatch(DocumentActions.documentsSearchRequest());
      return axios
        .get(`api/v1/search/documents?q=${query}`, config)
        .then((response) => {
          dispatch(DocumentActions.documentsSearchSuccessful(response.data));
        })
        .catch((error) => {
          dispatch(DocumentActions
            .documentsSearchFailed(error.response.data.message));
        }
      );
    };
  }
};

export default DocumentActions;
