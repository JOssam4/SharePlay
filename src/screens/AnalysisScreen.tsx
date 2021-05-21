/*
* The analysis part of this project needs to be thought out in a way that saves the most space and time.
* I'm thinking that, since the searched user probably has fewer playlists publicly available,
* their tracks' id's should be stored in a hashmap, and then the much larger logged in user's data will be compared to that hashmap.
* */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import type {
  // eslint-disable-next-line no-unused-vars
  Playlist, PlaylistJSON, TrackItems, TrackType, TracksRespWithAddedTime, TracksRespWithoutAddedTime,
} from '../Helpers/SpotifyAPITypes';
import { MinifiedTrackType, MapTrackValue } from '../Helpers/OtherTypes';

import CommonTracksHandler from '../components/CommonTracksHandler';
// import AnalysisExtraInfo from '../components/AnalysisExtraInfo';
import UserAnalysis from '../components/UserAnalysis';

import { getUserPlaylistData, getTopTracks, getSavedTracks } from '../Helpers/AnalysisHelperFuncs';

import '../styles/AnalysisScreen.css';

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
  savedTracks: MinifiedTrackType[],
  sharedPlaylist: any,
  sharedTracks: Map<string, MapTrackValue>,
  topTracks: MinifiedTrackType[],
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

  async componentDidMount() {
    if (this.state.currentUser && this.state.userSearchedFor) {
      const playlistData = await getUserPlaylistData(this.props.authToken, this.props.currentUser, this.props.userSearchedFor, this.props.usePlaylists);
      this.setState(playlistData);
      if (this.props.useTopTracks && this.props.topTracksTimeframe) {
        const topTracks = await getTopTracks(this.props.authToken, this.props.topTracksTimeframe);
        this.setState({ topTracks });
      }
      if (this.props.useSavedTracks) {
        const savedTracks = await getSavedTracks(this.props.authToken);
        this.setState({ savedTracks });
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

  // Gonna go for a kind of split-screen look here. Current user on left, searched user on right.
  render() {
    if (!this.props.authToken) {
      return <Redirect to="/" />;
    }
    if (this.state.currentUserPlaylistJSON && this.state.otherUserPlaylistIDs.length > 0 && this.state.otherUserPlaylistJSON) {
      return (
        <div className="analysisScreenWrapper">
          <NavigationBar activeScreen="analysis" />
          <div className="info">
            <h1>
              Welcome to the Analysis Screen&nbsp;
              {this.state.currentUser}
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
          </div>
          <div className="userComparisonWrapper">
            <UserAnalysis user={this.state.currentUser} numPlaylists={this.state.currentUserPlaylistIDs.length} numPlaylistTracks={this.getTotalTracks(this.state.currentUser)} numSavedTracks={this.state.savedTracks.length} numTopTracks={this.state.topTracks.length} showsCurrentUser />
            <UserAnalysis user={this.state.userSearchedFor} numPlaylists={this.state.otherUserPlaylistJSON.total} numPlaylistTracks={this.getTotalTracks(this.state.userSearchedFor)} numSavedTracks={0} numTopTracks={0} showsCurrentUser={false} />
          </div>
          <CommonTracksHandler currentUser={this.state.currentUser} userSearchedFor={this.state.userSearchedFor} topTracks={this.state.topTracks} currentUserPlaylistIDs={this.state.currentUserPlaylistIDs} otherUserPlaylistIDs={this.state.otherUserPlaylistIDs} savedTracks={this.state.savedTracks} authToken={this.props.authToken} />
        </div>
      );
    }

    if (this.state.currentUser && this.state.otherUserPlaylistJSON) {
      // Only use my top tracks and saved tracks, not my playlists
      return (
        <div className="analysisScreenWrapper">
          <NavigationBar activeScreen="analysis" />
          <div className="info">
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
          </div>
          <div className="userComparisonWrapper">
            {/*
              <div className="currentUserAnalysis">
                <h1>{this.state.currentUser}</h1>
                <AnalysisExtraInfo numPlaylists={this.state.currentUserPlaylistIDs.length}
                                   numPlaylistTracks={this.getTotalTracks(this.state.currentUser)}
                                   numSavedTracks={this.state.savedTracks.length}
                                   numTopTracks={this.state.topTracks.length} isCurrentUser/>

              </div>
              */}
            <UserAnalysis user={this.state.currentUser} numPlaylists={this.state.currentUserPlaylistIDs.length} numPlaylistTracks={this.getTotalTracks(this.state.currentUser)} numSavedTracks={this.state.savedTracks.length} numTopTracks={this.state.topTracks.length} showsCurrentUser />
            <UserAnalysis user={this.state.userSearchedFor} numPlaylists={this.state.otherUserPlaylistJSON.total} numPlaylistTracks={this.getTotalTracks(this.state.userSearchedFor)} numSavedTracks={0} numTopTracks={0} showsCurrentUser={false} />
            {/* <AnalysisExtraInfo numPlaylists={this.state.otherUserPlaylistJSON.total} numPlaylistTracks={this.getTotalTracks(this.state.userSearchedFor)} numSavedTracks={0} numTopTracks={0} isCurrentUser={false} /> */}
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
