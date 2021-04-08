import React, { Component } from 'react';

import { connect } from 'react-redux';
// import { setUseTopTracks, setUsePlaylists } from "../../actions";

import { RouteComponentProps } from 'react-router';

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import NavigationBar from '../components/NavigationBar';

interface Props {
    authToken: string,
    dispatch: Function,
    history: RouteComponentProps['history'],
    location: RouteComponentProps['location'],
    match: RouteComponentProps['match'],
    staticContext: any,
    usePlaylists: any,
    useTopTracks: any,
}

interface State {
  // eslint-disable-next-line camelcase
    short_term: boolean,
  // eslint-disable-next-line camelcase
    medium_term: boolean,
  // eslint-disable-next-line camelcase
    long_term: boolean,
    recentlyListenedTo: boolean,
    usePlaylists: boolean,
    useSavedTracks: boolean,

}

class SettingsScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // let usePlaylists = this.props.usePlaylists;
    const usePlaylists: string | boolean | null = sessionStorage.getItem('usePlaylists');
    let usePlaylistsBool: boolean;
    if (usePlaylists === undefined || usePlaylists === null || usePlaylists === 'true') {
      usePlaylistsBool = true;
    } else if (usePlaylists === 'false') {
      usePlaylistsBool = false;
    } else {
      usePlaylistsBool = true;
    }

    let shortTerm = false;
    let mediumTerm = false;
    let longTerm = false;

    // let useTopTracks = this.props.useTopTracks;
    let useTopTracks: string | boolean | null = sessionStorage.getItem('useTopTracks');
    if (useTopTracks === undefined || useTopTracks === null) {
      useTopTracks = false;
    }

    if (useTopTracks === 'short_term' || useTopTracks === 'true') { // checking if it === "true" because in that event, the option is switched on, but no option is selected.
      sessionStorage.setItem('useTopTracks', 'short_term'); // Just make sure it gets set right
      shortTerm = true;
    } else if (useTopTracks === 'medium_term') {
      mediumTerm = true;
    } else if (useTopTracks === 'long_term') {
      longTerm = true;
    } else if (useTopTracks === 'false') {
      useTopTracks = false;
    }

    const useSavedTracks: string | null = sessionStorage.getItem('useSavedTracks');
    let useSavedTracksBool: boolean;
    if (useSavedTracks === 'true') {
      useSavedTracksBool = true;
    } else if (useSavedTracks === 'false' || useSavedTracks === undefined || useSavedTracks === null) {
      useSavedTracksBool = false;
    } else {
      useSavedTracksBool = true;
    }

    this.state = {
      usePlaylists: usePlaylistsBool,
      recentlyListenedTo: Boolean(useTopTracks),
      short_term: shortTerm,
      medium_term: mediumTerm,
      long_term: longTerm,

      useSavedTracks: useSavedTracksBool,
    };
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
  }

  componentDidMount() {
    // Since we did some figuring in the constructor to set default state of usePlaylists and recentlyListenedTo, make sure they get pushed into the redux store.
    // this.props.dispatch(setUseTopTracks(this.state.recentlyListenedTo));
    // this.setUseTopTracks(this.state.recentlyListenedTo)
    this.setUseTopTracks(String(false));
    // this.props.dispatch(setUsePlaylists(this.state.usePlaylists));
    this.setUsePlaylists(this.state.usePlaylists);
  }

  handleSwitchChange(event: any) {
    // event.persist(); // Makes it so I can go into the console and debug the event.
    const targetName = event.target.name;
    // @ts-ignore
    if (targetName === 'recentlyListenedTo' && this.state[event.target.name] === true) {
      // Have to disable short_term, medium_term, and long_term if parent switch turned off.
      // this.props.dispatch(setUseTopTracks(false));
      this.setUseTopTracks(String(false));
      this.setState({
        short_term: false, medium_term: false, long_term: false, recentlyListenedTo: false,
      });
    } else { // @ts-ignore
      // eslint-disable-next-line no-lonely-if
      if (targetName === 'recentlyListenedTo' && this.state[event.target.name] === false) {
        // User clicked on switch to turn on recently listened to tracks. So, use the short_term radio box as a default.
        // this.props.dispatch(setUseTopTracks('short_term'));
        this.setUseTopTracks('short_term');
        this.setState({ short_term: true, recentlyListenedTo: true });
      } else if (targetName === 'useSavedTracks') {
        this.setUseSavedTracks(!this.state.useSavedTracks);
        this.setState({ useSavedTracks: !this.state.useSavedTracks });
      } else {
        // this.props.dispatch(setUsePlaylists(event.target.checked));
        this.setUsePlaylists(event.target.checked);
        this.setState({ ...this.state, [event.target.name]: event.target.checked });
      }
    }
  }

  handleRadioChange(event: any) {
    // event.persist(); // Makes it so I can go into the console and debug the event.
    if (event.target.name === 'short_term') {
      // this.props.dispatch(setUseTopTracks('short_term'));
      this.setUseTopTracks('short_term');
      this.setState({ short_term: true, medium_term: false, long_term: false });
    } else if (event.target.name === 'medium_term') {
      // this.props.dispatch(setUseTopTracks('medium_term'));
      this.setUseTopTracks('medium_term');
      this.setState({ short_term: false, medium_term: true, long_term: false });
    } else if (event.target.name === 'long_term') {
      // this.props.dispatch(setUseTopTracks('long_term'));
      this.setUseTopTracks('long_term');
      this.setState({ short_term: false, medium_term: false, long_term: true });
    } else {
      throw new Error(`event target name not recognized: ${event.target.name}`);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  setUseTopTracks(timeFrame: string) {
    sessionStorage.setItem('useTopTracks', timeFrame);
  }

  // eslint-disable-next-line class-methods-use-this
  setUsePlaylists(usePlaylists: boolean) {
    sessionStorage.setItem('usePlaylists', String(usePlaylists));
  }

  // eslint-disable-next-line class-methods-use-this
  setUseSavedTracks(useSavedTracks: any) {
    sessionStorage.setItem('useSavedTracks', useSavedTracks);
  }

  render() {
    const recentlyPlayedTimeframe = (
      <RadioGroup aria-label="time_frame" name="time_frame" onChange={this.handleRadioChange}>
        <FormControlLabel value="short_term" name="short_term" control={<Radio checked={Boolean(this.state.short_term)} />} label="Last 4 weeks" />
        <FormControlLabel value="medium_term" name="medium_term" control={<Radio checked={Boolean(this.state.medium_term)} />} label="Last 6 months" />
        <FormControlLabel value="long_term" name="long_term" control={<Radio checked={Boolean(this.state.long_term)} />} label="Last several years" />
      </RadioGroup>
    );

    return (
      <div className="settingsScreenWrapper">
        <NavigationBar activeScreen="settings" />
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
          <FormControlLabel control={<Switch checked={Boolean(this.state.recentlyListenedTo)} onChange={this.handleSwitchChange} name="recentlyListenedTo" inputProps={{ 'aria-label': 'secondary checkbox' }} />} label="Use recently listened to tracks for matchmaking" />
        </div>
        <div style={{ marginLeft: '5%' }}>
          {this.state.recentlyListenedTo
                    && recentlyPlayedTimeframe}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  authToken: state.authToken,
  usePlaylists: state.usePlaylists,
  useTopTracks: state.useTopTracks,

});

export default connect(mapStateToProps)(SettingsScreen);
