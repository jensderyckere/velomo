import React from 'react';
import { useHistory } from 'react-router-dom';

// Routes
import * as Routes from '../../routes';

// Images
import Logo from '../../assets/logos/full-logo.svg';

// Components
import { MobileProfile } from './MobileProfile';

export const MobileHeader = ({ user }) => {
  const history = useHistory();

  return (
    <div className="header__content d-flex align-items-center justify-content-between">
      <div className="header__content--left">
        <img src={Logo} alt="full-logo" onClick={() => history.push(Routes.DASHBOARD)} className="header__content--logo"/>
      </div>
      <div className="header__content--right">
        <MobileProfile user={user} />
      </div>
    </div>
  );
};
