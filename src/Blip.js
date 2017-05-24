import React, { Component } from 'react';

import { dataService } from './DataService';

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
            <div>
                {loading && 'Loading data'}
                {!loading && (
                    <div>
                        <h1>{data.name}</h1>

                        <div><h4>Status:</h4> {data.status}</div>
                        <div><h4>Previous Status:</h4> {data.previousStatus}</div>
                        <div><h4>Section:</h4> {data.section}</div>
                        <div><h4>Description:</h4> {data.description}</div>
                    </div>
                )}
            </div>
        );
    }
}

export default Blip;