import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
// import { createLogger } from 'redux-logger';  // Remove logger
import rootReducer from '../reducers';

// const loggerMiddleware = createLogger();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
      // loggerMiddleware
    )
  )
);
