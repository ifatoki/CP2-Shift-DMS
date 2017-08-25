import { combineReducers } from 'redux';
import user from '../reducers/users';
import documents from '../reducers/documents';

const index = combineReducers({
  user,
  documents
});

export default index;

