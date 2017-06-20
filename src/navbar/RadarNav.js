import React from 'react';
import { Link } from 'react-router-dom';
const RadarNav = ({match}) => {

    const routesArray = [['11IUPvEX2RJ_ZoNMQeSVo7ghj2-BpeTCUIG3KoMf7Ifc', 'Frontend Radar'],
    ['18Wg-5N7qOnEr1sbSx2f_Yh90kTYNAxnpW7ZHE_9orQg', 'Example Radar']];

    function checkUrl(match, routesArray) {
          const routeName = routesArray.find(route => (match.url.indexOf(route[0])!==-1));
          return routeName ? routeName[1] : 'Tech Radar';
    }
    const navHomeLink = checkUrl(match, routesArray);
 
    return (
    <span>
        <Link to={{pathname: `/`}}>{navHomeLink}</Link>
        {/*<Link to={{pathname: `/${match.params.spreadsheetId}/blips`}}>All blips</Link>*/}
    </span>
    )
};

export default RadarNav;