import React from 'react';
import { useHistory } from 'react-router-dom';

// Images
import { DashboardSVG, ChallengeSVG, GoalsSVG, LocationSVG } from '../../components';
import Logo from '../../assets/logos/full-logo.svg';

// Components
import { HeaderButton } from '../../components';
import { SearchEngine, Profile } from '.';

// Routes
import * as Routes from '../../routes';

export const DesktopHeader = ({ user, notifications }) => {
  const history = useHistory();

  return (
    <div className="header__content d-flex align-items-center justify-content-between">
      <div className="header__content--left d-flex align-items-center">
        <img src={Logo} alt="full-logo" onClick={() => history.push(Routes.DASHBOARD)} className="header__content--logo"/>
        <HeaderButton 
          title="Dashboard"
          icon={<DashboardSVG />}
          slug="dashboard"
          route={Routes.DASHBOARD}
        />
        {
          user.role === 'cyclist' && (
            <HeaderButton 
              title="Doelstellingen"
              icon={<GoalsSVG />}
              slug="goals"
              route={Routes.GOALS}
            />
          )
        }
        {
          user.role === 'cyclist' && (
            <HeaderButton 
              title="Uitdagingen"
              icon={<ChallengeSVG />}
              slug="challenges"
              route={Routes.CHALLENGES}
            />
          )
        }
        {
          user.role === 'parent' && (
            <HeaderButton 
              title="Doelstellingen"
              icon={<GoalsSVG />}
              slug="goals"
              route={Routes.GOALS}
            />
          )
        }
        {
          user.role === 'clubmember' && (
            <HeaderButton 
              title="Doelstellingen"
              icon={<GoalsSVG />}
              slug="goals"
              route={Routes.GOALS}
            />
          )
        }
        {
          user.role === 'club' && (
            <HeaderButton 
              title="Uitdagingen"
              icon={<ChallengeSVG />}
              slug="challenges"
              route={Routes.CHALLENGES}
            />
          )
        }
        {
          user.role === 'club' && (
            <HeaderButton 
              title="Doelstellingen"
              icon={<GoalsSVG />}
              slug="goals"
              route={Routes.GOALS}
            />
          )
        }
        <HeaderButton 
          title="Evenementen"
          icon={<LocationSVG />}
          slug="events"
          route={Routes.EVENTS}
        />
      </div>
      <div className="header__content--right d-flex align-items-center justify-content-end">
        <SearchEngine />
        <div className="header__content--line"></div>
        <Profile notifications={notifications} user={user} />
      </div>
    </div>
  );
};
