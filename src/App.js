import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route  } from 'react-router-dom';


import Radar from './Radar';
import Home from './Home';

class App extends Component {



  render() {
    return (
      <Router basename="/technology-radar-ui/">
          <main>
              <Route exact={true} path="/" component={Home} />
              <Route path="/:spreadsheetId" component={Radar} />
          </main>
      </Router>
    );
  }
}

export default App;
