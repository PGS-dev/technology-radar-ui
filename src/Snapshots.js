import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Snapshots.css';

class Snapshots extends Component {
    render() {
        const snapshots = this.props.snapshots;
        const snapshotId = this.props.snapshotId;
        const spreadsheetId = this.props.spreadsheetId;

        return (
            <div className="snapshots-detach">
                {
                    snapshots.map(
                        s => {
                            const name = s.name;
                            const active = snapshotId === name ? 'active' : '';
                            return (
                                <span key={name}>
                                    <Link
                                        to={{
                                            pathname: '/',
                                            search: `?id=${spreadsheetId}&snapshot=${name}`,
                                        }}
                                        className={active}
                                    >
                                        {s.name}
                                    </Link>
                                    {' | '}
                                </span>
                            )
                        }
                    )
                }
            </div>
        );
    }
}

export default Snapshots;
