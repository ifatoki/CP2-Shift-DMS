import axios from 'axios';

// const ADD_USER = 'ADD_USER';
// const REMOVE_USER = 'REMOVE_USER';
// const SIGNUP_REQUEST = 'SIGNUP_REQUEST';
// const SIGNUP_SUCCESSFUL = 'SIGNUP_SUCCESSFUL';
// const SIGNUP_FAILED = 'SIGNUP_FAILED';
const DOCUMENT_CREATE_REQUEST = 'DOCUMENT_CREATEREQUEST';
const DOCUMENT_CREATE_SUCCESSFUL = 'DOCUMENT_CREATESUCCESSFUL';
const DOCUMENT_CREATE_FAILED = 'DOCUMENT_CREATEFAILED';
const DOCUMENTS_FETCH_REQUEST = 'DOCUMENTS_FETCH_REQUEST';
const DOCUMENTS_FETCH_SUCCESSFUL = 'DOCUMENTS_FETCH_SUCCESSFUL';
const DOCUMENTS_FETCH_FAILED = 'DOCUMENTS_FETCH_FAILED';

const config = {
  headers: { 'Content-Type': 'application/json' }
};

const documentsFetchRequest = () => ({
  type: DOCUMENTS_FETCH_REQUEST
});

const documentsFetchSuccessful = payload => ({
  type: DOCUMENTS_FETCH_SUCCESSFUL,
  payload
});

const documentsFetchFailed = () => ({
  type: DOCUMENTS_FETCH_FAILED
});

const documentCreateRequest = () => ({
  type: DOCUMENT_CREATE_REQUEST
});

const documentCreateSuccessful = payload => ({
  type: DOCUMENT_CREATE_SUCCESSFUL,
  payload
});

const documentCreateFailed = () => ({
  type: DOCUMENT_CREATE_FAILED
});

export function fetchDocuments(userId) {
  return (dispatch) => {
    dispatch(documentsFetchRequest());
    return axios
      .get(`/api/v1/users/${userId}/documents`, config)
      .then((response) => {
        dispatch(documentsFetchSuccessful(response.data));
      })
      .catch((error) => {
        dispatch(documentsFetchFailed(error.message));
      }
    );
  };
}

export function createNewDocument(documentData) {
  return (dispatch) => {
    dispatch(documentCreateRequest());
    return axios
      .post('api/v1/documents', documentData, config)
      .then((response) => {
        dispatch(documentCreateSuccessful(response.data));
      })
      .catch((error) => {
        dispatch(documentCreateFailed(error.message));
      }
    );
  };
}
