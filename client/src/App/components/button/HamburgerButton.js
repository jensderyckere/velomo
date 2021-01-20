import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export const HamburgerButton = ({title, icon, route}) => {
  // Get path
  const location = useLocation();

  return (
    <div className={`hamburger-button ${location.pathname === route ? 'current-button' : ''}`}>
      <NavLink to={route}>
        {icon}
        <span>{title}</span>
      </NavLink>
    </div>
  );
};
