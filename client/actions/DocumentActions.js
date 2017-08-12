import axios from 'axios';
import _ from 'lodash';
import ActionTypes from './ActionTypes';
import Validator from '../utils/Validator';

const config = {
  headers: { 'Content-Type': 'application/json' }
};

const DocumentActions = {
  documentGetRequest() {
    return {
      type: ActionTypes.DOCUMENT_GET_REQUEST
    };
  },

  documentGetSuccessful(payload) {
    return {
      type: ActionTypes.DOCUMENT_GET_SUCCESSFUL,
      payload
    };
  },

  documentGetFailed(payload) {
    return {
      type: ActionTypes.DOCUMENT_GET_FAILED,
      payload
    };
  },

  documentDeleteRequest() {
    return {
      type: ActionTypes.DOCUMENT_DELETE_REQUEST
    };
  },

  documentDeleteSuccessful(payload) {
    return {
      type: ActionTypes.DOCUMENT_DELETE_SUCCESSFUL,
      payload
    };
  },

  documentDeleteFailed(payload) {
    return {
      type: ActionTypes.DOCUMENT_DELETE_FAILED,
      payload
    };
  },

  documentsFetchRequest() {
    return {
      type: ActionTypes.DOCUMENTS_FETCH_REQUEST
    };
  },

  documentsFetchSuccessful(payload, type) {
    return {
      type: ActionTypes.DOCUMENTS_FETCH_SUCCESSFUL,
      documentsType: type,
      payload
    };
  },

  documentsFetchFailed(payload) {
    return {
      type: ActionTypes.DOCUMENTS_FETCH_FAILED,
      payload
    };
  },

  documentSaveRequest() {
    return {
      type: ActionTypes.DOCUMENT_SAVE_REQUEST
    };
  },

  documentSaveSuccessful(payload) {
    return {
      type: ActionTypes.DOCUMENT_SAVE_SUCCESSFUL,
      payload
    };
  },

  documentSaveFailed(payload) {
    return {
      type: ActionTypes.DOCUMENT_SAVE_FAILED,
      payload
    };
  },

  documentModifyRequest() {
    return {
      type: ActionTypes.DOCUMENT_MODIFY_REQUEST
    };
  },

  documentModifySuccessful(payload) {
    return {
      type: ActionTypes.DOCUMENT_MODIFY_SUCCESSFUL,
      payload
    };
  },

  documentModifyFailed(payload) {
    return {
      type: ActionTypes.DOCUMENT_MODIFY_FAILED,
      payload
    };
  },

  documentsSearchRequest() {
    return {
      type: ActionTypes.DOCUMENTS_SEARCH_REQUEST
    };
  },

  documentsSearchSuccessful(payload) {
    return {
      type: ActionTypes.DOCUMENTS_SEARCH_SUCCESSFUL,
      payload
    };
  },

  documentsSearchFailed(payload) {
    return {
      type: ActionTypes.DOCUMENTS_SEARCH_FAILED,
      payload
    };
  },

  getErrorMessage(errors) {
    return _.reduce(errors, (result, error) => {
      return `${error}<br/>${result}`;
    }, '');
  },

  cancelNewDocument() {
    return dispatch =>
      dispatch({
        type: ActionTypes.DOCUMENT_CANCELLED
      });
  },

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

  saveNewDocument(documentData) {
    const validation = Validator.validateNewDocument(documentData);
    return (dispatch) => {
      dispatch(DocumentActions.documentSaveRequest());
      if (validation.isValid) {
        dispatch(DocumentActions.documentSaveRequest());
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

  modifyDocument(documentId, documentData) {
    const validation = Validator.validateDocumentEdit(documentData);
    return (dispatch) => {
      dispatch(DocumentActions.documentModifyRequest());
      if (validation.isValid) {
        dispatch(DocumentActions.documentModifyRequest());
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
