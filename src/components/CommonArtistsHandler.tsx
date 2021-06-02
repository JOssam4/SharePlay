/**
 * This component is meant to be called by AnalysisScreen. It will find the common artists between the users, and display them.
 * It will also generate a playlist, but i'm still figuring out the details about that.
 * My guess is when 2 users share an artist, it will grab all songs by the artist in each of the datasets and add them to the playlist.
 * */

import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import {
  MinifiedTrackType, MapTrackValue, LoadArtistTrackType, MapArtistValue,
} from '../Helpers/OtherTypes';
// import SharedDataView from './SharedDataView';
import { MinArtistType/* , TrackArtistType */ } from '../Helpers/SpotifyAPITypes';

import '../styles/AnalysisScreen.css';

interface Props {
  authToken: string,
  currentUser: string,
  currentUserPlaylistIDs: string[],
  otherUserPlaylistIDs: string[],
  topTracks: MinifiedTrackType[],
  savedTracks: MinifiedTrackType[],
  userSearchedFor: string,
}

interface State {
  currentUserTrackMap: Map<string, MapTrackValue>,
  currentUserArtistMap: Map<string, MapArtistValue[]>,
  finishedComparing: boolean,
  sharedPlaylist: any,
  sharedTracks: Map<string, MapTrackValue>,
  sharedArtists: Map<string, MapArtistValue[]>
  compareButtonDisabled: boolean,
}

type trackObject = {
  track: {
    artists: MinArtistType[],
    id: string,
    name: string,
  },
};

