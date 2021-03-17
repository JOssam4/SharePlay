import React, { Component, useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

interface Props {
    activeScreen: string,
    userSearchedFor: string | null,
}

function NavigationBar(props: Props) {
    let meButton = <li className="nav-item"><a className="nav-link" href="/me">Me</a></li>
    let searchButton = <li className="nav-item"><a className="nav-link" href="/search">Search</a></li>
    let analysisButton = <li className="nav-item"><a className="nav-link" href="/analysis">Analysis</a></li>
    //let settingsButton = <li className="nav-item"><a className="nav-link" href="/settings">Settings</a></li>

    if (props.activeScreen === "me") {
        meButton = <li className="nav-item active"><a className="nav-link disabled" href="/me">Me</a></li>
    }
    else if (props.activeScreen === "search") {
        searchButton = <li className="nav-item active"><a className="nav-link disabled" href="/search">Search for a user</a></li>
    }
    else if (props.activeScreen === "analysis") {
        analysisButton = <li className="nav-item active"><a className="nav-link disabled" href="/analysis">Analysis</a></li>
    }
    /*
    else if (props.activeScreen === "settings") {
        settingsButton = <li className="nav-item active"><a className="nav-link disabled" href="/settings">Settings</a></li>
    }
     */

    // Disable analysis screen if user has not yet searched for another user.

    console.log(`props.userSearchedFor: ${props.userSearchedFor}`);
    if (!Boolean(props.userSearchedFor)) {
        analysisButton = <li className="nav-item disabled"><a className="nav-link disabled" href="/analysis">Analysis</a></li>
    }


    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand">SharePlay</a>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    {meButton}

                    {searchButton}

                    {analysisButton}
                </ul>
            </div>
        </nav>
    );
}

const mapStateToProps = (state: any) => ({
    userSearchedFor: state.userSearchedFor,
})

NavigationBar.propTypes = {
    activeScreen: PropTypes.oneOf(['me', 'search', 'analysis', 'settings']).isRequired,
}

export default connect(mapStateToProps)(NavigationBar);