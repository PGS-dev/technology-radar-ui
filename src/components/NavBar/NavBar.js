import React from 'react';
import './NavBar.css';

const NavBar = ({children}) => (
    <nav className="NavBar">
        {children}
    </nav>
);

export default NavBar;