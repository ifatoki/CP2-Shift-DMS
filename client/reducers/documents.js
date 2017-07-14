function documentReducers(state = { documents: [], isfetching: false }, action) {
  switch (action.type) {
    case 'DOCUMENTS_FETCH_REQUEST':
      return Object.assign({}, state, {
        isfetching: true
      });
    case 'DOCUMENTS_FETCH_SUCCESSFUL':
      return Object.assign({}, state, {
        isfetching: false,
        documents: action.payload
      });
    default:
      return state;
  }
}

export default documentReducers;
