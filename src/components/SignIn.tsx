import React from 'react';
import { Button } from 'react-bootstrap';

function SignIn(props?: { token: string; }) {
    let spotifyLink = "https://accounts.spotify.com/authorize?client_id=60922fa1b01a4dc097de97dd4030cb1a&redirect_uri=http:%2F%2Flocalhost:3000%2Fcallback&scope=user-read-private%20user-read-email%20user-top-read%20playlist-read-private%20user-read-recently-played%20user-library-read%20playlist-modify-public%20playlist-modify-private&response_type=token";
    if (props && props.token) {
        return (
            <div className="signinButton">
                <Button variant="primary" size="lg" type="button" disabled>Signed in</Button>
            </div>);
    }
    else {
        return (
            <div className="signinButton">
                <Button variant="primary" size="lg" type="button" href={spotifyLink}>Sign in</Button>
            </div>);
    }
}

SignIn.defaultProps = {
    token: '',
}

export default SignIn