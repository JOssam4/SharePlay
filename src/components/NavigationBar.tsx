import React, { Component } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

interface Props {
    activeScreen: string,
}

export default function NavigationBar(props: Props) {
    let meButton = <li className="nav-item"><a className="nav-link" href="/me">Me</a></li>
    let searchButton = <li className="nav-item"><a className="nav-link" href="/search">Search</a></li>
    let analysisButton = <li className="nav-item"><a className="nav-link" href="/analysis">Analysis</a></li>
    let settingsButton = <li className="nav-item"><a className="nav-link" href="/settings">Settings</a></li>
    if (props.activeScreen === "me") {
        meButton = <li className="nav-item active"><a className="nav-link disabled" href="/me">Me</a></li>
    }
    else if (props.activeScreen === "search") {
        searchButton = <li className="nav-item active"><a className="nav-link disabled" href="/search">Search for a user</a></li>
    }
    else if (props.activeScreen === "analysis") {
        analysisButton = <li className="nav-item active"><a className="nav-link disabled" href="/analysis">Analysis</a></li>
    }
    else if (props.activeScreen === "settings") {
        settingsButton = <li className="nav-item active"><a className="nav-link disabled" href="/settings">Settings</a></li>
    }



    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand">SharePlay</a>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    {meButton}

                    {searchButton}

                    {analysisButton}

                    {settingsButton}
                </ul>
            </div>
        </nav>
    );
}
/*
export default class NavigationBar extends Component<Props> {
    constructor(props: Props) {
        super(props);

    }

    render() {
        let meButton = <li className="nav-item"><a className="nav-link" href="/me">Me</a></li>
        let searchButton = <li className="nav-item"><a className="nav-link" href="/search">Search</a></li>
        let analysisButton = <li className="nav-item"><a className="nav-link" href="/analysis">Analysis</a></li>
        let settingsButton = <li className="nav-item"><a className="nav-link" href="/settings">Settings</a></li>
        if (this.props.activeScreen === "me") {
            meButton = <li className="nav-item active"><a className="nav-link disabled" href="/me">Me</a></li>
        }
        else if (this.props.activeScreen === "search") {
            searchButton = <li className="nav-item active"><a className="nav-link disabled" href="/search">Search for a user</a></li>
        }
        else if (this.props.activeScreen === "analysis") {
            analysisButton = <li className="nav-item active"><a className="nav-link disabled" href="/analysis">Analysis</a></li>
        }
        else if (this.props.activeScreen === "settings") {
            settingsButton = <li className="nav-item active"><a className="nav-link disabled" href="/settings">Settings</a></li>
        }



        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand">SharePlay</a>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        {meButton}

                        {searchButton}

                        {analysisButton}

                        {settingsButton}
                    </ul>
                </div>
            </nav>
        );
    }
}
 */
NavigationBar.propTypes = {
    activeScreen: PropTypes.oneOf(['me', 'search', 'analysis', 'settings']).isRequired,
}