import React from 'react';
import Login from './features/login/components/Login'
import Player from './features/player/components/Playlist';

export default class App extends React.PureComponent {
    constructor(props) {
        super(props);
        this.showPlayer = this.showPlayer.bind(this);
        this.state = {loggedIn: false}
    }

    showPlayer(auth) {
        this.setState({loggedIn: true, auth: auth})
    }

    render() {
        const loggedIn = this.state.loggedIn;

        return (loggedIn? <Player authData={this.state.auth} />: <Login onAuth={this.showPlayer}/>);
    }
}