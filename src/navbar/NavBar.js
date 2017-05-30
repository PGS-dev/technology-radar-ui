import React from 'react';

import './NavBar.css';

const NavBar = ({children}) => (
    <nav className="NavBar">
        <a href="/" className="NavBarLink">PGS TechRadar</a>
        {children}
    </nav>
);

export default NavBar;