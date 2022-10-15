import {
  applyMiddleware,
  compose,
  legacy_createStore as createStore
} from 'redux';
import thunk from 'redux-thunk';
// import logger from 'redux-logger';
import rootReducer from './rootReducer';

export type RootState = ReturnType<typeof rootReducer>;

const middleWares = [thunk /*logger*/];
const composedEnhancers = compose(applyMiddleware(...middleWares));

export default createStore(rootReducer, undefined, composedEnhancers);
