import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route  } from 'react-router-dom';

import Blip from './Blip';
import Radar from './Radar';
import NavBar from "./navbar/NavBar";
import RadarNav from "./navbar/RadarNav";
import Home from "./Home";

const PageNotFound = ({match}) => (
    <div>
        <h3>Not found {JSON.stringify(match)}</h3>
    </div>
) 

class App extends Component {
  render() {
    return (
        <Router basename="/technology-radar-ui">
            <div>
                <NavBar />
                <div className="content">
                    <Switch>
                        {/* order of Routes is meaningful */}
                        <Route exact path="/" component={Home} />
                        <Route path="/:spreadsheetId/blip/:blipId" component={Blip} />
                        <Route path="/:spreadsheetId/:snapshotId" component={Radar} />
                        <Route path="/:spreadsheetId/" component={Radar} />
                        <Route path="/:spreadsheetId" component={Radar} />
                        <Route component={PageNotFound} />
                    </Switch>
                </div>
            </div>
        </Router>
    );
  }
}

export default App;
