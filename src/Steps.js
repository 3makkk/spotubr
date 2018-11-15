import React, { Component, Fragment } from 'react';
import { Button } from '@material-ui/core';

export class Steps extends Component {

    constructor(props) {
        super(props);
        this.authToSpotify = this.authToSpotify.bind(this);
        this.state = { step: 0 }
    }

    componentDidMount() {
        const hash = window.location.hash.substr(1);

        if (hash) {
            const result = this.decodeQueryString(hash);

            if (result.state === 'spotify') {
                this.setState({ step: 1 });
                this.getSpotifyTracks(result.access_token).then((tracks) => {
                    this.setState({tracks: tracks, step: 1});

                    const promises = tracks.items.map(item => {
                        return this.getYoutubeBestResult(item.track.name + ' ' + item.track.artists[0].name)
                    });
                     Promise.all(promises).then(
                        (res) => {
                            this.setState({
                                videos: res ,
                                step: 2
                            })
                        }
                    );
                })
            }
        }
    }

    getYoutubeBestResult(query) {
        return fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q='+query+'&key=AIzaSyCZ_jZnidYQ4rXC35YGp5baencNZ3i0F9c').then((res) => {
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
        const url = `https://accounts.spotify.com/authorize?client_id=3b4af6bbede345b49ed61dada982a3d6&redirect_uri=${encodeURIComponent(window.location.href)}&scope=user-library-read&response_type=token&state=spotify`;
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
        const tracks = this.state.tracks;
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
                        <pre>{JSON.stringify(tracks)}</pre>
                    </Fragment>
                )
            }
            case 2:
                return (
                    <Fragment>
                        <h2>Step 2</h2>
                        <p>Allow Access to your Youtube Account</p>
                        <ul>
                            {this.state.videos.map(video => {
                                return (<li><a target={'_blank'} href={'https://www.youtube.com/watch?v=' + video.items[0].id.videoId}>{video.items[0].snippet.title}</a></li>)
                            })}
                        </ul>
                    </Fragment>
                )
        }
    }
}