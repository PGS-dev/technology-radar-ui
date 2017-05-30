import React from 'react';

import './BlipHistory.css';

const BlipHistory = ({ history }) => (
    <div className="history">
        <div className="historyline" />
        {history.map( (entry, i) => (
            <div className={i === 0 ? 'historyEntry' : 'historyEntry old'} key={i}>
                <div className="historyDot" />
                <div className="historyHeader">
                    <h2 className="historyTitle">{entry.newStatus}</h2>
                </div>
                <div className="historyBody">
                    {entry.snapshotName}
                    <small className="historyRight">
                        <a href={`../${entry.snapshotName}`}>Show snapshot</a>
                    </small>
                </div>
            </div>
        ))}

    </div>
)

export default BlipHistory;