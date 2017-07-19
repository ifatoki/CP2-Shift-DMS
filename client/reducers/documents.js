const defaultState = {
  isFetching: false,
  creatingDocument: false,
  documents: []
};

function documentReducers(state = defaultState, action) {
  switch (action.type) {
    case 'DOCUMENTS_FETCH_REQUEST':
      return Object.assign({}, state, {
        isFetching: true,
        documentCreated: false,
        result: action.type
      });
    case 'DOCUMENTS_FETCH_SUCCESSFUL':
      return Object.assign({}, state, {
        isFetching: false,
        fetchSuccessful: true,
        documents: action.payload,
        documentType: action.documentType,
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
    default:
      return state;
  }
}

export default documentReducers;
