import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// Partials
import { AddSection, UserCard } from '../partials';

// Routes
import * as Routes from '../routes';

// Services
import { useAuth, useStyling } from '../services';

// Utils
import { ScreenSizeClassSwitch } from '../utils';

export const AddConnection = () => {
  // Get receiver
  const { state } = useLocation();
  const { receiver } = state;

  // For routing
  const history = useHistory();

  // Services
  const { currentUser, getCurrentUser } = useAuth();
  const { screenSize } = useStyling();

  // States
  const [ user, setUser ] = useState();

  // Fetch current user
  const fetchUser = useCallback(async () => {
    try {
      // Check if receiver has been passed through route
      if (!receiver) history.push(Routes.ERROR);
      // Fetch the user
      const data = await getCurrentUser(currentUser);
      setUser(data);
    } catch (e) {
      history.push(Routes.ERROR);
    };
  }, [history, receiver, getCurrentUser, currentUser]);

  useEffect(() => {
    fetchUser();
    return;
  }, [fetchUser]);

  return (
    user ? (
      <>
        <div className={`container d-flex ${ScreenSizeClassSwitch('', 'flex-wrap')}`}>
          { 
            screenSize === 'xl' || screenSize === 'lg' ?  (
              <section className={`left-sided p-relative ${ScreenSizeClassSwitch('w-30', 'w-100')}`}>
                <UserCard 
                  screenSize={screenSize}
                  user={user}
                />
              </section>
            ) : ''
          }
          <section className={`right-sided ${ScreenSizeClassSwitch('w-70', 'w-100')}`}>
            <AddSection 
              user={user}
              receiver={receiver}
            />
          </section>
        </div>
      </>
    ) : ''
  );
};
