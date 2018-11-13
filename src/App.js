import React, { Component, Fragment } from 'react';
import './App.css';
import { Steps } from "./Steps";


class App extends Component {

    render() {
        return (
            <Fragment>
                <h1>
                    <strong>User Information</strong>
                </h1>
                <p>Generate a Playlist out your choosen Playlist or liked Tracks on Youtube</p>
                <Steps />
            </Fragment>
        );
    }
}

export default App;
