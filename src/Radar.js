import React, { Component } from 'react';

import Snapshots from './Snapshots';

class Radar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            snapshots: []
        };

        const url = `http://pgslnx232.pgs-soft.com:8090/api/radars/${this.props.match.params.spreadsheetId}/snapshots`;

        fetch(url).then(response => response.json()).then(s => this.setState({snapshots: s})).catch(m => console.log(m))
    }

    render() {
        const snapshots = this.state.snapshots;

        return (
            <div>
                <h1>Radar</h1>
                <div>RadarID: {this.props.match.params.spreadsheetId}</div>
                <Snapshots snapshots={snapshots}/>
            </div>
        );
    }

    magic() {

    }
}

export default Radar;
