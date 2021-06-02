import React, { Component } from 'react';

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import { connect } from 'react-redux';
import {
  setUsePlaylists, setUseSavedTracks, setUseTopTracks, setMode, TRACK_MODE, ARTIST_MODE,
} from '../actions';
import { DispatchType, StoreType } from '../store';

interface Props {
  usePlaylists: boolean,
  useTopTracks: boolean,
  topTracksTimeframe: string | null,
  useSavedTracks: boolean,
  // eslint-disable-next-line no-unused-vars
  setUsePlaylists: (use: boolean) => void,
  // eslint-disable-next-line no-unused-vars
  setUseSavedTracks: (use: boolean) => void,
  // eslint-disable-next-line no-unused-vars
  setUseTopTracks: (use: boolean, frame: string | null) => void,
  mode: string,
  // eslint-disable-next-line no-unused-vars
  setMode: (mode: string) => void,
}

interface State {
  usePlaylists: boolean,
  useSavedTracks: boolean,
  useTopTracks: boolean,
  topTracksTimeframe: string | null,
  mode: string,
}

class SettingsView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      usePlaylists: props.usePlaylists,
      useTopTracks: props.useTopTracks,
      topTracksTimeframe: props.topTracksTimeframe,
      useSavedTracks: props.useSavedTracks,
      mode: props.mode,
    };
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
  }

  handleSwitchChange(event: any) {
    // event.persist(); // Makes it so I can go into the console and debug the event.
    const targetName = event.target.name;
    // @ts-ignore
    if (targetName === 'useTopTracks' && this.state[event.target.name] === true) {
      // Have to disable short_term, medium_term, and long_term if parent switch turned off.
      this.props.setUseTopTracks(false, null);
      this.setState({ useTopTracks: false, topTracksTimeframe: null });
    } else { // @ts-ignore
      // eslint-disable-next-line no-lonely-if
      if (targetName === 'useTopTracks' && this.state[event.target.name] === false) {
        // User clicked on switch to turn on recently listened to tracks. So, use the short_term radio box as a default.
        this.props.setUseTopTracks(true, 'short_term');
        this.setState({ topTracksTimeframe: 'short_term', useTopTracks: true });
      } else if (targetName === 'useSavedTracks') {
        this.props.setUseSavedTracks(!this.state.useSavedTracks);
        // eslint-disable-next-line react/no-access-state-in-setstate
        this.setState({ useSavedTracks: !this.state.useSavedTracks });
      } else if (targetName === 'mode') {
        if (this.state.mode === TRACK_MODE) {
          this.props.setMode(ARTIST_MODE);
          this.setState({ mode: ARTIST_MODE });
        } else {
          this.props.setMode(TRACK_MODE);
          this.setState({ mode: TRACK_MODE });
        }
      } else {
        this.props.setUsePlaylists(event.target.checked);
        this.setState({ ...this.state, [event.target.name]: event.target.checked });
      }
    }
  }

  handleRadioChange(event: any) {
    // event.persist(); // Makes it so I can go into the console and debug the event.
    if (event.target.name === 'short_term') {
      this.props.setUseTopTracks(true, 'short_term');
      this.setState({ topTracksTimeframe: 'short_term' });
    } else if (event.target.name === 'medium_term') {
      this.props.setUseTopTracks(true, 'medium_term');
      this.setState({ topTracksTimeframe: 'medium_term' });
    } else if (event.target.name === 'long_term') {
      this.props.setUseTopTracks(true, 'long_term');
      this.setState({ topTracksTimeframe: 'long_term' });
    } else {
      throw new Error(`event target name not recognized: ${event.target.name}`);
    }
  }

  render() {
    const recentlyPlayedTimeframe = (
      <RadioGroup aria-label="time_frame" name="time_frame" onChange={this.handleRadioChange}>
        <FormControlLabel value="short_term" name="short_term" control={<Radio checked={Boolean(this.state.topTracksTimeframe === 'short_term')} />} label="Last 4 weeks" />
        <FormControlLabel value="medium_term" name="medium_term" control={<Radio checked={Boolean(this.state.topTracksTimeframe === 'medium_term')} />} label="Last 6 months" />
        <FormControlLabel value="long_term" name="long_term" control={<Radio checked={Boolean(this.state.topTracksTimeframe === 'long_term')} />} label="Last several years" />
      </RadioGroup>
    );

    return (
      <div className="settingsScreenWrapper">
        <div>
          <h1>Options</h1>
        </div>
        <div style={{ marginLeft: '5%' }}>
          <FormControlLabel control={<Switch checked={Boolean(this.state.mode === ARTIST_MODE)} onChange={this.handleSwitchChange} name="mode" inputProps={{ 'aria-label': 'secondary checkbox' }} />} label="Artist Mode" />
        </div>
        <div style={{ marginLeft: '5%' }}>
          <FormControlLabel control={<Switch checked={Boolean(this.state.usePlaylists)} onChange={this.handleSwitchChange} name="usePlaylists" inputProps={{ 'aria-label': 'secondary checkbox' }} />} label="Use playlist data for matchmaking" />
        </div>
        <div style={{ marginLeft: '5%' }}>
          <FormControlLabel control={<Switch checked={Boolean(this.state.useSavedTracks)} onChange={this.handleSwitchChange} name="useSavedTracks" inputProps={{ 'aria-label': 'secondary checkbox' }} />} label="Use saved/liked tracks for matchmaking" />
        </div>
        <div style={{ marginLeft: '5%' }}>
          <FormControlLabel control={<Switch checked={Boolean(this.state.useTopTracks)} onChange={this.handleSwitchChange} name="useTopTracks" inputProps={{ 'aria-label': 'secondary checkbox' }} />} label="Use recently listened to tracks for matchmaking" />
          <div style={{ marginLeft: '5%' }}>
            {this.state.useTopTracks
                        && recentlyPlayedTimeframe}
          </div>
        </div>

      </div>
    );
  }
}

interface stateProps {
  usePlaylists: boolean,
  useTopTracks: boolean,
  topTracksTimeframe: string | null,
  useSavedTracks: boolean,
}

interface dispatchProps {
  setUsePlaylists: () => void,
  setUseTopTracks: () => void,
  setTopTracksTimeframe: () => void,
  setUseSavedTracks: () => void,
}

const mapStateToProps = (state: StoreType) => ({
  usePlaylists: state.usePlaylists,
  useTopTracks: state.useTopTracks,
  topTracksTimeframe: state.topTracksTimeframe,
  useSavedTracks: state.useSavedTracks,
  mode: state.mode,
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  setUsePlaylists: (usePlaylists: boolean) => dispatch(setUsePlaylists(usePlaylists)),
  setUseSavedTracks: (useSavedTracks: boolean) => dispatch(setUseSavedTracks(useSavedTracks)),
  setUseTopTracks: (useTopTracks: boolean, topTracksTimeframe: string | null) => dispatch(setUseTopTracks(useTopTracks, topTracksTimeframe)),
  setMode: (mode: string) => dispatch(setMode(mode)),
});

// @ts-ignore
export default connect<stateProps, dispatchProps, any>(mapStateToProps, mapDispatchToProps)(SettingsView);
