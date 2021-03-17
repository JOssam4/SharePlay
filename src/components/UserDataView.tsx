import React, { Component } from 'react';

interface Props {
    authToken: string,
    currentUserID: string,
    currentUserIDHandler: Function,
}

interface State {
    userEmail: string | null,
    currentUserID: any,
}

export default class UserDataView extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            currentUserID: null,
            userEmail: null,
        }

    }


    getEmailAndUserID() {
        fetch("https://api.spotify.com/v1/me", {
            headers: {
                "Authorization": `Bearer ${this.props.authToken}`
            }
        }).then(resp => {
            resp.json().then(respjson => {
                console.log("API request successful!");
                this.setState({userEmail: respjson['email']});
                this.setState({currentUserID: respjson['id']});
            })
        }).catch(err => {
            console.log("Error getting email from API. Error: ", err);
        });
    }

    componentDidMount() {
        this.getEmailAndUserID();
    }

    render() {
        //this.props.currentUserIDHandler(this.state.currentUserID);
        return (
            <div>
                <h1>Welcome to Shareplay {this.state.userEmail}!</h1>
            </div>
        );
    }

    componentDidUpdate() {
        if (this.props.currentUserID !== this.state.currentUserID){
            this.props.currentUserIDHandler(this.state.currentUserID);
        }
    }

}