import {
  SET_AUTHTOKEN, SET_CURRENT_USER, SET_USER_SEARCHED_FOR, SHOW_PLAYLISTS, SET_USE_PLAYLISTS, SET_USE_TOP_TRACKS, SET_USE_SAVED_TRACKS, SET_TOP_TRACKS_TIMEFRAME,
} from '../actions';

function appDataReducer(state = {
  authToken: null, currentUser: null, showPlaylists: false, userSearchedFor: null, usePlaylists: true, useTopTracks: true, topTracksTimeframe: 'short_term', useSavedTracks: false,
}, action: any) {
  switch (action.type) {
    case SET_AUTHTOKEN:
      return { ...state, authToken: action.authToken };
    case SET_CURRENT_USER:
      return { ...state, currentUser: action.currentUser };
    case SET_USER_SEARCHED_FOR:
      return { ...state, userSearchedFor: action.userSearchedFor };
    case SHOW_PLAYLISTS:
      return { ...state, showPlaylists: true };
    case SET_USE_PLAYLISTS:
      return { ...state, usePlaylists: action.usePlaylists };
    case SET_USE_TOP_TRACKS:
      return { ...state, useTopTracks: action.useTopTracks };
    case SET_USE_SAVED_TRACKS:
      return { ...state, useSavedTracks: action.useSavedTracks };
    case SET_TOP_TRACKS_TIMEFRAME:
      return { ...state, topTracksTimeframe: action.topTracksTimeframe };
    default:
      return state;
  }
}

export default appDataReducer;
