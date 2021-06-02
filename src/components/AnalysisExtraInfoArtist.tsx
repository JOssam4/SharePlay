import React from 'react';

interface Props {
  numPlaylists: number,
  numPlaylistArtists: number,
  numSavedTracksArtists: number,
  numTopTracksArtists: number,
  isCurrentUser: boolean,
}

export default function AnalysisExtraInfoArtist(props: Props) {
  let playlistInfo = null;
  let topTracksInfo = null;
  let savedTracksInfo = null;

  if (!props.isCurrentUser) {
    playlistInfo = (
      <h2>
        {props.numPlaylists}
          &thinsp;playlists
      </h2>
    );
    const total = props.numPlaylistArtists;
    return (
      <div className="AnalysisExtraInfo">
        {playlistInfo}
        <h3>
          For a total of&thinsp;
          {total}
          &thinsp;artists
        </h3>
      </div>
    );
  }
  if (props.numTopTracksArtists > 0) {
    topTracksInfo = (
      <h2 key={0}>
        {props.numTopTracksArtists}
        &thinsp;artists in your top tracks
      </h2>
    );
  }
  if (props.numSavedTracksArtists > 0) {
    savedTracksInfo = (
      <h2 key={1}>
        {props.numSavedTracksArtists}
        &thinsp;artists in your saved tracks
      </h2>
    );
  }
  if (props.numPlaylists > 0) {
    playlistInfo = (
      <h2>
        {props.numPlaylists}
        &thinsp;playlists
      </h2>
    );
  }
  const total = (
    <h3 key={2}>
      For a total of&thinsp;
      {props.numPlaylistArtists + props.numTopTracksArtists + props.numSavedTracksArtists}
      &thinsp;artists
    </h3>
  );

  return (
    <div className="AnalysisExtraInfo">
      {playlistInfo}
      {savedTracksInfo}
      {topTracksInfo}
      {total}
    </div>
  );
}
