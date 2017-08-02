import * as actionTypes from '../actions/actionTypes';

const defaultState = {
  currentDocument: null,
  currentRightId: 3,
  documents: []
};

function documentReducers(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.DOCUMENTS_FETCH_REQUEST:
      return Object.assign({}, state, {
        documentsUpdating: true,
        documentsUpdated: false,
        documentSaved: false,
        currentDocumentUpdated: false
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
        currentDocumentUpdated: false
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
    default:
      return state;
  }
}

export default documentReducers;
