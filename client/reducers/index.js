import { combineReducers } from 'redux';
import userReducers from '../reducers/user';

// const appReducer = combineReducers({
//   userReducers
// });

const appReducer = userReducers;
export default appReducer;

