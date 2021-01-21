import React from 'react';
import { useHistory } from 'react-router-dom';

// Components
import { ConnectCard, ClubCard, CreateClubCard, CyclistsCard } from '.';

// Routes
import * as Routes from '../../routes';

export const DashboardCard = ({ user }) => {
  const history = useHistory();
  return (
    <section className="grey-card dashboard-card">
      {
        user.role === 'cyclist' ? user.cyclist._clubId ? (
          <ClubCard 
            clubid={user.cyclist._clubId}
          />
        ) : (
          <ConnectCard 
            user={user}
            title="Oh, zit je reeds in een club? Verbind je hier met hen."
            text="Vul in onderstaand veld jouw ploeg hun unieke code in."
          />
        ) : ''
      }
      {
        user.role === 'member' ? user.member._clubId ? (
          <>
            <ClubCard 
              clubid={user.cyclist._clubId}
            />
            <CyclistsCard 
              title="Een overzicht van alle renners"
            />
          </>
        ) : (
          <ConnectCard 
            user={user}
            title="Oh, zit je reeds in een club? Verbind je hier met hen."
            text="Vul in onderstaand veld jouw ploeg hun unieke code in."
          />
        ) : ''
      }
      {
        user.role === 'parent' ? user.parent._cyclistIds ? (
          <CyclistsCard 
            title="Een overzicht van alle renners"
          />
        ) : (
          <ConnectCard 
            user={user}
            title="Start met het toevoegen van jouw renners."
            text="Vul in onderstaand veld jouw renner zijn unieke code in."
          />
        ) : ''
      }
      {
        user.role === 'club' ? user.club.name ? (
          <CyclistsCard 
            title="Een overzicht van jullie renners"
            cyclists={user.club._cyclistIds}
            club={user.club.name}
            action={() => history.push(Routes.ADD_CONNECTION, {sender: 'club', receiver: 'cyclist'})}
            cred={true}
          />
        ) : (
          <CreateClubCard />
        ) : ''
      }
    </section>
  );
};
