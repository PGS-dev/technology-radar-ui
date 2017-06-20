import React from 'react';
import { Link } from 'react-router-dom';

const RadarNav = ({match}) => (
    <span>
        <Link to={{pathname: `/${match.params.spreadsheetId}`}}>Technology radar</Link>
        {/*<Link to={{pathname: `/${match.params.spreadsheetId}/blips`}}>All blips</Link>*/}
    </span>
);

export default RadarNav;