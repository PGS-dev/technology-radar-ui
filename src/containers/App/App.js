import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route  } from 'react-router-dom';
import './App.css';
import Blip from '../BlipPage/BlipPage';
import Radar from '../RadarPage/RadarPage';
import Home from "../HomePage/HomePage";
import NavBar from "../../components/NavBar/NavBar";
import RadarNav from "../../components/NavBar/RadarNav";

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
                <NavBar>
                    <Route path="/:spreadsheetId" component={RadarNav} />
                </NavBar>

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
