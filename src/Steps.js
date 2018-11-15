import React, {Component, Fragment} from 'react';
import {Button} from '@material-ui/core';

export class Steps extends Component {

    constructor(props) {
        super(props);
        this.authToSpotify = this.authToSpotify.bind(this);
        this.state = {videos: []}
    }

    componentDidMount() {
        const hash = window.location.hash.substr(1);

        if (hash) {
            const result = this.decodeQueryString(hash);

            if (result.state === 'spotify') {
                this.getSpotifyTracks(result.access_token).then((tracks) => {
                    this.setState({tracks: tracks, step: 1});

                    const promises = tracks.items.map(item => {
                        return this.getYoutubeBestResult(item.track.name + ' ' + item.track.artists[0].name)
                    });
                    Promise.all(promises).then(
                        (res) => {
                            this.setState({
                                videos: res,
                            })
                        }
                    );
                })
            }
        }
    }

    getYoutubeBestResult(query) {
        return fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query}&key=${process.env.REACT_APP_GOOGLE_KEY}`).then((res) => {
            return res.json()
        });
    }

    getSpotifyTracks(token) {
        return fetch('https://api.spotify.com/v1/me/tracks', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then((res) => {
            return res.json();
        });
    }

    authToSpotify() {
        const url = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.href)}&scope=user-library-read&response_type=token&state=spotify`;
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


    loginToSpotify() {
        return (
            <Fragment>
                <h2>Step 1</h2>
                <p>Allow Access to your Spotify Account</p>
                <Button onClick={this.authToSpotify} variant="contained" color="primary">Connect to Spotify</Button>
            </Fragment>
        )
    }

    render() {
        if (this.state.videos.length > 0) {
            return (
                <Fragment>
                    <h2>Step 2</h2>
                    <p>Allow Access to your Youtube Account</p>
                    <ul>
                        {this.state.videos.map(video => {
                            return (<li key={video.items[0].id.videoId}>
                                <a target={'_blank'}
                                   href={'https://www.youtube.com/watch?v=' + video.items[0].id.videoId}>
                                    {video.items[0].snippet.title}
                                </a>
                            </li>)
                        })}
                    </ul>
                </Fragment>
            )
        } else {
            return this.loginToSpotify();
        }
    }
}