import React from 'react';
import { useHistory } from 'react-router-dom';

// Components
import { ConnectCard, ClubCard, CreateClubCard, CyclistsCard } from '.';

// Routes
import * as Routes from '../../routes';

export const DashboardCard = ({ user }) => {
  const history = useHistory();
  
  return (
    <section className="dashboard-card">
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
        user.role === 'clubmember' ? user.member ? user.member._clubId && (
          <>
            <ClubCard 
              clubid={user.member._clubId}
            />
            <CyclistsCard 
              title="Een overzicht van alle renners"
              cyclists={user.member._clubId._userId.club._cyclistIds}
              club={user.member._clubId._userId.club.name}
              action={() => history.push(Routes.ADD_CONNECTION, {sender: 'club', receiver: 'cyclist'})}
              cred={true}
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
            cyclists={user.parent._cyclistIds}
            action={() => history.push(Routes.ADD_CONNECTION, {sender: 'club', receiver: 'cyclist'})}
            cred={true}
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
