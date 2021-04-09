import React from 'react';

import SignIn from '../components/SignIn';
import '../styles/InitialScreen.css';

export default function InitialScreen() {
  return (
    <div className="signin-screen">
      <h1>Welcome to SharePlay!</h1>
      <h3>This is the web app that helps you find common musical interests with other Spotify users!</h3>
      <h5>First things first: you need to sign in through Spotify</h5>
      <SignIn />
      <h6>Note: SharePlay does not store your login information.</h6>
      <footer className="footer">
        <p className="powered-by-spotify">
          Powered by&nbsp;
          <a
            className="spotify-link"
            href="https://spotify.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Spotify
          </a>
        </p>
      </footer>
    </div>
  );
}
