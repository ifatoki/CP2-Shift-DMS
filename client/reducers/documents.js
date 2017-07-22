const defaultState = {
  isFetching: false,
  isGetting: false,
  createNew: false,
  savingDocument: false,
  currentDocument: null,
  documents: []
};

function documentReducers(state = defaultState, action) {
  switch (action.type) {
    case 'DOCUMENTS_FETCH_REQUEST':
      return Object.assign({}, state, {
        isFetching: true,
        currentDocument: null,
        fetchSuccessful: false,
        documentSaved: false,
        result: action.type
      });
    case 'DOCUMENTS_FETCH_SUCCESSFUL':
      return Object.assign({}, state, {
        isFetching: false,
        getSuccessful: false,
        fetchSuccessful: true,
        documents: action.payload,
        documentsType: action.documentsType,
        result: action.type
      });
    case 'DOCUMENTS_FETCH_FAILED':
      return Object.assign({}, state, {
        isFetching: false,
        fetchSuccessful: false,
        result: action.type
      });
    case 'DOCUMENT_SAVE_REQUEST':
      return Object.assign({}, state, {
        savingDocument: true,
        fetchSuccessful: false,
        documentSaved: false,
        currentDocument: null,
        getSuccessful: false,
        result: action.type
      });
    case 'DOCUMENT_SAVE_SUCCESSFUL':
      return Object.assign({}, state, {
        savingDocument: false,
        documentSaved: true,
        createNew: false,
        result: action.type
      });
    case 'DOCUMENT_SAVE_FAILED':
      return Object.assign({}, state, {
        savingDocument: false,
        createNew: false,
        documentSaved: false,
        result: action.type
      });
    case 'DOCUMENT_GET_REQUEST':
      return Object.assign({}, state, {
        documentSaved: false,
        fetchSuccessful: false,
        getSuccessful: false,
        isGetting: true,
        currentDocument: null,
        result: action.type
      });
    case 'DOCUMENT_GET_SUCCESSFUL':
      return Object.assign({}, state, {
        currentDocument: action.payload,
        getSuccessful: true,
        isGetting: false,
        result: action.type
      });
    case 'DOCUMENT_GET_FAILED':
      return Object.assign({}, state, {
        isGetting: false,
        getSuccessful: false,
        result: action.type
      });
    case 'NEW_DOCUMENT':
      return Object.assign({}, state, {
        createNew: true,
        currentDocument: null
      });
    case 'DOCUMENT_CANCELLED':
      return Object.assign({}, state, {
        createNew: false,
        currentDocument: null
      });
    default:
      return state;
  }
}

export default documentReducers;
