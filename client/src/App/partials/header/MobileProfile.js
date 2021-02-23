import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

// Images
import User from '../../assets/icons/user.svg';

// Routes
import * as Routes from '../../routes';

// Components
import { HamburgerMenu } from './HamburgerMenu';
import { ImageUrl, MoreSVG } from '../../components';

export const MobileProfile = ({ user }) => {
  const history = useHistory();

  // States
  const [ displayMenu, setDisplayMenu ] = useState(false);

  return (
    <div className="mobile-profile">
      <div className="mobile-profile__avatar avatar-standard" onClick={() => history.push(Routes.MY_PROFILE)} style={{
          backgroundImage: `url(${ImageUrl(user.profile.avatar, User)})`
      }}></div>
      <div className="mobile-profile__more" onClick={() => setDisplayMenu(true)}>
        <MoreSVG />
      </div>
      {
        displayMenu && (
          <HamburgerMenu 
            user={user} 
            hide={() => setDisplayMenu(!displayMenu)}
          />
        )
      }
    </div>
  );
};
