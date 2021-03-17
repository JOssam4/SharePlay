import { SET_AUTHTOKEN, SET_CURRENT_USER, SET_USER_SEARCHED_FOR, SHOW_PLAYLISTS, SET_USE_PLAYLISTS, SET_USE_TOP_TRACKS } from '../actions';

function appDataReducer(state={authToken: null, currentUser: null, showPlaylists: false, userSearchedFor: null}, action: any) {
    switch(action.type) {
        case SET_AUTHTOKEN:
            return Object.assign({}, state, {
                authToken: action.authToken,
            });
        case SET_CURRENT_USER:
            return Object.assign({}, state, {
                currentUser: action.currentUser,
            });
        case SET_USER_SEARCHED_FOR:
            return Object.assign({}, state, {
                userSearchedFor: action.userSearchedFor,
            });
        case SHOW_PLAYLISTS:
            return Object.assign({}, state, {
                showPlaylists: true,
            });
        case SET_USE_PLAYLISTS:
            return Object.assign({}, state, {
                usePlaylists: action.usePlaylists,
            });
        case SET_USE_TOP_TRACKS:
            return Object.assign({}, state, {
                useTopTracks: action.useTopTracks,
            });
        default:
            return state;
    }
}

export default appDataReducer;