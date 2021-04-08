import React, { Component } from 'react';

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import { connect } from 'react-redux';
import {
  setUsePlaylists, setUseTopTracks, setTopTracksTimeframe, setUseSavedTracks,
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
  setUseTopTracks: (use: boolean) => void,
  // eslint-disable-next-line no-unused-vars
  setTopTracksTimeframe: (use: string | null) => void,
  // eslint-disable-next-line no-unused-vars
  setUseSavedTracks: (use: boolean) => void,
}

interface State {
  // eslint-disable-next-line camelcase
  // short_term: boolean,
  // eslint-disable-next-line camelcase
  // medium_term: boolean,
  // eslint-disable-next-line camelcase
  // long_term: boolean,
  // recentlyListenedTo: boolean,
  usePlaylists: boolean,
  useSavedTracks: boolean,
  useTopTracks: boolean,
  topTracksTimeframe: string | null,
}

class SettingsView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // let usePlaylists = this.props.usePlaylists;

    this.state = {
      // usePlaylists: usePlaylistsBool,
      usePlaylists: props.usePlaylists,
      // recentlyListenedTo: Boolean(useTopTracks),
      useTopTracks: props.useTopTracks,
      // short_term: shortTerm,
      // medium_term: mediumTerm,
      // long_term: longTerm,
      topTracksTimeframe: props.topTracksTimeframe,
      useSavedTracks: props.useSavedTracks,

      // useSavedTracks: useSavedTracksBool,
    };
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
  }

  componentDidMount() {
    // Since we did some figuring in the constructor to set default state of usePlaylists and recentlyListenedTo, make sure they get pushed into the redux store.
    // this.setUseTopTracks(this.state.recentlyListenedTo)
    // this.setUseTopTracks(String(false));
    this.props.setUseTopTracks(false);
    this.props.setTopTracksTimeframe(null);
    // this.setUsePlaylists(this.state.usePlaylists);
    this.props.setUsePlaylists(this.state.usePlaylists);
  }

  handleSwitchChange(event: any) {
    console.dir(event);
    event.persist(); // Makes it so I can go into the console and debug the event.
    const targetName = event.target.name;
    // @ts-ignore
    if (targetName === 'useTopTracks' && this.state[event.target.name] === true) {
      // Have to disable short_term, medium_term, and long_term if parent switch turned off.
      // this.setUseTopTracks(String(false));
      this.props.setUseTopTracks(false);
      this.props.setTopTracksTimeframe(null);
      console.log('turning off setUseTopTracks');
      /*
      this.setState({
        short_term: false, medium_term: false, long_term: false, recentlyListenedTo: false,
      });
       */
      this.setState({ useTopTracks: false, topTracksTimeframe: null });
    } else { // @ts-ignore
      // eslint-disable-next-line no-lonely-if
      if (targetName === 'useTopTracks' && this.state[event.target.name] === false) {
        // User clicked on switch to turn on recently listened to tracks. So, use the short_term radio box as a default.
        // this.setUseTopTracks('short_term');
        this.props.setUseTopTracks(true);
        this.props.setTopTracksTimeframe('short_term');
        this.setState({ topTracksTimeframe: 'short_term', useTopTracks: true });
      } else if (targetName === 'useSavedTracks') {
        // this.setUseSavedTracks(!this.state.useSavedTracks);
        this.props.setUseSavedTracks(!this.state.useSavedTracks);
        // eslint-disable-next-line react/no-access-state-in-setstate
        this.setState({ useSavedTracks: !this.state.useSavedTracks });
      } else {
        // this.setUsePlaylists(event.target.checked);
        this.props.setUsePlaylists(event.target.checked);
        this.setState({ ...this.state, [event.target.name]: event.target.checked });
      }
    }
  }

  handleRadioChange(event: any) {
    console.dir(event);
    event.persist(); // Makes it so I can go into the console and debug the event.
    if (event.target.name === 'short_term') {
      // this.setUseTopTracks('short_term');
      this.props.setUseTopTracks(true);
      this.props.setTopTracksTimeframe('short_term');
      this.setState({ topTracksTimeframe: 'short_term' });
    } else if (event.target.name === 'medium_term') {
      // this.setUseTopTracks('medium_term');
      this.props.setUseTopTracks(true);
      this.props.setTopTracksTimeframe('medium_term');
      this.setState({ topTracksTimeframe: 'medium_term' });
    } else if (event.target.name === 'long_term') {
      // this.setUseTopTracks('long_term');
      this.props.setUseTopTracks(true);
      this.props.setTopTracksTimeframe('long_term');
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
});

const mapDispatchToProps = (dispatch: DispatchType) => ({
  setUsePlaylists: (usePlaylists: boolean) => dispatch(setUsePlaylists(usePlaylists)),
  setUseTopTracks: (useTopTracks: boolean) => dispatch(setUseTopTracks(useTopTracks)),
  setTopTracksTimeframe: (topTracksTimeframe: string | null) => dispatch(setTopTracksTimeframe(topTracksTimeframe)),
  setUseSavedTracks: (useSavedTracks: boolean) => dispatch(setUseSavedTracks(useSavedTracks)),
});

// export default SettingsView;
// @ts-ignore
export default connect<stateProps, dispatchProps, any>(mapStateToProps, mapDispatchToProps)(SettingsView);
