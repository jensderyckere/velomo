import React, { useCallback, useEffect, useState } from 'react';

// Components
import { DashboardCard, LoaderSVG } from '../components';

// Partials
import { Activitites, MessagesTeaser, Welcome } from '../partials';

// Services
import { useAuth, useStyling } from '../services';

export const Dashboard = () => {
  const { screenSize } = useStyling();
  const { currentUser, getCurrentUser } = useAuth();

  const [ user, setUser ] = useState();

  const fetchUser = useCallback(async () => {
    const data = await getCurrentUser(currentUser);
    setUser(data);
  }, [getCurrentUser, currentUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    user ? (
      <>
      <div className={`container d-flex ${screenSize === 'lg' || screenSize === 'xl' ? 'p-relative': ''}`}>
        <section className={`left-sided ${screenSize === 'lg' || screenSize === 'xl' ? 'w-70': 'w-100'}`}>
          <Welcome 
            screenSize={screenSize}
          />
          <MessagesTeaser 
            screenSize={screenSize}
          />
          <Activitites 
            screenSize={screenSize}
            user={user}
          />
        </section>
        {
          screenSize === 'lg' || screenSize === 'xl' && (
            <section className="right-sided w-30 p-absolute">
              <DashboardCard 
                user={user}
              />
            </section>
          )
        }
      </div>
      </>
    ) : <LoaderSVG />
  );
};
