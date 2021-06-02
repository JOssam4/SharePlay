export const SET_AUTHTOKEN = 'SET_AUTHTOKEN';
export const SET_USER_SEARCHED_FOR = 'SET_USER_SEARCHED_FOR';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SHOW_PLAYLISTS = 'SHOW_PLAYLISTS';
export const SET_USE_PLAYLISTS = 'SET_USE_PLAYLISTS';
export const SET_USE_TOP_TRACKS = 'SET_USE_TOP_TRACKS';
export const SET_USE_SAVED_TRACKS = 'SET_USE_SAVED_TRACKS';
export const SET_MODE = 'SET_MODE';
export const TRACK_MODE = 'TRACK_MODE';
export const ARTIST_MODE = 'ARTIST_MODE';

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

export function setUseTopTracks(useTopTracks: boolean, topTracksTimeframe: string | null = null) {
  return {
    type: SET_USE_TOP_TRACKS,
    useTopTracks,
    topTracksTimeframe,
  };
}

export function setUseSavedTracks(useSavedTracks: boolean) {
  return {
    type: SET_USE_SAVED_TRACKS,
    useSavedTracks,
  };
}

export function setMode(mode: string) {
  return {
    type: SET_MODE,
    mode,
  };
}
