import axios from 'axios';

// const ADD_USER = 'ADD_USER';
// const REMOVE_USER = 'REMOVE_USER';
const DOCUMENT_GET_REQUEST = 'DOCUMENT_GET_REQUEST';
const DOCUMENT_GET_SUCCESSFUL = 'DOCUMENT_GET_SUCCESSFUL';
const DOCUMENT_GET_FAILED = 'DOCUMENT_GET_FAILED';
const DOCUMENT_SAVE_REQUEST = 'DOCUMENT_SAVE_REQUEST';
const DOCUMENT_SAVE_SUCCESSFUL = 'DOCUMENT_SAVE_SUCCESSFUL';
const DOCUMENT_SAVE_FAILED = 'DOCUMENT_SAVE_FAILED';
const DOCUMENTS_FETCH_REQUEST = 'DOCUMENTS_FETCH_REQUEST';
const DOCUMENTS_FETCH_SUCCESSFUL = 'DOCUMENTS_FETCH_SUCCESSFUL';
const DOCUMENTS_FETCH_FAILED = 'DOCUMENTS_FETCH_FAILED';

const config = {
  headers: { 'Content-Type': 'application/json' }
};

const documentGetRequest = () => ({
  type: DOCUMENT_GET_REQUEST
});

const documentGetSuccessful = payload => ({
  type: DOCUMENT_GET_SUCCESSFUL,
  payload
});

const documentGetFailed = payload => ({
  type: DOCUMENT_GET_FAILED,
  payload
});

const documentsFetchRequest = () => ({
  type: DOCUMENTS_FETCH_REQUEST
});

const documentsFetchSuccessful = (payload, type) => ({
  type: DOCUMENTS_FETCH_SUCCESSFUL,
  documentsType: type,
  payload
});

const documentsFetchFailed = payload => ({
  type: DOCUMENTS_FETCH_FAILED,
  payload
});

const documentSaveRequest = () => ({
  type: DOCUMENT_SAVE_REQUEST
});

const documentSaveSuccessful = payload => ({
  type: DOCUMENT_SAVE_SUCCESSFUL,
  payload
});

const documentSaveFailed = payload => ({
  type: DOCUMENT_SAVE_FAILED,
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

export function createNewDocument() {
  return dispatch =>
    dispatch({
      type: 'NEW_DOCUMENT'
    });
}

export function cancelNewDocument() {
  return dispatch =>
    dispatch({
      type: 'DOCUMENT_CANCELLED'
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
