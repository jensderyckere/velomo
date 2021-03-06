import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

// Components
import { LoaderSVG } from '../components';

// Partials
import { MyUserContent, UserCard } from '../partials';

// Routes
import * as Routes from '../routes';

// Services
import { useAuth, useStyling } from '../services';

// Utils
import { ScreenSizeClassSwitch } from '../utils';

export const Profile = () => {
  // Get params
  const { id } = useParams();

  // Routing
  const history = useHistory();

  // States
  const [ user, setUser ] = useState();
  const [ watchingUser, setWatchingUser ] = useState();

  // Services
  const { currentUser, getUser, getCurrentUser } = useAuth();
  const { screenSize } = useStyling();

  // Fetch current user
  const fetchUser = useCallback(async () => {
    try {
      // Fetch the user
      const data = await getUser(currentUser, id);
      const userData = await getCurrentUser(currentUser);

      setUser(data);
      setWatchingUser(userData);
    } catch (e) {
      history.push(Routes.ERROR);
    };
  }, [history, getUser, currentUser, getCurrentUser, id]);

  useEffect(() => {
    fetchUser();
    return;
  }, [fetchUser]);

  return (
    user ? watchingUser ? (
      <>
        <div className={`container d-flex ${ScreenSizeClassSwitch('', 'flex-wrap')}`}>
          <section className={`left-sided p-relatyive ${ScreenSizeClassSwitch('w-30', 'w-100')}`}>
            <UserCard 
              screenSize={screenSize}
              user={user}
            />
          </section>
          <section className={`right-sided ${ScreenSizeClassSwitch('w-70', 'w-100')}`}>
            <MyUserContent 
              user={user}
              screenSize={screenSize}
              cred={false}
              watchingUser={watchingUser}
            />
          </section>
        </div>
      </>
    ) : <LoaderSVG /> : <LoaderSVG />
  );
};
