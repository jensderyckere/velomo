import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export const HeaderButton = ({title, icon, route}) => {
  // Get path
  const location = useLocation();

  return (
    <div className={`header-button ${location.pathname === route ? 'current-button' : ''}`}>
      <NavLink to={route}>
        {icon}
        <span>{title}</span>
        {
          location.pathname === route && <div className="header-button__bar"></div>
        }
      </NavLink>
    </div>
  )
};
