import React, { Component } from 'react';
import MagicChart from "./MagicChart";

class RadarChart extends Component {
    constructor(props) {
        super(props);

        this.state ={
            loading: true,
            data: {}
        }

        this.spreadsheetId = this.props.spreadsheetId;
        this.snapshotId = this.props.snapshots[1].name;

        const url = `http://pgslnx232.pgs-soft.com:8090/api/radars/${this.spreadsheetId}/snapshots/${this.snapshotId}`;

        fetch(url).then(response => response.json()).then(data => this.setState({data, loading: false})).catch(m => console.log(m))
    }

    render() {
        return (
            <div>
                {this.state.loading ? '' :
                    <MagicChart data={this.state.data}/>}
            </div>
        );
    }

    magic() {

    }
}

export default RadarChart;
