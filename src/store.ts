import { createStore } from 'redux';
import throttle from 'lodash.throttle';
import { composeWithDevTools } from 'redux-devtools-extension';
import appDataReducer, { initialState } from './reducers/AppDataReducer';

import { loadState, saveState } from './localStorage';
import { loadState as loadSessionState, saveState as saveSessionState } from './sessionStorage';
// import throttle from 'lodash.throttle'

const persistedState = { ...loadState(), ...loadSessionState() }; // Load state both from localstorage (stuff that should persist between sessions, like authToken) and sessionStorage (stuff that should reset for new sessions, like settings and userSearchedFor), and combine them into one object.

const persistedWithInitial = { ...initialState, ...persistedState }; // The initial state but with values overwritten by persisted state (like the authToken, currentUser, etc)

// const store = createStore(appDataReducer, persistedState, composeWithDevTools()); // use this line if you want to use localStorage to get the initial state
// const store = createStore(appDataReducer, initialState, composeWithDevTools()); // use this line if you want initial state to be the above value (not taken from localStorage)
const store = createStore(appDataReducer, persistedWithInitial, composeWithDevTools()); // use this line if you want initial state to be a mix of both the predefined initial state and the values currently stored in persistent storage

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
