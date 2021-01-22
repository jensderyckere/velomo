import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

// Images
import User from '../../assets/icons/user.svg';
import MyProfile from '../../assets/icons/profile.svg';
import Settings from '../../assets/icons/settings.svg';

import { ArrowSVG } from '../../components';

// Routes
import * as Routes from '../../routes';

// Config
import * as Config from '../../config';

export const Profile = ({ user }) => {
  const history = useHistory();

  // States 
  const [ more, setMore ] = useState(false);

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
              <NavLink to={Routes.SETTINGS}>
                <img src={Settings} alt="settings" />
                <span>Instellingen</span>
              </NavLink>
            </div>
          </div>
        )
      }
    </div>
  );
};
