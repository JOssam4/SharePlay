import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import { connect } from 'react-redux';

import { Card, Button } from 'react-bootstrap';
import { MapTrackValue } from '../Helpers/OtherTypes';
import { MinArtistType } from '../Helpers/SpotifyAPITypes';

import '../styles/AnalysisScreen.css';

interface Props {
    playlistGenerator: Function,
    sharedTracks: Map<string, MapTrackValue>,
}

interface State {
    playlistGenerated: boolean,
    sharedTracks: Map<string, MapTrackValue>,
}

export default class SharedDataView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sharedTracks: this.props.sharedTracks,
      playlistGenerated: false,
    };
  }

  showSharedTracks() {
    // eslint-disable-next-line no-undef
    const cards: JSX.Element[] = [];
    let counter = 0; // for the keys
    this.state.sharedTracks.forEach((mapTrack) => {
      const artists = mapTrack.artists.map((artist: MinArtistType) => artist.name).join(', ');
      cards.push(
        <Card key={counter} className="trackCard">
          <Card.Body>
            {mapTrack.name}
            &thinsp;-&thinsp;
            {artists}
          </Card.Body>
        </Card>,
      );
      counter += 1;
    });
    return cards;
  }

  render() {
    if (this.state.playlistGenerated) {
      return (
        <div className="sharedDataWrapper">
          {this.showSharedTracks()}
          <Button variant="primary" size="lg" type="button" id="generate-button" disabled>Playlist generated!</Button>
        </div>
      );
    }
    return (
      <div className="sharedDataWrapper">
        {this.showSharedTracks()}
        <Button variant="primary" size="lg" type="button" id="generate-button" onClick={() => { this.setState({ playlistGenerated: true }); this.props.playlistGenerator(); }} disabled={this.state.playlistGenerated}>Generate Playlist and add it to my account</Button>
      </div>
    );
  }
}

// @ts-ignore
SharedDataView.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  sharedTracks: PropTypes.object.isRequired,
  // eslint-disable-next-line react/require-default-props
  playlistGenerator: PropTypes.func,
};
