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
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import Grid from "@material-ui/core/Grid/Grid";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Player from 'react-lazy-youtube'
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

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
    }
});

class Playlist extends React.Component {
    state = {
        open: true,
        playlists: [],
        songs: [],
        videos: {}
    };


    constructor(props) {
        super(props);
        this.spotify = new SpotifyWebApi();
        this.spotify.setAccessToken(props.authData.access_token);

        this.spotify.getUserPlaylists().then(data => {
            this.setState({playlists: data.items})
        });

        this.spotify.getMySavedTracks().then(data => {
            this.getYoutubeVideos(data);
        });
    }

    getYoutubeVideos(data) {
        data.items.forEach(item => {
            this.getYoutubeBestResult(item.track.name + ' ' + item.track.artists[0].name).then(video => {
                this.setState(prevState => ({
                    songs: [...prevState.songs, {spotify: item, youtube: video.items[0]}]
                }));
            });
        });
    }

    getYoutubeBestResult(query) {
        return fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&fields=items(id)&maxResults=1&q=${query}&key=${process.env.REACT_APP_GOOGLE_KEY}`).then((res) => {
            return res.json()
        });
    }

    loadPlaylist(playlist) {
        this.setState({songs: []});
        this.spotify.getPlaylistTracks(playlist).then(data => {
            this.getYoutubeVideos(data);
        });
    }


    Playlists(playlists) {
        return (<List>
            <ListSubheader>Bibliothek</ListSubheader>
            {playlists.map((playlist) => (
                <ListItem button key={playlist.id} onClick={this.loadPlaylist.bind(this, playlist.id)}>
                    <ListItemText primary={playlist.name}/>
                </ListItem>
            ))}
        </List>);
    }

    TrackRow(item) {
        return (
            <ExpansionPanel>
                <ExpansionPanelSummary>
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                    >
                        <Grid item xs={5}>{item.spotify.track.name}</Grid>
                        <Grid item xs>{item.spotify.track.artists.map(artist => (artist.name)).join(', ')}</Grid>
                        <Grid item xs>{item.spotify.track.album.name}</Grid>
                        <Grid item xs={1}> {(new Date(item.spotify.added_at)).toLocaleDateString()}</Grid>
                    </Grid>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Player id={item.youtube.id.videoId}/>
                </ExpansionPanelDetails>
            </ExpansionPanel>
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
                    <Card>
                        <CardContent>
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="center"
                            >
                                <Grid item xs={5}>Name</Grid>
                                <Grid item xs>Artist</Grid>
                                <Grid item xs>Album</Grid>
                                <Grid item xs={1}>Added</Grid>
                            </Grid>
                        </CardContent>
                        {songs.length === 0 &&
                        <CardContent>
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="center"
                            >
                                <CircularProgress/>
                            </Grid>
                        </CardContent>
                        }
                    </Card>
                    {songs.map(item => this.TrackRow(item))}
                    {/*</ExpansionPanel>*/}
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
