/**
 * Use <Link> tags instead of <a> tags.
 *
 * From StackOverflow https://stackoverflow.com/questions/61176344/redux-state-resets-itself-on-route-change-i-think:
 * Use a <Link> tag as opposed to an <a> tag. The a tag will reload the page entirely and remove current the state. A Link tag allows you to retain your data through out the application but still allows you to move between pages in your app.
 * */

import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import '../styles/NavigationBar.css';

interface Props {
    activeScreen: string,
    userSearchedFor: string | null,
}

function NavigationBar({ activeScreen, userSearchedFor }: Props) {
  let meButton = <li className="nav-item"><Link to="/me" className="nav-link">Me</Link></li>;
  let searchButton = <li className="nav-item"><Link to="/search" className="nav-link">Search</Link></li>;
  let analysisButton = <li className="nav-item"><Link to="/analysis" className="nav-link">Analysis</Link></li>;

  if (activeScreen === 'me') {
    meButton = <li className="nav-item active"><Link to="/me" className="nav-link disabledLink" onClick={(event) => event.preventDefault()}>Me</Link></li>;
  } else if (activeScreen === 'search') {
    searchButton = <li className="nav-item active"><Link to="/search" className="nav-link disabledLink" onClick={(event) => event.preventDefault()}>Search for a user</Link></li>;
  } else if (activeScreen === 'analysis') {
    analysisButton = <li className="nav-item active"><Link to="/analysis" className="nav-link disabledLink" onClick={(event) => event.preventDefault()}>Analysis</Link></li>;
  }

  // Disable analysis screen if user has not yet searched for another user.
  if (!userSearchedFor) {
    analysisButton = <li className="nav-item disabled"><Link to="/analysis" className="nav-link disabledLink" onClick={(event) => event.preventDefault()}>Analysis</Link></li>;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      {/*
      <a className="navbar-brand">SharePlay</a>
      */}
      <Link className="navbar-brand" to="/" onClick={(event) => event.preventDefault()}>SharePlay</Link>
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
});

NavigationBar.propTypes = {
  activeScreen: PropTypes.oneOf(['me', 'search', 'analysis', 'settings']).isRequired,
};

export default connect(mapStateToProps)(NavigationBar);
