import React, { Component } from 'react';

import Snapshots from './Snapshots';
import RadarChart from './RadarChart';

class Radar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            snapshots: []
        };

        this.spreadsheetId = this.props.match.params.spreadsheetId;

        const url = `http://pgslnx232.pgs-soft.com:8090/api/radars/${this.spreadsheetId}/snapshots`;

        fetch(url).then(response => response.json()).then(s => this.setState({snapshots: s, loading:false})).catch(m => console.log(m))
    }

    render() {
        const snapshots = this.state.snapshots;

        return (
            <div>
                <div className="debug-radarId" style={{display: 'none'}}>RadarID: {this.spreadsheetId}</div>
                <Snapshots snapshots={snapshots} />
                {this.state.loading ?
                    'Loading' :
                    <RadarChart snapshots={snapshots} spreadsheetId={this.spreadsheetId}/>
                }
            </div>
        );
    }
}

export default Radar;
