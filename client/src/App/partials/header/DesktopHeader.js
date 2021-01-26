import React from 'react';
import { useHistory } from 'react-router-dom';

// Images
import { DashboardSVG, ChallengeSVG, ChatSVG, GoalsSVG, TeamSVG } from '../../components';
import Logo from '../../assets/logos/full-logo.svg';

// Components
import { HeaderButton } from '../../components';
import { SearchEngine, Profile } from '.';

// Routes
import * as Routes from '../../routes';

export const DesktopHeader = ({ user }) => {
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
              title="Gesprekken"
              icon={<ChatSVG />}
              slug="chat"
              route={Routes.CHAT}
            />
          )
        }
        {
          user.role === 'clubmember' && (
            <HeaderButton 
              title="Gesprekken"
              icon={<ChatSVG />}
              slug="chat"
              route={Routes.CHAT}
            />
          )
        }
        {
          user.role === 'club' && (
            <HeaderButton 
              title="Gesprekken"
              icon={<ChatSVG />}
              slug="chat"
              route={Routes.CHAT}
            />
          )
        }
        {
          user.role === 'club' && (
            <HeaderButton 
              title="Team"
              icon={<TeamSVG />}
              slug="team"
              route={Routes.TEAM}
            />
          )
        }
        {
          user.role === 'clubmember' && (
            <HeaderButton 
              title="Team"
              icon={<TeamSVG />}
              slug="team"
              route={Routes.TEAM}
            />
          )
        }
      </div>
      <div className="header__content--right d-flex align-items-center justify-content-end">
        <SearchEngine />
        <div className="header__content--line"></div>
        <Profile user={user} />
      </div>
    </div>
  );
};
