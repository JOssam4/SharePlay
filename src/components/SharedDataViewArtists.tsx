import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Card, Button, Accordion } from 'react-bootstrap';
import { MapArtistValue } from '../Helpers/OtherTypes';

import '../styles/AnalysisScreen.css';

interface Props {
  playlistGenerator: Function,
  sharedArtists: Map<string, MapArtistValue[]>,
}

interface State {
  playlistGenerated: boolean,
  sharedArtists: Map<string, MapArtistValue[]>,
}

export default class SharedDataViewArtists extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sharedArtists: this.props.sharedArtists,
      playlistGenerated: false,
    };
  }

  countNumTracks() {
    let counter = 0;
    this.state.sharedArtists.forEach((mapTracks) => {
      counter += mapTracks.length;
    });
    return counter;
  }

  showSharedArtists() {
    // eslint-disable-next-line no-undef
    const cards: JSX.Element[] = [];
    let counter = 0; // for the keys
    const numTracks = this.countNumTracks();
    cards.push(
      <h3>
        Number of tracks:
        &thinsp;
        {numTracks}
      </h3>,
    );
    this.state.sharedArtists.forEach((mapTracks, artistName) => {
      // eslint-disable-next-line no-undef
      const artistTrackCards: JSX.Element[] = [];
      mapTracks.forEach((trackObj: MapArtistValue) => {
        artistTrackCards.push(
          <Card key={counter} className="trackCard">
            <Card.Body>
              {trackObj.name}
              &thinsp;-&thinsp;
              {artistName}
            </Card.Body>
          </Card>,
        );
        counter += 1;
      });
      cards.push(
        <Accordion>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey={counter.toString()}>
                {artistName}
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey={counter.toString()}>
              <Card.Body>{artistTrackCards}</Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>,
      );
    });
    return cards;
  }

  render() {
    if (this.state.playlistGenerated) {
      return (
        <div className="sharedDataWrapper">
          {this.showSharedArtists()}
          <Button variant="primary" size="lg" type="button" id="generate-button" disabled>Playlist generated!</Button>
        </div>
      );
    }
    return (
      <div className="sharedDataWrapper">
        {this.showSharedArtists()}
        <Button variant="primary" size="lg" type="button" id="generate-button" onClick={() => { this.setState({ playlistGenerated: true }); this.props.playlistGenerator(); }} disabled={this.state.playlistGenerated}>Generated Playlist and add it to my account</Button>
      </div>
    );
  }
}

// @ts-ignore
SharedDataViewArtists.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  sharedArtists: PropTypes.object.isRequired,
  // eslint-disable-next-line react/require-default-props
  playlistGenerator: PropTypes.func,
};
