import React, { Component } from 'react';

import Snapshots from './Snapshots';
import RadarChart from './RadarChart';

import { dataService } from './DataService';

class Radar extends Component {
    constructor(props) {
        super(props);

        const searchParams = new URLSearchParams(this.props.location.search);

        const hasId = searchParams.has('id')
        this.state = {
            loading: hasId,
            spreadsheetId: hasId ? searchParams.get('id') : null,
            snapshots: [],
            snapshotId: searchParams.has('snapshot') ? searchParams.get('snapshot') : null,
        };


        if (hasId) {
            this.getData();
        }
    }

    getData() {
        dataService.getSnapshots(this.state.spreadsheetId)
            .then(
                s => this.setState({
                    snapshots: s,
                    snapshotId: this.state.snapshotId ||
                    (s.length ? s[0].name : null), // default first snapshot
                    loading: false
                })
            )
    }

    componentWillReceiveProps(nextProps) {
        const searchParams = new URLSearchParams(nextProps.location.search);
        this.setState({
            spreadsheetId: searchParams.has('id') ? searchParams.get('id') : null,
            snapshotId: searchParams.has('snapshot') ? searchParams.get('snapshot') : null,
        });
    }

    render() {
        const snapshots = this.state.snapshots;
        const snapshotId = this.state.snapshotId;
        const spreadsheetId = this.state.spreadsheetId;

        return (
            <div>
                {!spreadsheetId ?
                    'Id is missing in query params i.e. id=18Wg-5N7qOnEr1sbSx2f_Yh90kTYNAxnpW7ZHE_9orQg' :
                    this.state.loading ?
                        'Loading' :
                        <div>
                            <Snapshots
                                snapshots={snapshots}
                                spreadsheetId={spreadsheetId}
                                snapshotId={snapshotId}
                            />
                            <RadarChart
                                snapshots={snapshots}
                                spreadsheetId={spreadsheetId}
                                snapshotId={snapshotId}
                            />
                        </div>
                }
            </div>
        );
    }
}

export default Radar;
