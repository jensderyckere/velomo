import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Components
import { ConnectCard, GoalsCard, ClubCard, CreateClubCard, CyclistsCard, ChallengesCard } from '.';

// Routes
import * as Routes from '../../routes';
import { useApi, useAuth } from '../../services';

export const DashboardCard = ({ user }) => {
  const history = useHistory();

  // States
  const [ goals, setGoals ] = useState();

  // Services
  const { currentUser } = useAuth();
  const { getUserGoals, getCreatorGoals } = useApi();

  // Fetch goals
  const fetchData = useCallback(async () => {
    let goalsData;

    if (user.role === 'cyclist') {
      goalsData = await getUserGoals(currentUser, user._id);
    } else {
      goalsData = await getCreatorGoals(currentUser, user._id);
    };

    setGoals(goalsData);
  }, [getCreatorGoals, getUserGoals, currentUser, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return (
    <section className="dashboard-card">
      {
        user.role === 'cyclist' ? user.cyclist._clubId ? (
          <>
            <ClubCard 
              clubid={user.cyclist._clubId}
            />
            {
              user.cyclist._challengeIds.length !== 0 && (
                <ChallengesCard 
                  title="Actieve uitdagingen"
                  challenges={user.cyclist._challengeIds}
                />
              )
            }
            {
              goals && goals.length !== 0 && (
                <GoalsCard 
                  title="Actieve doelstellingen"
                  goals={goals}
                />
              )
            }
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
