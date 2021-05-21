import React from 'react';

interface Props {
    numPlaylists: number,
    numPlaylistTracks: number,
    numSavedTracks: number,
    numTopTracks: number,
    isCurrentUser: boolean,
}

export default function AnalysisExtraInfo(props: Props) {
  let playlistInfo = null;
  let topTracksInfo = null;
  let savedTracksInfo = null;

  if (!props.isCurrentUser) {
    playlistInfo = (
      <h2>
        {props.numPlaylists}
              &nbsp;playlists
      </h2>
    );
    const total = props.numPlaylistTracks;
    return (
      <div className="AnalysisExtraInfo">
        {playlistInfo}
        <h3>
          For a total of&nbsp;
          {total}
          &nbsp;tracks
        </h3>
      </div>
    );
  }

  if (props.numTopTracks > 0) {
    topTracksInfo = (
      <h2 key={0}>
        {props.numTopTracks}
        &nbsp;top tracks
      </h2>
    );
  }
  if (props.numSavedTracks > 0) {
    savedTracksInfo = (
      <h2 key={1}>
        {props.numSavedTracks}
        &nbsp;saved tracks
      </h2>
    );
  }
  if (props.numPlaylists > 0) {
    playlistInfo = (
      <h2>
        {props.numPlaylists}
        &nbsp;playlists
      </h2>
    );
  }
  const total = (
    <h3 key={2}>
      For a total of&nbsp;
      {props.numPlaylistTracks + props.numTopTracks + props.numSavedTracks}
      &nbsp;tracks
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
