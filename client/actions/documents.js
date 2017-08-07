import axios from 'axios';
import * as actionTypes from './actionTypes';

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

export function getDocument(documentId) {
  return (dispatch) => {
    dispatch(documentGetRequest());
    return axios
      .get(`api/v1/documents/${documentId}`)
      .then((response) => {
        dispatch(documentGetSuccessful(response.data));
      })
      .catch((error) => {
        dispatch(documentGetFailed(error.message));
      });
  };
}

export function deleteDocument(documentId) {
  return (dispatch) => {
    dispatch(documentDeleteRequest());
    return axios
      .delete(`api/v1/documents/${documentId}`)
      .then((response) => {
        dispatch(documentDeleteSuccessful(response.data));
      })
      .catch((error) => {
        dispatch(documentDeleteFailed(error.message));
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
        dispatch(documentsFetchSuccessful(response.data, type));
      })
      .catch((error) => {
        dispatch(documentsFetchFailed(error.message));
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
  return (dispatch) => {
    dispatch(documentSaveRequest());
    return axios
      .post('api/v1/documents', documentData, config)
      .then((response) => {
        dispatch(documentSaveSuccessful(response.data));
      })
      .catch((error) => {
        dispatch(documentSaveFailed(error.message));
      }
    );
  };
}

export function modifyDocument(documentId, documentData) {
  return (dispatch) => {
    dispatch(documentModifyRequest());
    return axios
      .put(`api/v1/documents/${documentId}`, documentData, config)
      .then((response) => {
        dispatch(documentModifySuccessful(response.data));
      })
      .catch((error) => {
        dispatch(documentModifyFailed(error.message));
      }
    );
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
        dispatch(documentsSearchFailed(error.message));
      }
    );
  };
}
