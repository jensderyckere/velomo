import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

// Images
import User from '../../assets/icons/user.svg';
import MyProfile from '../../assets/icons/profile.svg';
import Settings from '../../assets/icons/settings.svg';

import { ActivitySVG, ArrowSVG, LogoutSVG } from '../../components';

// Routes
import * as Routes from '../../routes';

// Config
import * as Config from '../../config';

// Services
import { useAuth } from '../../services';

export const Profile = ({ user }) => {
  const history = useHistory();

  // Services
  const { logOut } = useAuth();

  // States 
  const [ more, setMore ] = useState(false);

  const logOutUser = () => {
    const result = logOut();
    if (result) history.push(Routes.SIGNIN);
  };

  return (
    <div className="profile">
      <div className="profile__avatar" onClick={() => history.push(Routes.MY_PROFILE)} style={{
        backgroundImage: `url(${user.profile.avatar ? `${Config.clientConfig.apiUrl}picture/${user.profile.avatar}`: User})`
      }}></div>
      <div className={`profile__more ${more ? 'active-more' : ''}`} onClick={() => setMore(!more)}>
        <span>{user.firstName}</span>
        <ArrowSVG />
      </div>
      {
        more && (
          <div className="profile__more--show more-view">
            <div className="more-view__link">
              <NavLink to={Routes.MY_PROFILE}>
                <img src={MyProfile} alt="profile" />
                <span>Mijn profiel</span>
              </NavLink>
            </div>
            <div className="more-view__link">
              <NavLink to={Routes.SETTINGS.replace(':setting', 'profile')}>
                <img src={Settings} alt="settings" />
                <span>Instellingen</span>
              </NavLink>
            </div>
            {
              user.role === 'cyclist' && (
                <div className="more-view__link">
                  <NavLink to={Routes.ACTIVITIES}>
                    <ActivitySVG />
                    <span>Activiteiten</span>
                  </NavLink>
                </div>
              )
            }
            <div className="more-view__link" onClick={() => logOutUser()}>
              <LogoutSVG />
              <span>Afmelden</span>
            </div>
          </div>
        )
      }
    </div>
  );
};
