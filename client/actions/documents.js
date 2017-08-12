import axios from 'axios';
import _ from 'lodash';
import * as actionTypes from './actionTypes';
import validator from '../utils/Validator';

const config = {
  headers: { 'Content-Type': 'application/json' }
};

const documentGetRequest = () => ({
  type: actionTypes.DOCUMENT_GET_REQUEST
});

const documentGetSuccessful = payload => ({
  type: actionTypes.DOCUMENT_GET_SUCCESSFUL,
  payload
});

const documentGetFailed = payload => ({
  type: actionTypes.DOCUMENT_GET_FAILED,
  payload
});

const documentDeleteRequest = () => ({
  type: actionTypes.DOCUMENT_DELETE_REQUEST
});

const documentDeleteSuccessful = payload => ({
  type: actionTypes.DOCUMENT_DELETE_SUCCESSFUL,
  payload
});

const documentDeleteFailed = payload => ({
  type: actionTypes.DOCUMENT_DELETE_FAILED,
  payload
});

const documentsFetchRequest = () => ({
  type: actionTypes.DOCUMENTS_FETCH_REQUEST
});

const documentsFetchSuccessful = (payload, type) => ({
  type: actionTypes.DOCUMENTS_FETCH_SUCCESSFUL,
  documentsType: type,
  payload
});

const documentsFetchFailed = payload => ({
  type: actionTypes.DOCUMENTS_FETCH_FAILED,
  payload
});

const documentSaveRequest = () => ({
  type: actionTypes.DOCUMENT_SAVE_REQUEST
});

const documentSaveSuccessful = payload => ({
  type: actionTypes.DOCUMENT_SAVE_SUCCESSFUL,
  payload
});

const documentSaveFailed = payload => ({
  type: actionTypes.DOCUMENT_SAVE_FAILED,
  payload
});

const documentModifyRequest = () => ({
  type: actionTypes.DOCUMENT_MODIFY_REQUEST
});

const documentModifySuccessful = payload => ({
  type: actionTypes.DOCUMENT_MODIFY_SUCCESSFUL,
  payload
});

const documentModifyFailed = payload => ({
  type: actionTypes.DOCUMENT_MODIFY_FAILED,
  payload
});

const documentsSearchRequest = () => ({
  type: actionTypes.DOCUMENTS_SEARCH_REQUEST
});

const documentsSearchSuccessful = payload => ({
  type: actionTypes.DOCUMENTS_SEARCH_SUCCESSFUL,
  payload
});

const documentsSearchFailed = payload => ({
  type: actionTypes.DOCUMENTS_SEARCH_FAILED,
  payload
});

const getErrorMessage = (errors) => {
  const errorMessage = _.reduce(errors, (result, error) => {
    return `${error}<br/>${result}`;
  }, '');
  return errorMessage;
};

export function getDocument(documentId) {
  return (dispatch) => {
    dispatch(documentGetRequest());
    return axios
      .get(`api/v1/documents/${documentId}`)
      .then((response) => {
        dispatch(documentGetSuccessful(response.data));
      })
      .catch((error) => {
        dispatch(documentGetFailed(error.response.data.message));
      });
  };
}

export function deleteDocument(documentId) {
  return (dispatch) => {
    dispatch(documentDeleteRequest());
    return axios
      .delete(`api/v1/documents/${documentId}`)
      .then((response) => {
        dispatch(documentDeleteSuccessful(response.data.message));
      })
      .catch((error) => {
        dispatch(documentDeleteFailed(error.response.data.message));
      });
  };
}

export function fetchDocuments(userId, type) {
  return (dispatch) => {
    dispatch(documentsFetchRequest());
    return axios
      .get('/api/v1/documents', {
        params: {
          userId,
          type
        }
      })
      .then((response) => {
        dispatch(documentsFetchSuccessful(response.data.documents, type));
      })
      .catch((error) => {
        dispatch(documentsFetchFailed(error.response.data.message));
      }
    );
  };
}

export function cancelNewDocument() {
  return dispatch =>
    dispatch({
      type: actionTypes.DOCUMENT_CANCELLED
    });
}

export function saveNewDocument(documentData) {
  const validation = validator.validateNewDocument(documentData);
  return (dispatch) => {
    dispatch(documentSaveRequest());
    if (validation.isValid) {
      dispatch(documentSaveRequest());
      return axios
        .post('api/v1/documents', documentData, config)
        .then((response) => {
          dispatch(documentSaveSuccessful(response.data.document));
        })
        .catch((error) => {
          dispatch(documentSaveFailed(error.response.data.message));
        });
    }
    dispatch(documentSaveFailed(getErrorMessage(validation.errors)));
  };
}

export function modifyDocument(documentId, documentData) {
  const validation = validator.validateDocumentEdit(documentData);
  return (dispatch) => {
    dispatch(documentModifyRequest());
    if (validation.isValid) {
      dispatch(documentModifyRequest());
      return axios
        .put(`api/v1/documents/${documentId}`, documentData, config)
        .then((response) => {
          dispatch(documentModifySuccessful(response.data.document));
        })
        .catch((error) => {
          dispatch(documentModifyFailed(error.response.data.message));
        }
      );
    }
    dispatch(documentModifyFailed(getErrorMessage(validation.errors)));
  };
}

export function searchDocuments(query) {
  return (dispatch) => {
    dispatch(documentsSearchRequest());
    return axios
      .get(`api/v1/search/documents?q=${query}`, config)
      .then((response) => {
        dispatch(documentsSearchSuccessful(response.data));
      })
      .catch((error) => {
        dispatch(documentsSearchFailed(error.response.data.message));
      }
    );
  };
}
