import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Services
import { useAuth, useStyling } from '../services';

// Routes
import * as Routes from '../routes';

// Components
import { LoaderSVG } from '../components';

// Partials
import { MyUserContent, UserCard } from '../partials';

export const MyProfile = () => {
  const history = useHistory();

  const { currentUser, getCurrentUser } = useAuth();
  const { screenSize } = useStyling();
  
  const [ user, setUser ] = useState();

  const fetchUser = useCallback(async () => {
    try {
      const userData = await getCurrentUser(currentUser);
      setUser(userData);
    } catch (e) {
      history.push(Routes.ERROR);
    };
  }, [getCurrentUser, currentUser, history]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    user ? (
      <>
        <div className={`container d-flex ${screenSize === 'lg' || screenSize === 'xl' ? '' : 'flex-wrap'}`}>
          <section className={`left-sided p-relative ${screenSize === 'lg' || screenSize === 'xl' ? 'w-30': 'w-100'}`}>
            <UserCard 
              screenSize={screenSize}
              user={user}
            />
          </section>
          <section className={`right-sided ${screenSize === 'lg' || screenSize === 'xl' ? 'w-70': 'w-100'}`}>
            <MyUserContent 
              user={user}
              screenSize={screenSize}
              cred={true}
            />
          </section>
        </div>
      </>
    ) : <LoaderSVG />
  );
};
