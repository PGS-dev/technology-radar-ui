import React, { Component } from 'react';
import Snapshots from '../../components/Snapshots/Snapshots';
import RadarChart from '../../components/RadarChart/RadarChart';
import { dataService } from '../../services/DataService/DataService';
import './RadarPage.css';

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
        const { snapshots } = this.state;
        this.setState({
            spreadsheetId: spreadsheetId,
            snapshotId: snapshotId || (snapshots.length ? snapshots[0].name : null),
        });
    }

    onItemClick(e) {
        let url = `blip/${encodeURIComponent(e.name)}`;

        if (!this.props.location.pathname.includes('/', 1)) {
            url = `${this.state.spreadsheetId}/${url}`;
        }
        this.props.history.push(url);
    }

    render() {
        const snapshots = this.state.snapshots;
        const snapshotId = this.state.snapshotId;
        const spreadsheetId = this.state.spreadsheetId;

        return (
            <div className="Radar">
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
