import React, { Component } from 'react';
import { dataService } from '../DataService';
import './NavBar.css';
import { Route } from 'react-router-dom';
import RadarNav from "./RadarNav";

class NavBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            radars: []
        }
    }

    componentDidMount(){
       dataService.getRadars()
       .then(radars => { 
           this.setState({radars});
        })
    }

    render() {
        return (
        <nav className="NavBar">
            <Route path="/:spreadsheetId" render = {(props) => <RadarNav radars={this.state.radars} {...props} />} />
        </nav>
        );
    } 
}

export default NavBar;