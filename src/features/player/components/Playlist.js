import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import SpotifyWebApi from 'spotify-web-api-js'
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import Paper from "@material-ui/core/Paper/Paper";

const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
});

class Playlist extends React.Component {
    state = {
        open: true,
        playlists: [],
        songs: [],
    };

    constructor(props) {
        super(props);
        const spotify = new SpotifyWebApi();
        spotify.setAccessToken(props.authData.access_token);

        spotify.getUserPlaylists().then(data => {
            this.setState({playlists: data.items})
        });

        spotify.getMySavedTracks().then(data => {
            this.setState({songs: data.items})
        });
    }


    Playlists(playlists) {
        return (<List>
            <ListSubheader>Bibliothek</ListSubheader>
            {playlists.map((playlist) => (
                <ListItem button key={playlist.name}>
                    <ListItemText primary={playlist.name}/>
                </ListItem>
            ))}
        </List>);
    }

    TrackRow(item) {
        return (
            <TableRow>
                <TableCell>{item.track.name}</TableCell>
                <TableCell>{item.track.artists.map(artist => (artist.name)).join(', ')}</TableCell>
                <TableCell>{item.track.album.name}</TableCell>
                <TableCell> {(new Date(item.added_at)).toLocaleDateString()}</TableCell>
            </TableRow>
        )
    }

    render() {
        const {classes} = this.props;
        const {open, playlists, songs} = this.state;

        return (
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar
                    position="fixed"
                    className={classNames(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar disableGutters={!open}>
                        <Typography variant="h6" color="inherit" noWrap>
                            Songs
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <Divider/>
                    <List>
                        <ListSubheader>Library</ListSubheader>
                        {['Songs', 'Album'].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemText primary={text}/>
                            </ListItem>
                        ))}
                    </List>
                    <Divider/>
                    {this.Playlists(playlists)}
                </Drawer>
                <main
                    className={classNames(classes.content, {
                        [classes.contentShift]: open,
                    })}
                >
                    <div className={classes.drawerHeader}/>
                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Artist</TableCell>
                                    <TableCell>Album</TableCell>
                                    <TableCell>Added</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {songs.map(item => this.TrackRow(item))}
                            </TableBody>
                        </Table>
                    </Paper>
                </main>
            </div>
        );
    }
}

Playlist.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(Playlist);
