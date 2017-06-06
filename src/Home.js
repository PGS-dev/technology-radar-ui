import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {
    render() {
        return (
            <div>
                <h1>Latest radars</h1>
                <ul>
                    <li>
                        <Link to={{ pathname: `/11IUPvEX2RJ_ZoNMQeSVo7ghj2-BpeTCUIG3KoMf7Ifc/` }}>
                            Frontend Radar
                        </Link>
                    </li>
                    <li>
                        <Link to={{ pathname: `/18Wg-5N7qOnEr1sbSx2f_Yh90kTYNAxnpW7ZHE_9orQg/` }}>
                            Example Radar
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Home;
