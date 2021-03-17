import React, { Component } from 'react';

import { BrowserRouter as Router, Switch, Route, Link, RouteComponentProps } from 'react-router-dom';

import Callback from './screens/Callback';

import UserHomeScreen from './screens/UserHomeScreen';
import SearchScreen from './screens/SearchScreen';
import InitialScreen from './screens/InitialScreen';
import AnalysisScreen from './screens/AnalysisScreen';
import SettingsScreen from "./screens/SettingsScreen";

import { connect } from 'react-redux';


interface Props {
  authToken: string,
  history: RouteComponentProps['history'],
  location: RouteComponentProps['location'],
  match: RouteComponentProps['match'],
  setAuthToken: Function,
  staticContext: unknown,
}

interface State {
  currentUser: string | null,
  userSearchedFor: string | null,
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      userSearchedFor: null,
      currentUser: null,
    }
    this.onUserSearched = this.onUserSearched.bind(this);
  }

  onUserSearched(text: string) {
    this.setState({userSearchedFor: text});
  }

  render() {
    return (
        <Router>
          <Switch>
            <Route exact path="/callback" component={Callback}/>
            <Route exact path="/me" component={UserHomeScreen}/>
            <Route exact path="/search" component={SearchScreen}/>
            <Route exact path="/analysis" component={AnalysisScreen}/>
            <Route exact path="/settings" component={SettingsScreen}/>
            <Route exact path="/" component={InitialScreen}/>
          </Switch>
        </Router>
    );
  }
}


const mapStateToProps = (state: any) => ({
  authToken: state.authToken,
})

export default connect(mapStateToProps)(App);
