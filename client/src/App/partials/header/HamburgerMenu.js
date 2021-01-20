import React from 'react';
import { useHistory } from 'react-router-dom';

// Images
import User from '../../assets/icons/user.svg';
import Logo from '../../assets/logos/full-logo.svg';

import { ExitSVG, HamburgerButton, DashboardSVG, ChallengeSVG, ChatSVG, TeamSVG, GoalsSVG } from '../../components';

// Routes
import * as Routes from '../../routes';

export const HamburgerMenu = ({ user, hide }) => {
  const history = useHistory();

  return (
    <div className="hamburger">
      <div className="header__content d-flex align-items-center justify-content-between">
        <div className="header__content--left">
          <img src={Logo} alt="full-logo" onClick={() => history.push(Routes.DASHBOARD)} className="header__content--logo"/>
        </div>
        <div className="header__content--right">
          <div className="mobile-profile">
            <div className="mobile-profile__avatar" onClick={() => history.push(Routes.PROFILE)} style={{
                backgroundImage: `url(${user.profile.avatar ? user.profile.avatar : User})`
            }}></div>
            <div className="mobile-profile__exit" onClick={hide}>
              <ExitSVG />
            </div>
          </div>
        </div>
      </div>
      <div className="hamburger__content">
        <HamburgerButton 
          title="Dashboard"
          icon={<DashboardSVG />}
          slug="dashboard"
          route={Routes.DASHBOARD}
        />
        {
          user.role === 'cyclist' && (
            <HamburgerButton 
              title="Doelstellingen"
              icon={<GoalsSVG />}
              slug="goals"
              route={Routes.GOALS}
            />
          )
        }
        {
          user.role === 'cyclist' && (
            <HamburgerButton 
              title="Uitdagingen"
              icon={<ChallengeSVG />}
              slug="challenges"
              route={Routes.CHALLENGES}
            />
          )
        }
        {
          user.role === 'parent' || user.role === 'member' || user.role == 'club' && (
            <HamburgerButton 
              title="Gesprekken"
              icon={<ChatSVG />}
              slug="chat"
              route={Routes.CHAT}
            />
          )
        }
        {
          user.role === 'member' || user.role == 'club' && (
            <HamburgerButton 
              title="Team"
              icon={<TeamSVG />}
              slug="team"
              route={Routes.TEAM}
            />
          )
        }
      </div>
    </div>
  );
};
