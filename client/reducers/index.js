import { combineReducers } from 'redux';
import userReducers from '../reducers/users';
import documentReducers from '../reducers/documents';

const appReducer = combineReducers({
  user: userReducers,
  documents: documentReducers
});

// const appReducer = userReducers;
export default appReducer;

