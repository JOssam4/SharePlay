/**
 * This component should be what renders when the user signs in. Therefore, it needs access to the auth token,
 * and user data.
 * I'm not sure yet if it should have its own ReactRouter path.
 */

import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
// import Playlists from '../components/Playlists';

import { RouteComponentProps } from 'react-router-dom';

import { connect } from 'react-redux';
import NavigationBar from '../components/NavigationBar';
import SettingsView from '../components/SettingsView';

import { setCurrentUser, showPlaylists } from '../actions';

import '../styles/HomeScreen.css';

interface Props {
    authToken: string,
    dispatch: Function,
    history: RouteComponentProps['history'],
    location: RouteComponentProps['location'],
    match: RouteComponentProps['match'],
    showPlaylists: any,
    staticContext: any,

}

interface State {
    currentUser: string | null,
    userEmail: string | null,
    displayName: string | null,
    shouldShowPlaylists: boolean,
}

class UserHomeScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.props.history.push('/me');
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      currentUser: null,
      // eslint-disable-next-line react/no-unused-state
      userEmail: null,
      displayName: null,
      // eslint-disable-next-line react/no-unused-state
      shouldShowPlaylists: this.props.showPlaylists,

    };
    this.loadPlaylists = this.loadPlaylists.bind(this);
  }

  componentDidMount() {
    this.getEmailAndUserID();
  }

  getEmailAndUserID() {
    fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${this.props.authToken}`,
      },
    }).then((resp) => {
      resp.json().then((respjson) => {
        console.log('Email and User ID request successful!');
        console.log(`Email: ${respjson.email}, userID: ${respjson.id}`);
        console.dir(respjson);
        this.props.dispatch(setCurrentUser(respjson.id));
        // eslint-disable-next-line react/no-unused-state
        this.setState({ userEmail: respjson.email, currentUser: respjson.id, displayName: respjson.display_name });
      });
    }).catch((err) => {
      console.log('Error getting email from API. Error: ', err);
    });
  }

  loadPlaylists() {
    this.props.dispatch(showPlaylists());
    // eslint-disable-next-line react/no-unused-state
    this.setState({ shouldShowPlaylists: true });
    // This code here can probably be safely deleted but it's not harming anyone so I'll leave it in.
  }

  /*
    render() {
        return (
            <div className="signed_in_content_wrapper">
                <NavigationBar activeScreen='me'/>
                <Jumbotron>
                    <h1>Welcome to SharePlay {this.state.currentUser}</h1>
                    <h3>With SharePlay, you can find tracks/artists that both you and a friend enjoy</h3>
                    <h5>Let's start by getting your playlists.</h5>
                    <Button varient="primary" disabled={this.state.shouldShowPlaylists} onClick={this.loadPlaylists}>Get my playlists</Button>
                </Jumbotron>
                { (this.state.shouldShowPlaylists) &&
                    <Playlists userID={this.state.currentUser} authToken={this.state.authToken}/>
                }
            </div>
        )
    }

     */

  render() {
    return (
      <div className="signed_in_content_wrapper">
        <NavigationBar activeScreen="me" />
        <Jumbotron>
          <h1>
            Welcome to SharePlay&nbsp;
            {this.state.displayName}
          </h1>
          <h3>With SharePlay, you can find tracks/artists that both you and a friend enjoy</h3>
          <h5>This is your home screen. You can return here whenever you want</h5>
          <h5>
            Whenever you&apos;re ready, head over to the&nbsp;
            <a href="/search">Search</a>
              &nbsp;tab.
          </h5>
        </Jumbotron>
        <div className="optionsWrapper">
          <h3 className="optionsText">Specify the data you want to use below</h3>
          <SettingsView />
        </div>
      </div>
    );
  }

  /*
    * Since I don't know how to use redux listeners, the sole purpose of this method is to check if the redux store has been updated,
    * and if it has, update the state to match the props.
    * */
}

const mapStateToProps = (state: any) => ({
  authToken: state.authToken,
  showPlaylists: state.showPlaylists,
});

// Only giving one argument to connect so we still have access to this.props.dispatch
export default connect(mapStateToProps)(UserHomeScreen);
