import * as actionTypes from '../actions/actionTypes';

const defaultState = {
  isFetching: false,
  isGetting: false,
  createNew: false,
  savingDocument: false,
  currentDocument: null,
  currentRightId: 3,
  documents: []
};

function documentReducers(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.DOCUMENTS_FETCH_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        currentDocument: null,
        currentRightId: 3,
        fetchSuccessful: false,
        documentSaved: false,
        result: action.type
      });
    case actionTypes.DOCUMENTS_FETCH_SUCCESSFUL:
      return Object.assign({}, state, {
        isFetching: false,
        getSuccessful: false,
        fetchSuccessful: true,
        documents: action.payload,
        documentsType: action.documentsType,
        result: action.type
      });
    case actionTypes.DOCUMENTS_FETCH_FAILED:
      return Object.assign({}, state, {
        isFetching: false,
        fetchSuccessful: false,
        result: action.type
      });
    case actionTypes.DOCUMENT_SAVE_REQUEST:
      return Object.assign({}, state, {
        savingDocument: true,
        fetchSuccessful: false,
        documentSaved: false,
        currentDocument: null,
        currentRightId: 3,
        getSuccessful: false,
        result: action.type
      });
    case actionTypes.DOCUMENT_SAVE_SUCCESSFUL:
      return Object.assign({}, state, {
        savingDocument: false,
        documentSaved: true,
        createNew: false,
        result: action.type
      });
    case actionTypes.DOCUMENT_SAVE_FAILED:
      return Object.assign({}, state, {
        savingDocument: false,
        createNew: false,
        documentSaved: false,
        result: action.type
      });
    case actionTypes.DOCUMENT_GET_REQUEST:
      return Object.assign({}, state, {
        documentSaved: false,
        fetchSuccessful: false,
        getSuccessful: false,
        isGetting: true,
        currentDocument: null,
        currentRightId: 3,
        result: action.type
      });
    case actionTypes.DOCUMENT_GET_SUCCESSFUL:
      return Object.assign({}, state, {
        currentDocument: action.payload.document,
        currentRightId: action.payload.rightId,
        getSuccessful: true,
        isGetting: false,
        result: action.type
      });
    case actionTypes.DOCUMENT_GET_FAILED:
      return Object.assign({}, state, {
        isGetting: false,
        getSuccessful: false,
        result: action.type
      });
    case actionTypes.NEW_DOCUMENT:
      return Object.assign({}, state, {
        createNew: true,
        currentDocument: null,
        currentRightId: 3
      });
    case actionTypes.DOCUMENT_CANCELLED:
      return Object.assign({}, state, {
        createNew: false,
        currentDocument: null,
        currentRightId: 3
      });
    default:
      return state;
  }
}

export default documentReducers;
