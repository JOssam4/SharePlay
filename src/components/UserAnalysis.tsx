import React, { FC } from 'react';
import PropTypes from 'prop-types';
import AnalysisExtraInfo from './AnalysisExtraInfo';
import '../styles/AnalysisScreen.css';

interface Props {
    user: string
    numPlaylists: number,
    numPlaylistTracks: number,
    numSavedTracks: number,
    numTopTracks: number,
    showsCurrentUser: boolean,
}

const UserAnalysis: FC<Props> = (props) => {
  if (props.showsCurrentUser) {
    return (
      <div className="userAnalysis" id="current">
        <h1>You</h1>
        <AnalysisExtraInfo
          numPlaylists={props.numPlaylists}
          numPlaylistTracks={props.numPlaylistTracks}
          numSavedTracks={props.numSavedTracks}
          numTopTracks={props.numTopTracks}
          isCurrentUser={props.showsCurrentUser}
        />
      </div>
    );
  }
  return (
    <div className="userAnalysis" id="other">
      <h1>{props.user}</h1>
      <AnalysisExtraInfo
        numPlaylists={props.numPlaylists}
        numPlaylistTracks={props.numPlaylistTracks}
        numSavedTracks={props.numSavedTracks}
        numTopTracks={props.numSavedTracks}
        isCurrentUser={props.showsCurrentUser}
      />
    </div>
  );
};

UserAnalysis.propTypes = {
  user: PropTypes.string.isRequired,
  numPlaylists: PropTypes.number.isRequired,
  numPlaylistTracks: PropTypes.number.isRequired,
  numSavedTracks: PropTypes.number.isRequired,
  numTopTracks: PropTypes.number.isRequired,
  showsCurrentUser: PropTypes.bool.isRequired,
};

export default UserAnalysis;
