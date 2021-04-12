/*
* The analysis part of this project needs to be thought out in a way that saves the most space and time.
* I'm thinking that, since the searched user probably has fewer playlists publicly available,
* their tracks' id's should be stored in a hashmap, and then the much larger logged in user's data will be compared to that hashmap.
* */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Jumbotron } from 'react-bootstrap';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import type {
  // eslint-disable-next-line no-unused-vars
  Playlist, PlaylistJSON, TrackItems, TrackType, TracksRespWithAddedTime, TracksRespWithoutAddedTime,
} from '../Helpers/SpotifyAPITypes';

// import SharedDataView from '../components/SharedDataView';
import CommonTracksHandler from '../components/CommonTracksHandler';

interface Props {
  authToken: string,
  currentUser: string,
  dispatch: Function,
  history: RouteComponentProps['history'],
  location: RouteComponentProps['location'],
  match: RouteComponentProps['match'],
  staticContext: any,
  userSearchedFor: string,
  usePlaylists: boolean,
  useTopTracks: boolean,
  topTracksTimeframe: string | null,
  useSavedTracks: boolean,
}

interface State {
  currentUser: string,
  currentUserPlaylistIDs: string[],
  currentUserPlaylistJSON: PlaylistJSON | null,
  currentUserTrackMap: Map<string, number>,
  otherUserPlaylistIDs: string[],
  otherUserPlaylistJSON: PlaylistJSON | null, // I'll fill this in later,
  savedTracks: { id: string, name: string }[],
  sharedPlaylist: any,
  sharedTracks: Map<string, string>,
  topTracks: any,
  userSearchedFor: string,
}

class AnalysisScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentUser: this.props.currentUser,
      userSearchedFor: this.props.userSearchedFor,
      currentUserPlaylistJSON: null,
      otherUserPlaylistJSON: null,

      currentUserPlaylistIDs: [],
      otherUserPlaylistIDs: [],

      // eslint-disable-next-line react/no-unused-state
      currentUserTrackMap: new Map(),
      // eslint-disable-next-line react/no-unused-state
      sharedTracks: new Map(),
      topTracks: [],

      savedTracks: [],

      // eslint-disable-next-line react/no-unused-state
      sharedPlaylist: null,
    };
  }

  componentDidMount() {
    if (this.state.currentUser && this.state.userSearchedFor) {
      this.getUserPlaylistData();
      if (this.props.useTopTracks) {
        this.getTopTracks();
      }
      if (this.props.useSavedTracks) {
        this.getSavedTracks();
      }
    }
  }

  getTotalTracks(user: string) {
    let totalTracks = 0;
    if (user === this.state.currentUser) {
      this.state.currentUserPlaylistJSON?.items.forEach((playlist) => {
        totalTracks += playlist.tracks.total;
      });
    } else {
      this.state.otherUserPlaylistJSON?.items.forEach((playlist) => {
        totalTracks += playlist.tracks.total;
      });
    }
    return totalTracks;
  }

  getTopTracks() {
    fetch(`https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${this.props.topTracksTimeframe}`, {
      headers: {
        Authorization: `Bearer ${this.props.authToken}`,
      },
    }).then((resp) => {
      resp.json().then((topTracksObject: TracksRespWithoutAddedTime) => {
        const trackIds: {id: string, name: string}[] = [];
        const topTracks = topTracksObject.items;
        topTracks.forEach((track: TrackType) => {
          trackIds.push({ id: track.id, name: track.name });
        });
        this.setState({ topTracks: trackIds });
      });
    });
  }

  async getSavedTracks() {
    const trackIDs: {id: string, name: string}[] = [];
    let resp = await fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
      headers: {
        Authorization: `Bearer ${this.props.authToken}`,
      },
    });
    let respjson: TracksRespWithAddedTime = await resp.json();
    respjson.items.forEach((trackItem: TrackItems) => {
      trackIDs.push({ id: trackItem.track.id, name: trackItem.track.name });
    });
    let tracksRemaining = respjson.total - 50; // since we can only get 50 at a time, use this to keep track of how many more we need to get
    let offset = 0;
    while (tracksRemaining > 0) {
      offset += 50;
      // eslint-disable-next-line no-await-in-loop
      resp = await fetch(`https://api.spotify.com/v1/me/tracks?offset=${offset}&limit=50`, {
        headers: {
          Authorization: `Bearer ${this.props.authToken}`,
        },
      });
      // eslint-disable-next-line no-await-in-loop
      respjson = await resp.json();
      respjson.items.forEach((trackItem: TrackItems) => {
        trackIDs.push({ id: trackItem.track.id, name: trackItem.track.name });
      });
      tracksRemaining -= 50;
    }
    this.setState({ savedTracks: trackIDs });
  }

  async getUserPlaylistData() {
    const otherUserResp = await fetch(`https://api.spotify.com/v1/users/${this.state.userSearchedFor}/playlists`, {
      headers: {
        Authorization: `Bearer ${this.props.authToken}`,
      },
    });
    const otherUserRespjson: PlaylistJSON = await otherUserResp.json();
    const otherUserIDs: string[] = [];
    otherUserRespjson.items.forEach((playlist: Playlist) => {
      otherUserIDs.push(playlist.id);
    });
    if (this.props.usePlaylists) {
      const currentUserResp = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
        headers: {
          Authorization: `Bearer ${this.props.authToken}`,
        },
      });
      const currentUserRespjson: PlaylistJSON = await currentUserResp.json();
      const currentUserIDs: string[] = [];
      currentUserRespjson.items.forEach((playlist: Playlist) => {
        if (playlist.owner.id === this.state.currentUser) {
          currentUserIDs.push(playlist.id);
        }
      });
      this.setState({
        currentUserPlaylistJSON: currentUserRespjson,
        otherUserPlaylistJSON: otherUserRespjson,
        currentUserPlaylistIDs: currentUserIDs,
        otherUserPlaylistIDs: otherUserIDs,
      });
    } else {
      this.setState({
        otherUserPlaylistJSON: otherUserRespjson,
        otherUserPlaylistIDs: otherUserIDs,
      });
    }
  }

  // Gonna go for a kind of split-screen look here. Current user on left, searched user on right.
  render() {
    if (!this.props.authToken) {
      return <Redirect to="/" />;
    }
    if (this.state.currentUserPlaylistJSON && this.state.otherUserPlaylistIDs.length > 0) {
      let extraInfo;
      if (this.props.useTopTracks) {
        if (this.props.useSavedTracks) {
          extraInfo = [
            <h2 key={0}>
              {this.state.topTracks.length}
              &nbsp;top tracks
            </h2>,
            <h2 key={1}>
              {this.state.savedTracks.length}
              &nbsp;saved tracks
            </h2>,
            <h3 key={2}>
              For a total of&nbsp;
              {this.getTotalTracks(this.state.currentUser) + this.state.topTracks.length + this.state.savedTracks.length}
              &nbsp;tracks
            </h3>];
        } else {
          extraInfo = [
            <h2>
              {this.state.topTracks.length}
              &nbsp;top tracks
            </h2>,
            <h3>
              For a total of&nbsp;
              {this.getTotalTracks(this.state.currentUser) + this.state.topTracks.length}
              &nbsp;tracks
            </h3>];
        }
      } else if (this.props.useSavedTracks) {
        extraInfo = [
          <h2 key={1}>
            {this.state.savedTracks.length}
            &nbsp;saved tracks
          </h2>,
          <h3 key={2}>
            For a total of&nbsp;
            {this.getTotalTracks(this.state.currentUser) + this.state.savedTracks.length}
            &nbsp;tracks
          </h3>];
      } else {
        extraInfo = (
          <h3>
            For a total of&nbsp;
            {this.getTotalTracks(this.state.currentUser)}
            &nbsp;tracks
          </h3>
        );
      }

      return (
        <div className="analysisScreenWrapper">
          <NavigationBar activeScreen="analysis" />
          <Jumbotron>
            <h1>
              Welcome to the Analysis Screen&nbsp;
              {this.state.currentUser}
              !
            </h1>
            <h2>
              You have searched for&nbsp;
              {this.state.userSearchedFor}
            </h2>
            <h4>
              You can use the options in your&nbsp;
              <Link to="/me">homepage</Link>
              &nbsp;to narrow/broaden your results
            </h4>
          </Jumbotron>
          <div className="userComparisonWrapper">
            <div className="currentUserAnalysis">
              <h1>{this.state.currentUser}</h1>
              <h2>
                {this.state.currentUserPlaylistJSON.total}
                &nbsp;playlists
              </h2>
              {extraInfo}

            </div>
            <div className="otherUserAnalysis">
              <h1>{this.state.userSearchedFor}</h1>
              <h2>
                {this.state.otherUserPlaylistJSON?.total}
                &nbsp;playlists
              </h2>
              <h3>
                For a total of&nbsp;
                {this.getTotalTracks(this.state.userSearchedFor)}
                &nbsp;total tracks
              </h3>
            </div>
          </div>
          <CommonTracksHandler currentUser={this.state.currentUser} userSearchedFor={this.state.userSearchedFor} topTracks={this.state.topTracks} currentUserPlaylistIDs={this.state.currentUserPlaylistIDs} otherUserPlaylistIDs={this.state.otherUserPlaylistIDs} savedTracks={this.state.savedTracks} authToken={this.props.authToken} />
        </div>
      );
    }

    if (this.state.currentUser && this.state.otherUserPlaylistJSON) {
      // Only use my top tracks and saved tracks, not my playlists
      let extraInfo;
      if (this.props.useTopTracks) {
        if (this.props.useSavedTracks) {
          extraInfo = [
            <h2 key={0}>
              {this.state.topTracks.length}
              &nbsp;top tracks
            </h2>,
            <h2 key={1}>
              {this.state.savedTracks.length}
              &nbsp;saved tracks
            </h2>,
            <h3>
              For a total of&nbsp;
              {this.state.topTracks.length + this.state.savedTracks.length}
              &nbsp;tracks
            </h3>];
        } else {
          extraInfo = [
            <h2>
              {this.state.topTracks.length}
              &nbsp;top tracks
            </h2>,
            <h3>
              For a total of&nbsp;
              {this.state.topTracks.length}
              &nbsp;tracks
            </h3>];
        }
      } else if (this.props.useSavedTracks) {
        extraInfo = [
          <h2 key={1}>
            {this.state.savedTracks.length}
            &nbsp;saved tracks
          </h2>,
          <h3 key={2}>
            For a total of&nbsp;
            {this.state.savedTracks.length}
            &nbsp;tracks
          </h3>];
      } else {
        extraInfo = <h3>For a total of 0 tracks</h3>;
      }
      return (
        <div className="analysisScreenWrapper">
          <NavigationBar activeScreen="analysis" />
          <Jumbotron>
            <h1>
              Welcome to the Analysis Screen&nbsp;
              {this.state.currentUser}
              !
            </h1>
            <h2>
              You have searched for&nbsp;
              {this.state.userSearchedFor}
            </h2>
            <h4>
              You can use the options in your&nbsp;
              <Link to="/me">homepage</Link>
              &nbsp;to narrow/broaden your results
            </h4>
          </Jumbotron>
          <div className="userComparisonWrapper">
            <div className="currentUserAnalysis">
              <h1>{this.state.currentUser}</h1>
              {extraInfo}

            </div>
            <div className="otherUserAnalysis">
              <h1>{this.state.userSearchedFor}</h1>
              <h2>
                {this.state.otherUserPlaylistJSON.total}
                &nbsp;playlists
              </h2>
              <h3>
                For a total of&nbsp;
                {this.getTotalTracks(this.state.userSearchedFor)}
                &nbsp;tracks
              </h3>
            </div>
          </div>
          <CommonTracksHandler currentUser={this.state.currentUser} userSearchedFor={this.state.userSearchedFor} topTracks={this.state.topTracks} currentUserPlaylistIDs={this.state.currentUserPlaylistIDs} otherUserPlaylistIDs={this.state.otherUserPlaylistIDs} savedTracks={this.state.savedTracks} authToken={this.props.authToken} />
        </div>
      );
    }

    if (this.state.currentUser && this.state.otherUserPlaylistJSON) {
      // User exists but has no public playlists.
      return (
        <div className="analysisScreenWrapper">
          <NavigationBar activeScreen="analysis" />
          <h1>
            Sorry,
            {this.state.userSearchedFor}
            &nbsp;doesn&apos;t have any public playlists :(
          </h1>
          <h3>Come back when you&apos;ve searched for another user.</h3>
        </div>
      );
    }

    if (this.state.currentUser && !this.state.userSearchedFor) {
      return (
        <div className="analysisScreenWrapper">
          <NavigationBar activeScreen="analysis" />
          <h1>Come back when you&apos;ve searched for another user.</h1>
        </div>
      );
    }

    return null;
  }
}

const mapStateToProps = (state: any) => ({
  authToken: state.authToken,
  currentUser: state.currentUser,
  userSearchedFor: state.userSearchedFor,
  usePlaylists: state.usePlaylists,
  useTopTracks: state.useTopTracks,
  topTracksTimeframe: state.topTracksTimeframe,
  useSavedTracks: state.useSavedTracks,
});

export default connect(mapStateToProps)(AnalysisScreen);
