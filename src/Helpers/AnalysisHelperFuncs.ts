import {
  MinArtistType,
  Playlist,
  PlaylistJSON,
  TrackItems, TracksRespWithAddedTime, TracksRespWithoutAddedTime, TrackType,
} from './SpotifyAPITypes';
import { MinifiedTrackType } from './OtherTypes';

type playlistData = {
  currentUserPlaylistJSON: PlaylistJSON | null,
  otherUserPlaylistJSON: PlaylistJSON,
  currentUserPlaylistIDs: string[],
  otherUserPlaylistIDs: string[],
}

async function getUserPlaylistData(authToken: string, currentUser: string, userSearchedFor: string, usePlaylists: boolean): Promise<playlistData> {
  const otherUserResp = await fetch(`https://api.spotify.com/v1/users/${userSearchedFor}/playlists`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  const otherUserRespjson: PlaylistJSON = await otherUserResp.json();
  const otherUserIDs: string[] = [];
  otherUserRespjson.items.forEach((playlist: Playlist) => {
    otherUserIDs.push(playlist.id);
  });
  if (usePlaylists) {
    const currentUserResp = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const currentUserRespjson: PlaylistJSON = await currentUserResp.json();
    const currentUserIDs: string[] = [];
    currentUserRespjson.items.forEach((playlist: Playlist) => {
      if (playlist.owner.id === currentUser) {
        currentUserIDs.push(playlist.id);
      }
    });
    return {
      currentUserPlaylistJSON: currentUserRespjson,
      otherUserPlaylistJSON: otherUserRespjson,
      currentUserPlaylistIDs: currentUserIDs,
      otherUserPlaylistIDs: otherUserIDs,
    };
  }
  return {
    currentUserPlaylistIDs: [],
    currentUserPlaylistJSON: null,
    otherUserPlaylistJSON: otherUserRespjson,
    otherUserPlaylistIDs: otherUserIDs,
  };
}

function getArtistNameArray(artists: MinArtistType[]) {
  return artists.map((artist: MinArtistType) => artist.name);
}

async function getTopTracks(authToken: string, timeframe: string) {
  const resp = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${timeframe}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  const topTracksObject: TracksRespWithoutAddedTime = await resp.json();
  const trackIDs: MinifiedTrackType[] = [];
  const topTracks = topTracksObject.items;
  topTracks.forEach((track: TrackType) => {
    trackIDs.push({ id: track.id, name: track.name, artists: getArtistNameArray(track.artists) });
  });
  return trackIDs;
}

async function getSavedTracks(authToken: string): Promise<MinifiedTrackType[]> {
  const trackIDs: MinifiedTrackType[] = [];
  let resp = await fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  let respjson: TracksRespWithAddedTime = await resp.json();
  respjson.items.forEach((trackItem: TrackItems) => {
    trackIDs.push({ id: trackItem.track.id, name: trackItem.track.name, artists: getArtistNameArray(trackItem.track.artists) });
  });
  let tracksRemaining = respjson.total - 50; // since we can only get 50 at a time, use this to keep track of how many more we need to get
  let offset = 0;
  while (tracksRemaining > 0) {
    offset += 50;
    // eslint-disable-next-line no-await-in-loop
    resp = await fetch(`https://api.spotify.com/v1/me/tracks?offset=${offset}&limit=50`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    // eslint-disable-next-line no-await-in-loop
    respjson = await resp.json();
    respjson.items.forEach((trackItem: TrackItems) => {
      trackIDs.push({ id: trackItem.track.id, name: trackItem.track.name, artists: getArtistNameArray(trackItem.track.artists) });
    });
    tracksRemaining -= 50;
  }
  // this.setState({ savedTracks: trackIDs });
  return trackIDs;
}

export { getUserPlaylistData, getSavedTracks, getTopTracks };
