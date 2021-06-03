/**
 * This component is meant to be called by AnalysisScreen. It will find the common artists between the users, and display them.
 * It will also generate a playlist, but i'm still figuring out the details about that.
 * My guess is when 2 users share an artist, it will grab all songs by the artist in each of the datasets and add them to the playlist.
 * */

import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import {
  MinifiedTrackType, LoadArtistTrackType, MapArtistValue,
} from '../Helpers/OtherTypes';
import SharedDataViewArtists from './SharedDataViewArtists';
import { MinArtistType /* , TrackArtistType */ } from '../Helpers/SpotifyAPITypes';

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
  currentUserArtistMap: Map<string, MapArtistValue[]>,
  finishedComparing: boolean,
  sharedPlaylist: string | null, // the ID of the Spotify playlist
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
      currentUserArtistMap: new Map<string, MapArtistValue[]>(),
      sharedArtists: new Map<string, MapArtistValue[]>(),
      // eslint-disable-next-line react/no-unused-state
      sharedPlaylist: null, // keeping this in in case we eventually add functionality where we need the id
      finishedComparing: false,
      compareButtonDisabled: false,
    };
    this.loadArtistData = this.loadArtistData.bind(this);
    this.compareArtists = this.compareArtists.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
    this.loadAndCompare = this.loadAndCompare.bind(this);
  }

  loadArtistData() {
    const artistMap = new Map<string, MapArtistValue[]>();
    if (this.props.savedTracks) {
      this.props.savedTracks.forEach((track: MinifiedTrackType) => {
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
        track.artists.forEach((artist) => {
          if (artistMap.has(artist)) {
            // @ts-ignore
            artistMap.set(artist, artistMap.get(artist).concat({ name: track.name, id: track.id })); // add track id to array in artist map
          } else {
            artistMap.set(artist, [{ name: track.name, id: track.id }]);
          }
        });
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
                trackObj.track.artists.forEach((artist) => {
                  if (artistMap.has(artist.name)) {
                    // @ts-ignore
                    artistMap.set(artist.name, artistMap.get(artist.name).concat({ name: trackObj.track.name, id: trackObj.track.id }));
                  } else {
                    artistMap.set(artist.name, [{ name: trackObj.track.name, id: trackObj.track.id }]);
                  }
                });
              }
            });
            this.setState({ currentUserArtistMap: artistMap }); // This will cause the state to update as many times as there are playlists, but at least it works. This code severely needs an async/await.
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
                trackObj.track.artists.forEach((each) => {
                  if (this.state.currentUserArtistMap.has(each.name)) {
                    if (sharedArtists.has(each.name)) {
                      // @ts-ignore
                      if (!sharedArtists.get(each.name).includes({ name: trackObj.track.name, id: trackObj.track.id })) {
                        // @ts-ignore
                        sharedArtists.set(each.name, Array.from(new Set(sharedArtists.get(each.name).concat({ name: trackObj.track.name, id: trackObj.track.id }))));
                      }
                    } else {
                      sharedArtists.set(each.name, [{ name: trackObj.track.name, id: trackObj.track.id }]);
                    }
                  }
                });
                sharedArtists.forEach((value, artistName) => {
                  if (this.state.currentUserArtistMap.has(artistName)) {
                    // @ts-ignore
                    this.state.currentUserArtistMap.get(artistName).forEach((myTrack) => {
                      // @ts-ignore
                      if (!sharedArtists.get(artistName).includes(myTrack)) {
                        // @ts-ignore
                        sharedArtists.set(artistName, Array.from(new Set(sharedArtists.get(artistName).concat(myTrack))));
                      }
                    });
                  }
                });
              }
            });
            sharedArtists.forEach((value, artistName) => {
              sharedArtists.set(artistName, this.uniqueify(value));
            });
            this.setState({ finishedComparing: true, sharedArtists });
          });
        });
      });
    }
  }

  /**
   * Sometimes (and by sometimes I mean all the time), a track obj {name, id} will be repeated multiple times within the same set associated with an artist.
   * The purpose of this function is to make sure each track object in the array is unique.
   * */
  // eslint-disable-next-line class-methods-use-this
  uniqueify(trackObjArray: MapArtistValue[]): MapArtistValue[] {
    const trackObjMap = new Map<string, MapArtistValue>();
    trackObjArray.forEach((trackObj: MapArtistValue) => {
      if (!trackObjMap.has(trackObj.name)) { // Using name here instead of id because if two tracks are by the same artist with the same name, they're probably the same song, whereas id's can be different (like with re-releases)
        trackObjMap.set(trackObj.name, trackObj);
      }
    });
    return Array.from(trackObjMap.values());
  }

  createPlaylist() {
    fetch(`https://api.spotify.com/v1/users/${this.props.currentUser}/playlists`, {
      method: 'post',
      headers: { Authorization: `Bearer ${this.props.authToken}` },
      body: JSON.stringify({
        name: `${this.props.userSearchedFor} and me (artists)`,
        description: `Shared playlist with ${this.props.userSearchedFor}`,
        public: false,
      }),
    }).then((resp) => {
      resp.json().then((respjson) => {
        this.fillPlaylist(respjson.id);
      });
    }).catch(() => null);
  }

  fillPlaylist(sharedPlaylistID: string): boolean {
    if (sharedPlaylistID) {
      const uris: string[] = [];
      this.state.sharedArtists.forEach((trackList) => {
        trackList.forEach((trackObj: MapArtistValue) => {
          uris.push(`spotify:track:${trackObj.id}`);
        });
      });
      fetch(`https://api.spotify.com/v1/playlists/${sharedPlaylistID}/tracks?uris=${uris}`, { method: 'post', headers: { Authorization: `Bearer ${this.props.authToken}` } }).then(() => {
        // eslint-disable-next-line react/no-unused-state
        this.setState({ sharedPlaylist: sharedPlaylistID });
        return true;
      }).catch(() => false);
    }
    return false;
  }

  loadAndCompare() {
    this.setState({ compareButtonDisabled: true });
    this.loadArtistData();
    this.compareArtists();
  }

  render() {
    if (this.state.finishedComparing && this.state.sharedArtists.size === 0) {
      return (
        <div>
          <h3>Sorry, no shared artists found.</h3>
        </div>
      );
    }
    return (
      <div className="comparisonView">
        <Button onClick={this.loadAndCompare} variant="primary" id="compare-button" disabled={this.state.compareButtonDisabled}>Compare Artists</Button>
        {this.state.sharedArtists.size > 0
        && <SharedDataViewArtists sharedArtists={this.state.sharedArtists} playlistGenerator={this.createPlaylist} />}
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
