import React, {Component} from 'react';
import './App.css';
import {Header} from "./Header";
import {Grommet, Box, Heading} from 'grommet';
import * as Themes from 'grommet/themes'
import {Steps} from "./Steps";


class App extends Component {

    render() {
        return (
            <Grommet theme={Themes.Grommet} full={true}>
                <Header/>
                <Box flex={true} pad='medium' overlow="auto" alignContent="start">
                    <Heading level={3} margin='none'>
                        <strong>User Information</strong>
                    </Heading>
                    <p>Generate a Playlist out your choosen Playlist or liked Tracks on Youtube</p>
                    <Steps/>
                </Box>

            </Grommet>
        );
    }
}

export default App;
