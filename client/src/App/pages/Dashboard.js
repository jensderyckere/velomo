import React, { useCallback, useEffect, useState } from 'react';

// Components
import { DashboardCard, LoaderSVG } from '../components';

// Partials
import { Welcome } from '../partials';

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
        <div className="row">
          <div className="col-12 col-lg-8">
            <Welcome 
              screenSize={screenSize}
            />
          </div>
          <div className="col-4 d-lg-flex d-none">
            <DashboardCard 
              user={user}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-8 col-12">
            
          </div>
        </div>
      </>
    ) : <LoaderSVG />
  );
};
