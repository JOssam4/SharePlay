import React, { Component } from 'react';

import UserSearch from '../components/UserSearch';
import NavigationBar from '../components/NavigationBar';
import { Jumbotron, Card, Button } from 'react-bootstrap';
import { Redirect, RouteComponentProps } from 'react-router-dom';


import { connect } from 'react-redux';

import { setUserSearchedFor } from "../actions";

//import Playlists from "../Playlists"


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
        display_name: string,
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
            //authToken: this.props.history.location.state.token,
            //authToken: this.props.authToken,
            //userSearchedFor: null
            userSearchedFor: this.props.userSearchedFor,
            userSearchedForJSONData: null,
            userNotFound: false,
        }
        this.submitHandler = this.submitHandler.bind(this);
        this.mounted = true
    }

    submitHandler(otherUser: string) {
        fetch(`https://api.spotify.com/v1/users/${otherUser}`, {
            headers: {
                'Authorization': `Bearer ${this.props.authToken}`
            }
        }).then(resp => {
            if (resp.ok) {
                resp.json().then(respjson => {
                    this.setState({userSearchedFor: otherUser, userNotFound: false, userSearchedForJSONData: respjson});
                    this.props.dispatch(setUserSearchedFor(otherUser));
                });
            }
            else {
                this.setState({userNotFound: true, userSearchedFor: null, userSearchedForJSONData: null});
            }
        });
    }

    componentDidMount() {
        fetch(`https://api.spotify.com/v1/users/${this.state.userSearchedFor}`, {
            headers: {
                'Authorization': `Bearer ${this.props.authToken}`
            }
        }).then(resp => {
            if (resp.ok) {
                resp.json().then(respjson => {
                    if (this.mounted) { // Make sure no memory leak if promise takes longer than component is mounted for.
                        this.setState({userSearchedForJSONData: respjson});
                    }
                });
            }
        });
    }

    getUserCard() {
        if (this.state.userSearchedForJSONData) {
            if (this.state.userSearchedForJSONData.images.length !== 0) {
                return (
                    <Card style={{width: '18rem'}}>
                        <Card.Img src={this.state.userSearchedForJSONData.images[0].url}/>
                        <Card.Title>{this.state.userSearchedForJSONData.display_name}</Card.Title>
                    </Card>
                );
            } else {
                return (
                    <Card style={{width: '18rem'}}>
                        <Card.Title>{this.state.userSearchedForJSONData.display_name}</Card.Title>
                    </Card>
                );
            }
        }
        else {
            return null;
        }
    }

    render() {
        if (this.props.authToken) {
            if (this.state.userSearchedFor) {
                if (this.state.userSearchedForJSONData) {
                    return (
                        <div className="userSearchWrapper">
                            <NavigationBar activeScreen='search'/>
                            <UserSearch submitHandler={this.submitHandler}/>
                            <Jumbotron>
                                <h1>You have searched for {this.state.userSearchedFor}</h1>
                                <h2>User Found!</h2>
                                {this.getUserCard()}
                                <h4>Head over to the <a href='/analysis'>Analysis</a> page whenever you're ready</h4>
                            </Jumbotron>
                        </div>
                    );
                }
                else {
                    return null; // This is for the case that user clicked away and clicked back. json data has to be regenerated.
                }
            }
            else if (this.state.userNotFound) { // User has been searched for but doesn't exist.
                return (
                    <div className="userSearchWrapper">
                        <NavigationBar activeScreen='search'/>
                        <UserSearch submitHandler={this.submitHandler}/>
                        <Jumbotron>
                            <h1>Hmm... It doesn't look like that user exists!</h1>
                        </Jumbotron>
                    </div>
                );
            }
            else {
                return (
                    <div className="userSearchWrapper">
                        <NavigationBar activeScreen='search'/>
                        <UserSearch submitHandler={this.submitHandler}/>
                    </div>
                )
            }
        }
        else {
            console.log("Error occurred. Re-routing you to login page... ")
            return (
                <Redirect to="/"/>
            );
        }
    }

    componentDidUpdate(prevProps: Props, prevState: State, snapshot: any) {
        // In the case that userSearchedFor is defined but the json data needs to be regenerated.
        if (this.state.userSearchedFor && !this.state.userSearchedForJSONData) {
            fetch(`https://api.spotify.com/v1/users/${this.state.userSearchedFor}`, {
                headers: {
                    'Authorization': `Bearer ${this.props.authToken}`
                }
            }).then(resp => {
                if (resp.ok) {
                    resp.json().then(respjson => {
                        this.setState({userSearchedForJSONData: respjson});
                    });
                }
            });
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

}

const mapStateToProps = (state: any) => ({
    authToken: state.authToken,
    userSearchedFor: state.userSearchedFor,
})



export default connect(mapStateToProps)(SearchScreen);