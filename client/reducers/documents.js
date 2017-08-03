import * as actionTypes from '../actions/actionTypes';

const defaultState = {
  currentDocument: null,
  currentRightId: 3,
  documents: [],
  currentDocumentUpdated: false,
  documentsUpdated: false,
  documentSaved: false,
  documentsSearchResult: {},
  documentsSearchResultUpdated: false
};

function documentReducers(state = defaultState, action) {
  switch (action.type) {
  case actionTypes.DOCUMENTS_FETCH_REQUEST:
    return Object.assign({}, state, {
      documentsUpdating: true,
      documentsUpdated: false,
      documentSaved: false,
      currentDocumentUpdate: false,
      documentsSearchResultUpdated: false
    });
  case actionTypes.DOCUMENTS_FETCH_SUCCESSFUL:
    return Object.assign({}, state, {
      documentsUpdating: false,
      documentsUpdated: true,
      documents: action.payload,
      documentsType: action.documentsType
    });
  case actionTypes.DOCUMENTS_FETCH_FAILED:
    return Object.assign({}, state, {
      documentsUpdating: false,
      documentsUpdated: false
    });
  case actionTypes.DOCUMENT_SAVE_REQUEST:
    return Object.assign({}, state, {
      savingDocument: true,
      documentSaved: false,
      documentsUpdated: false,
      currentDocumentUpdate: false,
      documentsSearchResultUpdated: false
    });
  case actionTypes.DOCUMENT_SAVE_SUCCESSFUL:
    return Object.assign({}, state, {
      savingDocument: false,
      documentSaved: true
    });
  case actionTypes.DOCUMENT_SAVE_FAILED:
    return Object.assign({}, state, {
      savingDocument: false,
      documentSaved: false
    });
  case actionTypes.DOCUMENT_GET_REQUEST:
    return Object.assign({}, state, {
      currentDocumentUpdating: true,
      currentDocumentUpdated: false,
      documentsUpdated: false,
      documentSaved: false,
      documentsSearchResultUpdated: false
    });
  case actionTypes.DOCUMENT_GET_SUCCESSFUL:
    return Object.assign({}, state, {
      currentDocument: action.payload.document,
      currentRightId: action.payload.rightId,
      currentDocumentUpdating: false,
      currentDocumentUpdated: true
    });
  case actionTypes.DOCUMENT_GET_FAILED:
    return Object.assign({}, state, {
      currentDocumentUpdating: false,
      currentDocumentUpdated: false
    });
  case actionTypes.DOCUMENTS_SEARCH_REQUEST:
    return Object.assign({}, state, {
      documentsSearchResultUpdating: true,
      documentsSearchResultUpdated: false,
      currentDocumentUpdated: false,
      documentsUpdated: false,
      documentSaved: false,
    });
  case actionTypes.DOCUMENTS_SEARCH_SUCCESSFUL:
    return Object.assign({}, state, {
      documentsSearchResult: action.payload,
      documentsSearchResultUpdating: false,
      documentsSearchResultUpdated: true,
    });
  case actionTypes.DOCUMENTS_SEARCH_FAILED:
    return Object.assign({}, state, {
      documentsSearchResultUpdating: false,
      documentsSearchResultUpdated: false,
    });
  case actionTypes.DOCUMENT_CANCELLED:
    return Object.assign({}, state, {
      currentDocumentUpdated: false,
      documentsUpdated: false,
      documentSaved: false,
    });
  default:
    return state;
  }
}

export default documentReducers;
