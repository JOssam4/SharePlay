import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { setAuthToken } from '../actions';
import { connect } from 'react-redux';

import { TOKEN_EXPIRE_TIME } from '../localStorage';

interface CallbackProps {
    location?: any,
    dispatch?: any,
}

interface CallbackState {
    token?: string | null,
}

class Callback extends Component<CallbackProps, CallbackState> {
    constructor(props: CallbackProps) {
        super(props);
        this.state = {
            token: null
        }
    }

    componentDidMount() {
        let resp = this.props.location.hash;
        let token = resp.substring(resp.indexOf('=')+1, resp.indexOf('&'));
        localStorage.setItem(TOKEN_EXPIRE_TIME, JSON.stringify(Date.now() + 3600*1000));
        this.props.dispatch(setAuthToken(token));
        this.setState({token: token});
    }


    render() {
        if (this.state.token) {

            return (
                <Redirect to={{pathname: '/me', state: {token: this.state.token}}}/>
            );

        }
        else {
            return (
                <h1>Callback!</h1>
            );
        }
    }
}

export default connect()(Callback);