/**
 * This component is meant to be called by AnalysisScreen. It will find the common tracks between the users, and display them. It will also generate a playlist consisting of those tracks.
 * The goal of this component is to trim down AnalysisScreen.
 * */

import React, { Component } from 'react';
import {Button} from "react-bootstrap";
import SharedDataView from "./SharedDataView";
import PropTypes from 'prop-types';

interface Props {
    authToken: string,
    currentUser: string,
    currentUserPlaylistIDs: string[],
    otherUserPlaylistIDs: string[],
    topTracks: {id: string, name: string}[],
    userSearchedFor: string,
}

interface State {
    currentUserTrackMap: Map<string, string>
    finishedComparing: boolean,
    sharedPlaylist: any,
    sharedTracks: Map<string, string>
}


class CommonTracksHandler extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            currentUserTrackMap: new Map(),
            sharedTracks: new Map(),
            sharedPlaylist: null,
            finishedComparing: false,
        };
        this.loadTrackData = this.loadTrackData.bind(this);
        this.compareTracks = this.compareTracks.bind(this);
        this.createPlaylist = this.createPlaylist.bind(this);
        this.loadAndCompare = this.loadAndCompare.bind(this);
    }

    loadTrackData() {
        let currentUserTracks = new Map();
        if (this.props.topTracks) {
            this.props.topTracks.forEach(track => {
                currentUserTracks.set(track.id, track.name);
            });
        }
        if (this.props.currentUserPlaylistIDs.length > 0) {
            this.props.currentUserPlaylistIDs.forEach(playlistID => {
                fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks?fields=items(track.id,track.name)`, {
                    headers: {
                        "Authorization": `Bearer ${this.props.authToken}`,
                    }
                }).then(resp => {
                    resp.json().then(respjson => {
                        console.dir(respjson);
                        // @ts-ignore
                        respjson.items.forEach(trackObj => {
                            if (trackObj.track && trackObj.track.id && trackObj.track.name) {
                                currentUserTracks.set(trackObj.track.id, trackObj.track.name);
                            }
                            else {
                                console.dir(trackObj);
                            }
                        });
                        console.dir(currentUserTracks);
                        console.log(`currentUserTracks size: ${currentUserTracks.size}`);
                        this.setState({currentUserTrackMap: currentUserTracks}); // This will cause the state to update as many times as there are playlists, but at least it works. This code severely needs an async/await.
                    })
                })
            });
        }
        else {
            // Current user playlist data not read.
            console.log("hi");
            //TODO: make it so that if I'm only using my top tracks data then the other user's playlist data is made into a map to increase efficiency.
            this.setState({currentUserTrackMap: currentUserTracks});
        }
    }

    compareTracks() {
        let sharedTracks = new Map();
        if (this.state.currentUserTrackMap) {
            this.props.otherUserPlaylistIDs.forEach(playlistID => {
                fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks?fields=items(track.id,track.name)`, {
                    headers: {
                        "Authorization": `Bearer ${this.props.authToken}`,
                    }
                }).then(resp => {
                    resp.json().then(respjson => {
                        // @ts-ignore
                        respjson.items.forEach(trackObj => {
                            if (trackObj.track && trackObj.track.id) {
                                if (this.state.currentUserTrackMap.has(trackObj.track.id)) {
                                    sharedTracks.set(trackObj.track.id, trackObj.track.name);
                                }
                            }
                        });
                        console.dir(sharedTracks);
                        this.setState({sharedTracks: sharedTracks, finishedComparing: true});
                    })
                })
            })
        }
    }


    createPlaylist() {
        fetch(`https://api.spotify.com/v1/users/${this.props.currentUser}/playlists`, {method: 'post', headers: {"Authorization": `Bearer ${this.props.authToken}`}, body: JSON.stringify({
                "name": `${this.props.userSearchedFor} and me`,
                "description": `Shared playlist with ${this.props.userSearchedFor}`,
                "public": false
            })}).then(resp => {
            resp.json().then(respjson => {
                this.fillPlaylist(respjson.id);
            })
        }).catch(err => {
            console.error(err);
            return null;
        });
    }

    fillPlaylist(sharedPlaylistID: string) {
        if (sharedPlaylistID) {
            let uris: string[] = [];
            this.state.sharedTracks.forEach((songName, id) => {
                uris.push(`spotify:track:${id}`);
            });
            fetch(`https://api.spotify.com/v1/playlists/${sharedPlaylistID}/tracks?uris=${uris}`, {method: 'post', headers: {"Authorization": `Bearer ${this.props.authToken}`}}).then(resp => {
                this.setState({sharedPlaylist: sharedPlaylistID});
            }).catch(err => {
                return false;
            })
        }
        else {
            return false;
        }
    }

    loadAndCompare() {
        this.loadTrackData();
        this.compareTracks();
    }

    render() {
        if (this.state.finishedComparing && this.state.sharedTracks.size === 0) {
            return (
                <div>
                    <Button disabled>Compare Tracks</Button>
            <h3>Sorry, no shared tracks found.</h3>
            </div>
        );
        }
        return (
            <div>
                <Button onClick={this.loadAndCompare}>Compare Tracks</Button>
        {this.state.sharedTracks.size > 0 &&
        <SharedDataView sharedTracks={this.state.sharedTracks} playlistGenerator={this.createPlaylist}/>
        }
        </div>
    );
    }
}


// @ts-ignore
CommonTracksHandler.propTypes = {
    currentUser: PropTypes.string.isRequired,
    userSearchedFor: PropTypes.string.isRequired,
    topTracks: PropTypes.arrayOf(PropTypes.shape({id: PropTypes.string, name: PropTypes.string})).isRequired,
    currentUserPlaylistIDs: PropTypes.arrayOf(PropTypes.string).isRequired,
    otherUserPlaylistIDs: PropTypes.arrayOf(PropTypes.string).isRequired,
    authToken: PropTypes.string.isRequired,
}

export default CommonTracksHandler;