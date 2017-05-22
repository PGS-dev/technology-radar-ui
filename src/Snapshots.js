import React, { Component } from 'react';

import './Snapshots.css';

class Snapshots extends Component {
    render() {
        const snapshots = this.props.snapshots;

        return (
            <div className="snapshots-detach">
                {snapshots.map( s => (
                    <span key={s.name} className="">{s.name}{" | "}</span>
                ))}
            </div>
        );
    }
}

export default Snapshots;
