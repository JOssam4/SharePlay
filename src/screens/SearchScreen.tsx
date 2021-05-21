import React, { Component } from 'react';

import { Card } from 'react-bootstrap';
import { Redirect, RouteComponentProps, Link } from 'react-router-dom';

import { connect } from 'react-redux';
import NavigationBar from '../components/NavigationBar';
import UserSearch from '../components/UserSearch';

import { setUserSearchedFor } from '../actions';

// import Playlists from "../Playlists"

import '../styles/SearchScreen.css';

interface Props {
    authToken: string,
    dispatch: Function,
    history: RouteComponentProps['history'],
    location: RouteComponentProps['location'],
    match: RouteComponentProps['match'],
    staticContext: any,
    userSearchedFor: string | null | undefined,
}

interface State {
    userSearchedFor: string | null | undefined,
    userSearchedForJSONData: {
        // eslint-disable-next-line camelcase
        display_name: string,
        // eslint-disable-next-line camelcase
        external_urls: {
            spotify: string,
        },
        followers: {
            href: string | null,
            total: number
        },
        href: string,
        id: string,
        images: {height: number | null, url: string, width: number | null}[],
        type: string,
        uri: string,
    } | null,
    userNotFound: boolean,
}

class SearchScreen extends Component<Props, State> {
    private mounted: boolean;

    constructor(props: Props) {
      super(props);
      this.state = {
        // authToken: this.props.history.location.state.token,
        // authToken: this.props.authToken,
        // userSearchedFor: null
        userSearchedFor: this.props.userSearchedFor,
        userSearchedForJSONData: null,
        userNotFound: false,
      };
      this.submitHandler = this.submitHandler.bind(this);
      this.mounted = true;
    }

    componentDidMount() {
      fetch(`https://api.spotify.com/v1/users/${this.state.userSearchedFor}`, {
        headers: {
          Authorization: `Bearer ${this.props.authToken}`,
        },
      }).then((resp) => {
        if (resp.ok) {
          resp.json().then((respjson) => {
            if (this.mounted) { // Make sure no memory leak if promise takes longer than component is mounted for.
              this.setState({ userSearchedForJSONData: respjson });
            }
          });
        }
      });
    }

    // eslint-disable-next-line no-unused-vars
    componentDidUpdate(prevProps: Props, prevState: State, snapshot: any) {
      // In the case that userSearchedFor is defined but the json data needs to be regenerated.
      if (this.state.userSearchedFor && !this.state.userSearchedForJSONData) {
        fetch(`https://api.spotify.com/v1/users/${this.state.userSearchedFor}`, {
          headers: {
            Authorization: `Bearer ${this.props.authToken}`,
          },
        }).then((resp) => {
          if (resp.ok) {
            resp.json().then((respjson) => {
              this.setState({ userSearchedForJSONData: respjson });
            });
          }
        });
      }
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    getUserCard() {
      if (this.state.userSearchedForJSONData) {
        if (this.state.userSearchedForJSONData.images.length !== 0) {
          return (
            <Card style={{ width: '18rem' }}>
              <Card.Img src={this.state.userSearchedForJSONData.images[0].url} />
              <Card.Title>{this.state.userSearchedForJSONData.display_name}</Card.Title>
            </Card>
          );
        }
        return (
          <Card style={{ width: '18rem' }}>
            <Card.Title>{this.state.userSearchedForJSONData.display_name}</Card.Title>
          </Card>
        );
      }

      return null;
    }

    static getUsernameFromShareURL(shareURL: string): string {
      const userNameAndParams = shareURL.substring(shareURL.indexOf('/user/') + 6);
      if (userNameAndParams.includes('?')) {
        return userNameAndParams.substring(0, userNameAndParams.indexOf('?'));
      }
      return userNameAndParams;
    }

    /**
     * should accept either a direct username or a spotify share URL.
     * spotify share URL format: https://open.spotify.com/user/<USERNAME>?si=<DATA>.
     * This function should be able to parse out the <USERNAME> data in the latter case.
     * */
    submitHandler(otherUser: string) {
      let userID: string;
      if (otherUser.includes('spotify.com')) {
        userID = SearchScreen.getUsernameFromShareURL(otherUser);
      } else {
        userID = otherUser;
      }
      fetch(`https://api.spotify.com/v1/users/${userID}`, {
        headers: {
          Authorization: `Bearer ${this.props.authToken}`,
        },
      }).then((resp) => {
        if (resp.ok) {
          resp.json().then((respjson) => {
            this.setState({ userSearchedFor: userID, userNotFound: false, userSearchedForJSONData: respjson });
            this.props.dispatch(setUserSearchedFor(userID));
          });
        } else {
          this.setState({ userNotFound: true, userSearchedFor: null, userSearchedForJSONData: null });
        }
      });
    }

    render() {
      if (this.props.authToken) {
        if (this.state.userSearchedFor) {
          if (this.state.userSearchedForJSONData) {
            return (
              <div className="userSearchWrapper">
                <NavigationBar activeScreen="search" />
                <UserSearch submitHandler={this.submitHandler} />
                <div className="results">
                  <h1>
                    You have searched for&nbsp;
                    {this.state.userSearchedFor}
                  </h1>
                  <h2>User Found!</h2>
                  {this.getUserCard()}
                  <br />
                  <h4>
                    Head over to the&nbsp;
                    <Link to="/analysis">Analysis</Link>
                    &nbsp;page whenever you&apos;re ready
                  </h4>
                </div>
              </div>
            );
          }

          return null; // This is for the case that user clicked away and clicked back. json data has to be regenerated.
        }
        if (this.state.userNotFound) { // User has been searched for but doesn't exist.
          return (
            <div className="userSearchWrapper">
              <NavigationBar activeScreen="search" />
              <UserSearch submitHandler={this.submitHandler} />
              <div className="userDoesntExist">
                <h1>User not found. Try again</h1>
              </div>
            </div>
          );
        }

        return (
          <div className="userSearchWrapper">
            <NavigationBar activeScreen="search" />
            <UserSearch submitHandler={this.submitHandler} />
          </div>
        );
      }

      return (
        <Redirect to="/" />
      );
    }
}

const mapStateToProps = (state: any) => ({
  authToken: state.authToken,
  userSearchedFor: state.userSearchedFor,
});

export default connect(mapStateToProps)(SearchScreen);
