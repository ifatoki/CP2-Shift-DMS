const defaultState = {
  isFetching: false,
  isGetting: false,
  creatingDocument: false,
  currentDocument: null,
  documents: []
};

function documentReducers(state = defaultState, action) {
  switch (action.type) {
    case 'DOCUMENTS_FETCH_REQUEST':
      return Object.assign({}, state, {
        isFetching: true,
        fetchSuccessful: false,
        documentCreated: false,
        result: action.type
      });
    case 'DOCUMENTS_FETCH_SUCCESSFUL':
      return Object.assign({}, state, {
        isFetching: false,
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
    case 'DOCUMENT_CREATE_REQUEST':
      return Object.assign({}, state, {
        creatingDocument: true,
        fetchSuccessful: false,
        documentCreated: false,
        currentDocument: null,
        getSuccessful: false,
        result: action.type
      });
    case 'DOCUMENT_CREATE_SUCCESSFUL':
      return Object.assign({}, state, {
        creatingDocument: false,
        documentCreated: true,
        result: action.type
      });
    case 'DOCUMENT_CREATE_FAILED':
      return Object.assign({}, state, {
        creatingDocument: false,
        documentCreated: false,
        result: action.type
      });
    case 'DOCUMENT_GET_REQUEST':
      return Object.assign({}, state, {
        documentCreated: false,
        fetchSuccessful: false,
        isGetting: true,
        currentDocument: null,
        result: action.type
      });
    case 'DOCUMENT_GET_SUCCESSFUL':
      return Object.assign({}, state, {
        currentDocument: action.payload,
        isGetting: false,
        getSuccessful: true,
        result: action.type
      });
    case 'DOCUMENT_GET_FAILED':
      return Object.assign({}, state, {
        isGetting: false,
        getSuccessful: false,
        result: action.type
      });
    default:
      return state;
  }
}

export default documentReducers;
