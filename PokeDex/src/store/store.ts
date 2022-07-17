import { applyMiddleware, legacy_createStore as createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './root-reducer';

export type RootState = ReturnType<typeof rootReducer>;

export default createStore(rootReducer, applyMiddleware(thunk));
