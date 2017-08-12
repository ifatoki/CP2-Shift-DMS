import { combineReducers } from 'redux';
import user from '../reducers/users';
import documents from '../reducers/documents';

const appReducer = combineReducers({
  user,
  documents
});

// const appReducer = userReducers;
export default appReducer;

