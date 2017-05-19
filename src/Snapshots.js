import React, { Component } from 'react';

class Snapshots extends Component {
    render() {
        const snapshots = this.props.snapshots;

        return (
            <div>
                {snapshots.map( s => (
                    <div>{s}</div>
                ))}
            </div>
        );
    }

    magic() {

    }
}

export default Snapshots;
