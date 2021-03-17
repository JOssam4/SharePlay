/*
* The analysis part of this project needs to be thought out in a way that saves the most space and time.
* I'm thinking that, since the searched user probably has fewer playlists publicly available,
* their tracks' id's should be stored in a hashmap, and then the much larger logged in user's data will be compared to that hashmap.
* */


import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavigationBar from "../components/NavigationBar";
import type { Person, Playlist, PlaylistJSON } from "../SpotifyAPITypes";

import SharedDataView from '../components/SharedDataView';
import CommonTracksHandler from "../components/CommonTracksHandler";

import { Button, Jumbotron } from 'react-bootstrap';

import { RouteComponentProps } from "react-router-dom";

interface Props {
    authToken: string,
    currentUser: string,
    dispatch: Function,
    history: RouteComponentProps['history'],
    location: RouteComponentProps['location'],
    match: RouteComponentProps['match'],
    staticContext: any,
    userSearchedFor: string,
}

interface State {
    currentUser: string,
    currentUserPlaylistIDs: string[],
    currentUserPlaylistJSON: PlaylistJSON | null,
    currentUserTrackMap: Map<string, number>,
    otherUserPlaylistIDs: string[],
    otherUserPlaylistJSON: PlaylistJSON | null, // I'll fill this in later,
    savedTracks: any,
    sharedPlaylist: any,
    sharedTracks: Map<string, string>,
    topTracks: any,
    usePlaylists: boolean,
    useSavedTracks: boolean,
    useTopTracks: any,
    userSearchedFor: string,

}


