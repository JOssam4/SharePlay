import React, { FC } from 'react';
import PropTypes from 'prop-types';
import AnalysisExtraInfoArtist from './AnalysisExtraInfoArtist';
import '../styles/AnalysisScreen.css';

interface Props {
  user: string,
  numPlaylists: number,
  numPlaylistArtists: number,
  numSavedTracksArtists: number,
  numTopTracksArtists: number,
  showsCurrentUser: boolean,
}

const UserArtistAnalysis: FC<Props> = (props) => {
  if (props.showsCurrentUser) {
    return (
      <div className="userAnalysis" id="current">
        <h1>You</h1>
        <AnalysisExtraInfoArtist
          numPlaylists={props.numPlaylists}
          numPlaylistArtists={props.numPlaylistArtists}
          numSavedTracksArtists={props.numSavedTracksArtists}
          numTopTracksArtists={props.numTopTracksArtists}
          isCurrentUser={props.showsCurrentUser}
        />
      </div>
    );
  }
  return (
    <div className="userAnalysis" id="other">
      <h1>{props.user}</h1>
      <AnalysisExtraInfoArtist
        numPlaylists={props.numPlaylists}
        numPlaylistArtists={props.numPlaylistArtists}
        numSavedTracksArtists={props.numSavedTracksArtists}
        numTopTracksArtists={props.numTopTracksArtists}
        isCurrentUser={props.showsCurrentUser}
      />
    </div>
  );
};

UserArtistAnalysis.propTypes = {
  user: PropTypes.string.isRequired,
  numPlaylists: PropTypes.number.isRequired,
  numPlaylistArtists: PropTypes.number.isRequired,
  numSavedTracksArtists: PropTypes.number.isRequired,
  numTopTracksArtists: PropTypes.number.isRequired,
  showsCurrentUser: PropTypes.bool.isRequired,
};

export default UserArtistAnalysis;
