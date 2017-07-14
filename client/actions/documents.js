import axios from 'axios';
import store from '../client';

// const ADD_USER = 'ADD_USER';
// const REMOVE_USER = 'REMOVE_USER';
// const SIGNUP_REQUEST = 'SIGNUP_REQUEST';
// const SIGNUP_SUCCESSFUL = 'SIGNUP_SUCCESSFUL';
// const SIGNUP_FAILED = 'SIGNUP_FAILED';
// const LOGIN_REQUEST = 'LOGIN_REQUEST';
// const LOGIN_SUCCESSFUL = 'LOGIN_SUCCESSFUL';
// const LOGIN_FAILED = 'LOGIN_FAILED';
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

export const documentsFetchFailed = () => ({
  type: DOCUMENTS_FETCH_FAILED
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
