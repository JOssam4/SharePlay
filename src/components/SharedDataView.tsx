import React, { Component } from 'react';
import PropTypes from 'prop-types';

//import { connect } from 'react-redux';

import { Card, Button } from 'react-bootstrap';

interface Props {
    playlistGenerator: Function,
    sharedTracks: Map<string, string>,
};

interface State {
    playlistGenerated: boolean,
    sharedTracks: Map<string, string>,
}

export default class SharedDataView extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            sharedTracks: this.props.sharedTracks,
            playlistGenerated: false
        }
    }

    showSharedTracks() {
        let cards: JSX.Element[] = [];
        let counter = 0; // for the keys
        this.state.sharedTracks.forEach(trackName => {
            cards.push(
                <Card key={counter}>
                    <Card.Body>{trackName}</Card.Body>
                </Card>
            );
            ++counter;
        });
        return cards;
    }

    render() {
        if (this.state.playlistGenerated) {
            return (
                <div className="sharedDataWrapper">
                    {this.showSharedTracks()}
                    <Button variant="primary" size="lg" type="button" disabled>Playlist generated!</Button>
                </div>
            );
        }
        return (
            <div className="sharedDataWrapper">
                {this.showSharedTracks()}
                <Button variant="primary" size="lg" type="button" onClick={() => {this.setState({playlistGenerated: true}); this.props.playlistGenerator()}} disabled={this.state.playlistGenerated}>Generate Playlist and add it to my account</Button>
            </div>
        );
    }
}

// @ts-ignore
SharedDataView.propTypes = {
    sharedTracks: PropTypes.object.isRequired,
    playlistGenerator: PropTypes.func,
}