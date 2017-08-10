import * as actionTypes from '../actions/actionTypes';

const defaultState = {
  currentDocument: null,
  currentRightId: 3,
  documents: [],
  currentDocumentUpdated: false,
  currentDocumentModified: false,
  documentsUpdated: false,
  documentSaved: false,
  documentsSearchResult: {},
  documentsSearchResultUpdated: false,
  savingDocument: false,
  currentDocumentModifying: false,
  documentDeleting: false,
  documentDeleted: false,
  currentDocumentErrorMessage: ''
};

function documentReducers(state = defaultState, action) {
  switch (action.type) {
  case actionTypes.DOCUMENTS_FETCH_REQUEST:
    return {
      ...state,
      documentSaved: false,
      currentDocumentUpdated: false,
      documentsUpdated: false,
      documentsSearchResultUpdated: false,
      currentDocumentModified: false,
      documentDeleted: false,
      documentsUpdating: true,
      currentDocumentErrorMessage: ''
    };
  case actionTypes.DOCUMENTS_FETCH_SUCCESSFUL:
    return {
      ...state,
      documents: action.payload,
      documentsType: action.documentsType,
      documentsUpdated: true,
      documentsUpdating: false,
    };
  case actionTypes.DOCUMENTS_FETCH_FAILED:
    return {
      ...state,
      documentsUpdated: false,
      documentsUpdating: false,
      currentDocumentErrorMessage: action.payload
    };
  case actionTypes.DOCUMENT_SAVE_REQUEST:
    return {
      ...state,
      documentsUpdated: false,
      currentDocumentUpdated: false,
      documentsSearchResultUpdated: false,
      currentDocumentModified: false,
      documentDeleted: false,
      documentSaved: false,
      savingDocument: true,
      currentDocumentErrorMessage: ''
    };
  case actionTypes.DOCUMENT_SAVE_SUCCESSFUL:
    return {
      ...state,
      currentDocument: action.payload,
      currentRightId: 1,
      documentSaved: true,
      savingDocument: false,
    };
  case actionTypes.DOCUMENT_SAVE_FAILED:
    return {
      ...state,
      documentSaved: false,
      savingDocument: false,
      currentDocumentErrorMessage: action.payload
    };
  case actionTypes.DOCUMENT_MODIFY_REQUEST:
    return {
      ...state,
      currentDocumentModified: false,
      documentsUpdated: false,
      documentsSearchResultUpdated: false,
      documentSaved: false,
      documentDeleted: false,
      currentDocumentUpdated: false,
      currentDocumentModifying: true,
      currentDocumentErrorMessage: ''
    };
  case actionTypes.DOCUMENT_MODIFY_SUCCESSFUL:
    return {
      ...state,
      currentDocument: action.payload,
      currentDocumentModified: true,
      currentDocumentUpdated: true,
      currentDocumentModifying: false
    };
  case actionTypes.DOCUMENT_MODIFY_FAILED:
    return {
      ...state,
      currentDocumentModified: false,
      currentDocumentModifying: false,
      currentDocumentErrorMessage: action.payload
    };
  case actionTypes.DOCUMENT_GET_REQUEST:
    return {
      ...state,
      documentsUpdated: false,
      documentSaved: false,
      documentsSearchResultUpdated: false,
      currentDocumentModified: false,
      documentDeleted: false,
      currentDocumentUpdated: false,
      currentDocumentUpdating: true,
      currentDocumentErrorMessage: ''
    };
  case actionTypes.DOCUMENT_GET_SUCCESSFUL:
    return {
      ...state,
      currentDocument: action.payload.document,
      currentRightId: action.payload.rightId,
      currentDocumentUpdated: true,
      currentDocumentUpdating: false,
    };
  case actionTypes.DOCUMENT_GET_FAILED:
    return {
      ...state,
      currentDocumentUpdated: false,
      currentDocumentUpdating: false,
      currentDocumentErrorMessage: action.payload
    };
  case actionTypes.DOCUMENT_DELETE_REQUEST:
    return {
      ...state,
      documentsUpdated: false,
      documentSaved: false,
      documentsSearchResultUpdated: false,
      currentDocumentModified: false,
      currentDocumentUpdated: false,
      documentDeleted: false,
      documentDeleting: true,
      currentDocumentErrorMessage: ''
    };
  case actionTypes.DOCUMENT_DELETE_SUCCESSFUL:
    return {
      ...state,
      documentDeleted: true,
      documentDeleting: false,
    };
  case actionTypes.DOCUMENT_DELETE_FAILED:
    return {
      ...state,
      documentDeleted: false,
      documentDeleting: false,
      currentDocumentErrorMessage: action.payload
    };
  case actionTypes.DOCUMENTS_SEARCH_REQUEST:
    return {
      ...state,
      currentDocumentUpdated: false,
      documentsUpdated: false,
      documentSaved: false,
      currentDocumentModified: false,
      documentDeleted: false,
      documentsSearchResultUpdated: false,
      documentsSearchResultUpdating: true,
      currentDocumentErrorMessage: ''
    };
  case actionTypes.DOCUMENTS_SEARCH_SUCCESSFUL:
    return {
      ...state,
      documentsSearchResult: action.payload,
      documentsSearchResultUpdated: true,
      documentsSearchResultUpdating: false,
    };
  case actionTypes.DOCUMENTS_SEARCH_FAILED:
    return {
      ...state,
      documentsSearchResultUpdated: false,
      documentsSearchResultUpdating: false,
      currentDocumentErrorMessage: action.payload
    };
  case actionTypes.DOCUMENT_CANCELLED:
    return {
      ...state,
      currentDocumentUpdated: false,
      documentsUpdated: false,
      documentSaved: false,
      currentDocumentModified: false,
      currentDocumentErrorMessage: ''
    };
  default:
    return state;
  }
}

export default documentReducers;
