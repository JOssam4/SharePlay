import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/PageNotFound.css';

function PageNotFoundScreen() {
  return (
    <div className="not-found-wrapper">
      <h1 className="errorCode">404</h1>
      <h4>Hmm... it doesn&apos;t look like there&apos;s anything here.</h4>
      <h4><Link to="/">Return to sign in</Link></h4>

    </div>
  );
}

export default PageNotFoundScreen;
