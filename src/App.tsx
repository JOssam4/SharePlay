import React from 'react';

import {
  BrowserRouter as Router, Route, Switch, // RouteComponentProps comes from here too
} from 'react-router-dom';

import { connect } from 'react-redux';
import Callback from './screens/Callback';

import UserHomeScreen from './screens/UserHomeScreen';
import SearchScreen from './screens/SearchScreen';
import InitialScreen from './screens/InitialScreen';
import AnalysisScreen from './screens/AnalysisScreen';
import SettingsScreen from './screens/SettingsScreen';

/*
interface Props {
  authToken: string,
  history: RouteComponentProps['history'],
  location: RouteComponentProps['location'],
  match: RouteComponentProps['match'],
  setAuthToken: Function,
  staticContext: unknown,
}
 */

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/callback" component={Callback} />
        <Route exact path="/me" component={UserHomeScreen} />
        <Route exact path="/search" component={SearchScreen} />
        <Route exact path="/analysis" component={AnalysisScreen} />
        <Route exact path="/settings" component={SettingsScreen} />
        <Route exact path="/" component={InitialScreen} />
      </Switch>
    </Router>
  );
}

const mapStateToProps = (state: any) => ({
  authToken: state.authToken,
});

export default connect(mapStateToProps)(App);
