function documentReducers(state = { authored: [], isFetching: false }, action) {
  switch (action.type) {
    case 'DOCUMENTS_FETCH_REQUEST':
      return Object.assign({}, state, {
        isFetching: true
      });
    case 'DOCUMENTS_FETCH_SUCCESSFUL':
      return Object.assign({}, state, {
        isFetching: false,
        authored: action.payload
      });
    default:
      return state;
  }
}

export default documentReducers;
