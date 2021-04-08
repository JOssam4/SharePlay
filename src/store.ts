import { createStore } from 'redux';
import throttle from 'lodash.throttle';
import { composeWithDevTools } from 'redux-devtools-extension';
import appDataReducer from './reducers/AppDataReducer';

import { loadState, saveState } from './localStorage';
import { loadState as loadSessionState, saveState as saveSessionState } from './sessionStorage';
// import throttle from 'lodash.throttle'

const persistedState = { ...loadState(), ...loadSessionState() }; // Load state both from localstorage (stuff that should persist between sessions, like authToken) and sessionStorage (stuff that should reset for new sessions, like settings and userSearchedFor), and combine them into one object.

const store = createStore(appDataReducer, persistedState, composeWithDevTools());

store.subscribe(throttle(() => {
  saveState({
    authToken: store.getState().authToken,
    currentUser: store.getState().currentUser,
  });
  saveSessionState({
    userSearchedFor: store.getState().userSearchedFor,
  });
}, 1000));

export default store;

export type StoreType = ReturnType<typeof store.getState>;
export type DispatchType = typeof store.dispatch;
