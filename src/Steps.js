import React, { Component, Fragment } from 'react';
import { Button } from '@material-ui/core';

export class Steps extends Component {

    constructor(props) {
        super(props);
        this.buttonClick = this.buttonClick.bind(this);
        this.authToSpotify = this.authToSpotify.bind(this);
        this.state = { step: 0 }
    }

    componentDidMount() {
        const hash = window.location.hash.substr(1);

        if (hash) {
            const result = this.decodeQueryString(hash);

            if (result.state === 'spotify') {
                this.setState({ step: 1 });
                this.getSpotifyTracks(result.access_token).then((res) => {
                    this.setState({ tracks: res });
                })
            }
        }
    }

    getSpotifyTracks(token) {
        return fetch('https://api.spotify.com/v1/me/tracks', {
            headers: {
                'Authorization': token
            }
        });
    }


    buttonClick() {
        this.setState({ step: 1 });
        console.log('state: ', this.state);
    }

    authToSpotify() {
        console.log('redirect: ', 1);
        const url = `https://accounts.spotify.com/authorize?client_id=3b4af6bbede345b49ed61dada982a3d6&redirect_uri=${window.location.href}&scope=user-library-read&response_type=token&state=spotify`;
        window.location.replace(url);
    }

    decodeQueryString(queryString) {
        var pairs = queryString.split('&');
        var result = {};
        pairs.forEach(function (pair) {
            pair = pair.split('=');
            result[pair[0]] = decodeURIComponent(pair[1] || '');
        });

        return result;
    }

    render() {
        const tracks = JSON.stringify(this.state.tracks);
        switch (this.state.step) {
            case 0: {
                return (
                    <Fragment>
                        <h2>Step 1</h2>
                        <p>Allow Access to your Spotify Account</p>
                        <Button onClick={this.authToSpotify}variant="contained" color="primary">Connect to Spotify</Button>
                    </Fragment>
                )
            }
            case 1: {
                return (
                    <Fragment>
                        <h2>Step 2</h2>
                        <p>Show List of Songs</p>
                        <pre>
                            {tracks}
                        </pre>
                    </Fragment>
                )
            }
            case 2:
                return (
                    <Fragment>
                        <h2>Step 2</h2>
                        <p>Allow Access to your Youtube Account</p>
                        <Button onClick={this.buttonClick} variant="contained" color="primary">Connect to Youtube</Button>
                    </Fragment>
                )
        }
    }
}