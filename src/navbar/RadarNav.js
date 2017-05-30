import React from 'react';

const RadarNav = ({match}) => (
    <span>
        <a href={`/${match.params.spreadsheetId}`} className="NavBarLink">Radar home</a>
        <a href={`/${match.params.spreadsheetId}/blips`} className="NavBarLink">All blips</a>
    </span>
);

export default RadarNav;