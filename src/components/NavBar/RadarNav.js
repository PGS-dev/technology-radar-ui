import React from 'react';
import { Link } from 'react-router-dom';

const RadarNav = ({...props}) => {

    let routeName = '';
    if (props.radars.length > 0) {
        const validRadar = props.radars.find(route => (props.match.url.indexOf(route.id)!==-1));
        routeName = validRadar ?  validRadar.name : "Tech radar PGS";
    } 

    return (
    <span>
        <Link to={{pathname: `/`}}>{routeName}</Link>
        {/*<Link to={{pathname: `/${match.params.spreadsheetId}/blips`}}>All blips</Link>*/}
    </span>
    )
};

export default RadarNav;