class AnalysisScreen extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        let usePlaylists: string | null = sessionStorage.getItem("usePlaylists");
        let usePlaylistsBool: boolean;
        if (usePlaylists === "true") {
            usePlaylistsBool = true;
        }
        else if (usePlaylists === "false") { // sessionStorage.setItem("...", false) set the value to "false", which is truthy.
            usePlaylistsBool = false;
        }
        else {
            console.log("In analysisScreen, bad value for usePlaylists: "+usePlaylists);
            usePlaylistsBool = false;
        }
        let useTopTracks: string | boolean | null = sessionStorage.getItem("useTopTracks");
        if (useTopTracks === "false") {
            useTopTracks = false;
        }

        let useSavedTracks: string | null = sessionStorage.getItem("useSavedTracks");
        let useSavedTracksBool: boolean;
        if (useSavedTracks === "true") {
            useSavedTracksBool = true;
        }
        else if (useSavedTracks === "false") {
            useSavedTracksBool = false;
        }
        else {
            console.log("In analysisScreen, bad value for useSavedTracks: "+useSavedTracks);
            useSavedTracksBool = false;
        }

        this.state = {
            currentUser: this.props.currentUser,
            userSearchedFor: this.props.userSearchedFor,
            currentUserPlaylistJSON: null,
            otherUserPlaylistJSON: null,

            currentUserPlaylistIDs: [],
            otherUserPlaylistIDs: [],

            currentUserTrackMap: new Map(),
            sharedTracks: new Map(),

            //usePlaylists: this.props.usePlaylists,
            usePlaylists: usePlaylistsBool,
            //useTopTracks: this.props.useTopTracks,
            useTopTracks: useTopTracks,

            useSavedTracks: useSavedTracksBool,

            topTracks: [],

            savedTracks: [],

            sharedPlaylist: null,
        }
    }


    getTotalTracks(user: string) {
        let totalTracks = 0;
        if (user === this.state.currentUser) {
            this.state.currentUserPlaylistJSON?.items.forEach(playlist => {
                totalTracks += playlist.tracks.total;
            });
        }
        else {
            this.state.otherUserPlaylistJSON?.items.forEach(playlist => {
                totalTracks += playlist.tracks.total;
            });
        }
        return totalTracks;
    }


    getTopTracks() {
        if (this.state.useTopTracks) {
            fetch(`https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${this.state.useTopTracks}`, {
                headers: {
                    "Authorization": `Bearer ${this.props.authToken}`
                }
            }).then(resp => {
                resp.json().then(topTracksObject => {
                    let trackIds: {id: number, name: string}[] = [];
                    const topTracks = topTracksObject.items;
                    // @ts-ignore
                    topTracks.forEach(track => {
                        trackIds.push({id: track.id, name: track.name});
                    });
                    this.setState({topTracks: trackIds});
                });
            });
        }
    }

    getSavedTracks() {
        if (this.state.useSavedTracks) {
            fetch("https://api.spotify.com/v1/me/tracks", {
                headers: {
                    Authorization: `Bearer ${this.props.authToken}`
                }
            })
                .then(resp => resp.json())
                .then(savedTracksObject => {
                    const savedTracks = savedTracksObject.items;
                    let trackIds: {id: number, name: string}[] = [];
                    // @ts-ignore
                    savedTracks.forEach(track => {
                        trackIds.push({id: track.id, name: track.name});
                    });
                    this.setState({savedTracks: trackIds});
                });
        }
    }

    getUserPlaylistData() {
        if (this.state.currentUser && this.state.userSearchedFor && this.state.usePlaylists) {
            fetch(`https://api.spotify.com/v1/me/playlists?limit=50`, {
                headers: {
                    "Authorization": `Bearer ${this.props.authToken}`
                }
            }).then(currentUserResp => {
                currentUserResp.json().then(currentUserRespjson => {
                    fetch(`https://api.spotify.com/v1/users/${this.state.userSearchedFor}/playlists`, {
                        headers: {
                            "Authorization": `Bearer ${this.props.authToken}`
                        }
                    }).then(otherUserResp => {
                        otherUserResp.json().then(otherUserRespjson => {
                            let currentUserIDs: string[] = [];
                            let otherUserIDs: string[] = [];
                            console.log(`currentUserRespjson: ${currentUserRespjson}`);
                            currentUserRespjson.items.forEach((playlist: Playlist) => {
                                if (playlist.owner.id === this.state.currentUser) {
                                    currentUserIDs.push(playlist.id);
                                }
                            });
                            otherUserRespjson.items.forEach((playlist: Playlist) => {
                                otherUserIDs.push(playlist.id);
                            });
                            this.setState({
                                currentUserPlaylistJSON: currentUserRespjson,
                                otherUserPlaylistJSON: otherUserRespjson,
                                currentUserPlaylistIDs: currentUserIDs,
                                otherUserPlaylistIDs: otherUserIDs,
                            });
                        })
                    });
                })
            });
        }
        else {
            // Don't get my playlist data
            fetch(`https://api.spotify.com/v1/users/${this.state.userSearchedFor}/playlists`, {
                headers: {
                    "Authorization": `Bearer ${this.props.authToken}`
                }
            }).then(otherUserResp => {
                otherUserResp.json().then(otherUserRespjson => {
                    let otherUserIDs: string[] = [];
                    otherUserRespjson.items.forEach((playlist: Playlist) => {
                        otherUserIDs.push(playlist.id);
                    });
                    this.setState({
                        otherUserPlaylistJSON: otherUserRespjson,
                        otherUserPlaylistIDs: otherUserIDs,
                    });
                })
            });
        }
    }

    componentDidMount() {
        if (this.state.currentUser && this.state.userSearchedFor) {
            this.getUserPlaylistData();
            if (this.state.useTopTracks) {
                this.getTopTracks();
            }
            if (this.state.useSavedTracks) {
                this.getSavedTracks();
            }
        }
    }

    // Gonna go for a kind of split-screen look here. Current user on left, searched user on right.
    render() {
        if (this.state.currentUserPlaylistJSON && this.state.otherUserPlaylistIDs.length > 0) {
            let extraInfo;
            if (this.state.useTopTracks) {
                if (this.state.useSavedTracks) {
                    extraInfo = [<h2 key={0}>{this.state.topTracks.length} top tracks</h2>, <h2 key={1}>{this.state.savedTracks.length} saved tracks</h2>, <h3 key={2}>For a total of {this.getTotalTracks(this.state.currentUser) + this.state.topTracks.length + this.state.savedTracks.length} tracks</h3>];
                }
                else {
                    extraInfo = [<h2>{this.state.topTracks.length} top tracks</h2>, <h3>For a total of {this.getTotalTracks(this.state.currentUser) + this.state.topTracks.length} tracks</h3>];
                }
            }
            else {
                if (this.state.useSavedTracks) {
                    extraInfo = [<h2 key={1}>{this.state.savedTracks.length} saved tracks</h2>, <h3 key={2}>For a total of {this.getTotalTracks(this.state.currentUser) + this.state.savedTracks.length} tracks</h3>];
                }
                else {
                    extraInfo = <h3>For a total of {this.getTotalTracks(this.state.currentUser)} tracks</h3>
                }
            }

            return (
                <div className="analysisScreenWrapper">
                    <NavigationBar activeScreen='analysis'/>
                    <Jumbotron>
                        <h1>Welcome to the Analysis Screen {this.state.currentUser}!</h1>
                        <h2>You have searched for {this.state.userSearchedFor}</h2>
                        <h4>You can use the options in your <a href='/me'>homepage</a> to narrow/broaden your results</h4>
                    </Jumbotron>
                    <div className="userComparisonWrapper">
                        <div className="currentUserAnalysis">
                            <h1>{this.state.currentUser}</h1>
                            <h2>{this.state.currentUserPlaylistJSON.total} playlists</h2>
                            {extraInfo}

                        </div>
                        <div className="otherUserAnalysis">
                            <h1>{this.state.userSearchedFor}</h1>
                            <h2>{this.state.otherUserPlaylistJSON?.total} playlists</h2>
                            <h3>For a total of {this.getTotalTracks(this.state.userSearchedFor)} total tracks</h3>
                        </div>
                    </div>
                    <CommonTracksHandler currentUser={this.state.currentUser} userSearchedFor={this.state.userSearchedFor} topTracks={this.state.topTracks} currentUserPlaylistIDs={this.state.currentUserPlaylistIDs} otherUserPlaylistIDs={this.state.otherUserPlaylistIDs} authToken={this.props.authToken}/>
                </div>
            );
        }

        else if (this.state.currentUser && this.state.otherUserPlaylistJSON) {
            // Only use my top tracks and saved tracks, not my playlists
            let extraInfo;
            if (this.state.useTopTracks) {
                if (this.state.useSavedTracks) {
                    extraInfo = [<h2 key={0}>{this.state.topTracks.length} top tracks</h2>, <h2 key={1}>{this.state.savedTracks.length} saved tracks</h2>, <h3>For a total of {this.state.topTracks.length + this.state.savedTracks.length} tracks</h3>];
                }
                else {
                    extraInfo = [<h2>{this.state.topTracks.length} top tracks</h2>, <h3>For a total of {this.state.topTracks.length} tracks</h3>];
                }
            }
            else {
                if (this.state.useSavedTracks) {
                    extraInfo = [<h2 key={1}>{this.state.savedTracks.length} saved tracks</h2>, <h3 key={2}>For a total of {this.state.savedTracks.length} tracks</h3>];
                }
                else {
                    extraInfo = <h3>For a total of 0 tracks</h3>
                }
            }
            return (
                <div className="analysisScreenWrapper">
                    <NavigationBar activeScreen='analysis'/>
                    <Jumbotron>
                        <h1>Welcome to the Analysis Screen {this.state.currentUser}!</h1>
                        <h2>You have searched for {this.state.userSearchedFor}</h2>
                        <h4>You can use the options in your <a href='/me'>homepage</a> to narrow/broaden your results</h4>
                    </Jumbotron>
                    <div className="userComparisonWrapper">
                        <div className="currentUserAnalysis">
                            <h1>{this.state.currentUser}</h1>
                            {extraInfo}

                        </div>
                        <div className="otherUserAnalysis">
                            <h1>{this.state.userSearchedFor}</h1>
                            <h2>{this.state.otherUserPlaylistJSON.total} playlists</h2>
                            <h3>For a total of {this.getTotalTracks(this.state.userSearchedFor)} tracks</h3>
                        </div>
                    </div>
                    <CommonTracksHandler currentUser={this.state.currentUser} userSearchedFor={this.state.userSearchedFor} topTracks={this.state.topTracks} currentUserPlaylistIDs={this.state.currentUserPlaylistIDs} otherUserPlaylistIDs={this.state.otherUserPlaylistIDs} authToken={this.props.authToken}/>
                </div>
            );
        }

        else if (this.state.currentUser && this.state.otherUserPlaylistJSON) {
            // User exists but has no public playlists.
            return (
                <div className="analysisScreenWrapper">
                    <NavigationBar activeScreen="analysis"/>
                    <h1>Sorry, {this.state.userSearchedFor} doesn't have any public playlists :(</h1>
                    <h3>Come back when you've searched for another user.</h3>
                </div>
            )
        }



        else if (this.state.currentUser && !this.state.userSearchedFor) {
            return (
                <div className="analysisScreenWrapper">
                    <NavigationBar activeScreen='analysis'/>
                    <h1>Come back when you've searched for another user.</h1>
                </div>
            )
        }
        else {
            return null;
        }
    }

}


const mapStateToProps = (state: any) => ({
    authToken: state.authToken,
    currentUser: state.currentUser,
    userSearchedFor: state.userSearchedFor,
});


export default connect(mapStateToProps)(AnalysisScreen);