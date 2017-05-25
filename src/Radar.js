import React, { Component } from 'react';

import Snapshots from './Snapshots';
import RadarChart from './RadarChart';

import { dataService } from './DataService';

class Radar extends Component {
    constructor(props) {
        super(props);

        const { spreadsheetId, snapshotId } = this.props.match.params;

        this.state = {
            loading: !!spreadsheetId,
            spreadsheetId: spreadsheetId,
            snapshots: [],
            snapshotId: snapshotId,
        };


        if (!!spreadsheetId) {
            this.getData();
        }

        this.onItemClick = this.onItemClick.bind(this);
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
        const { spreadsheetId, snapshotId } = nextProps.match.params;
        this.setState({
            spreadsheetId: spreadsheetId,
            snapshotId: snapshotId,
        });
    }

    onItemClick(e) {
        this.props.history.push(
            `${this.state.spreadsheetId}/blip/${encodeURIComponent(e.name)}`
        );
    }

    render() {
        const snapshots = this.state.snapshots;
        const snapshotId = this.state.snapshotId;
        const spreadsheetId = this.state.spreadsheetId;

        return (
            <div>
                {!spreadsheetId ?
                    'Id is missing in path i.e. ' +
                    'https://pgs-dev.github.io/technology-radar-ui/18Wg-5N7qOnEr1sbSx2f_Yh90kTYNAxnpW7ZHE_9orQg' :
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
                                onItemClick={this.onItemClick}
                            />
                        </div>
                }
            </div>
        );
    }
}

export default Radar;
