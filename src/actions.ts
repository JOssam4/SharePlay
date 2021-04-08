export const SET_AUTHTOKEN = 'SET_AUTHTOKEN';
export const SET_USER_SEARCHED_FOR = 'SET_USER_SEARCHED_FOR';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SHOW_PLAYLISTS = 'SHOW_PLAYLISTS';
export const SET_USE_PLAYLISTS = 'SET_USE_PLAYLISTS';
export const SET_USE_TOP_TRACKS = 'SET_USE_TOP_TRACKS';
export const SET_USE_SAVED_TRACKS = 'SET_USE_SAVED_TRACKS';
export const SET_TOP_TRACKS_TIMEFRAME = 'SET_TOP_TRACKS_TIMEFRAME';

/**
 * @TODO: merge SET_USE_TOP_TRACKS and SET_TOP_TRACKS_TIMEFRAME so they're both set with one function call
 * */

export function setAuthToken(authToken: string) {
  return {
    type: SET_AUTHTOKEN,
    authToken,
  };
}

export function setUserSearchedFor(userSearchedFor: string) {
  return {
    type: SET_USER_SEARCHED_FOR,
    userSearchedFor,
  };
}

export function setCurrentUser(currentUser: string) {
  return {
    type: SET_CURRENT_USER,
    currentUser,
  };
}

export function showPlaylists() {
  return {
    type: SHOW_PLAYLISTS,
    showPlaylists: true,
  };
}

export function setUsePlaylists(usePlaylists: boolean) {
  return {
    type: SET_USE_PLAYLISTS,
    usePlaylists,
  };
}

export function setUseTopTracks(useTopTracks: boolean) {
  return {
    type: SET_USE_TOP_TRACKS,
    useTopTracks,
  };
}

export function setTopTracksTimeframe(topTracksTimeframe: string | null) {
  return {
    type: SET_TOP_TRACKS_TIMEFRAME,
    topTracksTimeframe,
  };
}

export function setUseSavedTracks(useSavedTracks: boolean) {
  return {
    type: SET_USE_SAVED_TRACKS,
    useSavedTracks,
  };
}
