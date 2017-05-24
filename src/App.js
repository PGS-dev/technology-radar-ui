import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route  } from 'react-router-dom';

import Blip from './Blip';
import Radar from './Radar';

const PageNotFound = ({match}) => (
    <div>
        <h3>Not found {JSON.stringify(match)}</h3>
    </div>
)

class App extends Component {
  render() {
    return (
        <div>
            <Router basename="/technology-radar-ui">
                <Switch>
                    <Route exact path="/" component={Radar} />
                    <Route path="/:spreadsheetId/blip/:blipId" component={Blip} />
                    <Route path="/:spreadsheetId/:snapshotId" component={Radar} />
                    <Route path="/:spreadsheetId/" component={Radar} />
                    <Route path="/:spreadsheetId" component={Radar} />
                    <Route component={PageNotFound} />
                </Switch>
            </Router>
        </div>
    );
  }
}

export default App;
