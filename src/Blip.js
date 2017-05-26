import React, { Component } from 'react';

import { dataService } from './DataService';
import BlipHistory from './BlipHistory';

import './Blip.css';

class Blip extends Component {
    constructor(props) {
        super(props);

        this.state ={
            loading: true,
            data: {}
        };

        this.getData();
    }

    getData() {

        const { spreadsheetId, blipId }  = this.props.match.params;

        dataService.getBlip(spreadsheetId, blipId)
            .then(
                data => this.setState({
                    data,
                    loading: false
                })
            );
    }

    render() {
        const { loading, data } = this.state;
        return (
            <div className="blipContainer">
                {loading && <div className="loading">Loading ...</div>}
                {!loading && (
                    <div>
                        <h1 className="blipName">{data.name}</h1>
                        <h3>{data.section}</h3>
                        <div className="blipDescription">{data.description}</div>

                        <BlipHistory history={data.history} />
                    </div>
                )}
            </div>
        );
    }
}



export default Blip;