class CommonArtistsHandler extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentUserTrackMap: new Map<string, MapTrackValue>(),
      currentUserArtistMap: new Map<string, MapArtistValue[]>(),
      sharedTracks: new Map<string, MapTrackValue>(),
      // v-- this error is wrong. sharedArtists is used in compareArtists, and after testing I've seen that it works.
      // eslint-disable-next-line react/no-unused-state
      sharedArtists: new Map<string, MapArtistValue[]>(),
      // eslint-disable-next-line react/no-unused-state
      sharedPlaylist: null,
      finishedComparing: false,
      compareButtonDisabled: false,
    };
    this.loadTrackData = this.loadTrackData.bind(this);
    this.loadArtistData = this.loadArtistData.bind(this);
    this.compareTracks = this.compareTracks.bind(this);
    this.compareArtists = this.compareArtists.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
    this.loadAndCompare = this.loadAndCompare.bind(this);
  }

  loadTrackData() {
    const currentUserTracks = new Map();
    if (this.props.savedTracks) {
      this.props.savedTracks.forEach((track: MinifiedTrackType) => {
        currentUserTracks.set(track.id, { name: track.name, artists: track.artists });
      });
    }
    if (this.props.topTracks) {
      this.props.topTracks.forEach((track) => {
        currentUserTracks.set(track.id, { name: track.name, artists: track.artists });
      });
    }
    if (this.props.currentUserPlaylistIDs.length > 0) {
      this.props.currentUserPlaylistIDs.forEach((playlistID) => {
        fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks?fields=items(track.id,track.name)`, {
          headers: {
            Authorization: `Bearer ${this.props.authToken}`,
          },
        }).then((resp) => {
          resp.json().then((respjson) => {
            // @ts-ignore
            respjson.items.forEach((trackObj) => {
              if (trackObj.track && trackObj.track.id && trackObj.track.name) {
                currentUserTracks.set(trackObj.track.id, trackObj.track.name);
              }
            });
            this.setState({ currentUserTrackMap: currentUserTracks }); // This will cause the state to update as many times as there are playlists, but at least it works. This code severely needs an async/await.
          });
        });
      });
    } else {
      // Current user playlist data not read.
      this.setState({ currentUserTrackMap: currentUserTracks });
    }
  }

  loadArtistData() {
    const artistMap = new Map<string, MapArtistValue[]>();
    // const artistObj = {};
    if (this.props.savedTracks) {
      this.props.savedTracks.forEach((track: MinifiedTrackType) => {
        // currentUserTracks.set(track.id, { name: track.name, artists: track.artists });
        track.artists.forEach((artist: string) => {
          if (!artistMap.has(artist)) {
            artistMap.set(artist, [{ name: track.name, id: track.id }]);
          } else if (artistMap.has(artist)) {
            // @ts-ignore
            artistMap.set(artist, artistMap.get(artist).concat({ name: track.name, id: track.id }));
          }
        });
      });
    }
    if (this.props.topTracks) {
      this.props.topTracks.forEach((track) => {
        // currentUserTracks.set(track.id, { name: track.name, artists: track.artists });
        // eslint-disable-next-line no-restricted-syntax
        for (const artist of track.artists) {
          if (artistMap.has(artist)) {
            // @ts-ignore
            artistMap.set(artist, artistMap.get(artist).concat({ name: track.name, id: track.id })); // add track id to array in artist map
          } else {
            artistMap.set(artist, [{ name: track.name, id: track.id }]);
          }
        }
      });
    }
    if (this.props.currentUserPlaylistIDs.length > 0) {
      this.props.currentUserPlaylistIDs.forEach((playlistID) => {
        fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks?fields=items(track.id,track.name,track.artists)`, {
          headers: {
            Authorization: `Bearer ${this.props.authToken}`,
          },
        }).then((resp) => {
          resp.json().then((respjson) => {
            // @ts-ignore
            respjson.items.forEach((trackObj: LoadArtistTrackType) => {
              if (trackObj.track?.id && trackObj.track?.name) {
                // currentUserTracks.set(trackObj.track.id, trackObj.track.name);
                // eslint-disable-next-line no-restricted-syntax
                for (const artist of trackObj.track.artists) {
                  if (artistMap.has(artist.name)) {
                    // @ts-ignore
                    artistMap.set(artist.name, artistMap.get(artist.name).concat({ name: trackObj.track.name, id: trackObj.track.id }));
                  } else {
                    artistMap.set(artist.name, [{ name: trackObj.track.name, id: trackObj.track.id }]);
                  }
                }
              }
            });
            this.setState({ currentUserArtistMap: artistMap }); // This will cause the state to update as many times as there are playlists, but at least it works. This code severely needs an async/await.
          });
        });
      });
    }
  }

  compareTracks() {
    const sharedTracks = new Map();
    if (this.state.currentUserTrackMap) {
      this.props.otherUserPlaylistIDs.forEach((playlistID: string) => {
        fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks?fields=items(track.id,track.name,track.artists)`, {
          headers: {
            Authorization: `Bearer ${this.props.authToken}`,
          },
        }).then((resp) => {
          resp.json().then((respjson) => {
            // @ts-ignore
            respjson.items.forEach((trackObj: trackObject) => {
              if (trackObj.track && trackObj.track.id) {
                if (this.state.currentUserTrackMap.has(trackObj.track.id)) {
                  sharedTracks.set(trackObj.track.id, { name: trackObj.track.name, artists: trackObj.track.artists });
                }
              }
            });
            this.setState({ sharedTracks, finishedComparing: true });
          });
        });
      });
    }
  }

  compareArtists() {
    const sharedArtists = new Map<string, MapArtistValue[]>();
    if (this.state.currentUserArtistMap) {
      this.props.otherUserPlaylistIDs.forEach((playlistID: string) => {
        fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks?fields=items(track.id,track.name,track.artists)`, {
          headers: {
            Authorization: `Bearer ${this.props.authToken}`,
          },
        }).then((resp) => {
          resp.json().then((respjson) => {
            // @ts-ignore
            respjson.items.forEach((trackObj: trackObject) => {
              if (trackObj.track && trackObj.track.id) {
                // eslint-disable-next-line no-restricted-syntax
                for (const each of trackObj.track.artists) {
                  if (this.state.currentUserArtistMap.has(each.name)) {
                    trackObj.track.artists.forEach((artist) => {
                      if (sharedArtists.has(artist.name)) {
                        // @ts-ignore
                        sharedArtists.set(artist.name, sharedArtists.get(artist.name).concat({ name: trackObj.track.name, id: trackObj.track.id }));
                      } else {
                        sharedArtists.set(artist.name, [{ name: trackObj.track.name, id: trackObj.track.id }]);
                      }
                    });
                  }
                }
                sharedArtists.forEach((value, artistName) => {
                  if (this.state.currentUserArtistMap.has(artistName)) {
                    // @ts-ignore
                    sharedArtists.set(artistName, sharedArtists.get(artistName).concat(this.state.currentUserArtistMap.get(artistName)));
                  }
                });
              }
            });
            // eslint-disable-next-line react/no-unused-state
            this.setState({ finishedComparing: true, sharedArtists });
          });
        });
      });
    }
  }

  createPlaylist() {
    fetch(`https://api.spotify.com/v1/users/${this.props.currentUser}/playlists`, {
      method: 'post',
      headers: { Authorization: `Bearer ${this.props.authToken}` },
      body: JSON.stringify({
        name: `${this.props.userSearchedFor} and me`,
        description: `Shared playlist with ${this.props.userSearchedFor}`,
        public: false,
      }),
    }).then((resp) => {
      resp.json().then((respjson) => {
        this.fillPlaylist(respjson.id);
      });
      // eslint-disable-next-line no-unused-vars
    }).catch((err) => null);
  }

  fillPlaylist(sharedPlaylistID: string): boolean {
    if (sharedPlaylistID) {
      const uris: string[] = [];
      this.state.sharedTracks.forEach((songName, id) => {
        uris.push(`spotify:track:${id}`);
      });
      // eslint-disable-next-line no-unused-vars
      fetch(`https://api.spotify.com/v1/playlists/${sharedPlaylistID}/tracks?uris=${uris}`, { method: 'post', headers: { Authorization: `Bearer ${this.props.authToken}` } }).then((resp) => {
        // eslint-disable-next-line react/no-unused-state
        this.setState({ sharedPlaylist: sharedPlaylistID });
        return true;
        // eslint-disable-next-line no-unused-vars
      }).catch((err) => false);
    }
    return false;
  }

  loadAndCompare() {
    this.setState({ compareButtonDisabled: true });
    // this.loadTrackData();
    this.loadArtistData();
    // this.compareTracks();
    this.compareArtists();
  }

  render() {
    if (this.state.finishedComparing && this.state.sharedTracks.size === 0) {
      return (
        <div>
          <h3>Sorry, no shared artists found.</h3>
        </div>
      );
    }
    /*
    return (
      <div className="comparisonView">
        <Button onClick={this.loadAndCompare} variant="primary" id="compare-button" disabled={this.state.compareButtonDisabled}>Compare Tracks</Button>
        {this.state.sharedTracks.size > 0
        && <SharedDataView sharedTracks={this.state.sharedTracks} playlistGenerator={this.createPlaylist} />}
      </div>
    );
     */
    return (
      <div className="comparisonView">
        <Button onClick={this.loadAndCompare} variant="primary" id="compare-button" disabled={this.state.compareButtonDisabled}>Compare Artists</Button>
      </div>
    );
  }
}

// @ts-ignore
CommonArtistsHandler.propTypes = {
  currentUser: PropTypes.string.isRequired,
  userSearchedFor: PropTypes.string.isRequired,
  topTracks: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })).isRequired,
  savedTracks: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })).isRequired,
  currentUserPlaylistIDs: PropTypes.arrayOf(PropTypes.string).isRequired,
  otherUserPlaylistIDs: PropTypes.arrayOf(PropTypes.string).isRequired,
  authToken: PropTypes.string.isRequired,
};

export default CommonArtistsHandler;
