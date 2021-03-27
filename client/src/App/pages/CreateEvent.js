import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

// Services
import { useAuth } from '../services';

// Routes
import * as Routes from '../routes';

// Partials
import { AddEvent } from '../partials';

// Components
import { LoaderSVG } from '../components';

export const CreateEvent = () => {
  // Routing
  const history = useHistory();

  // Services
  const { getCurrentUser, currentUser } = useAuth();

  // States
  const [ user, setUser ] = useState();  

  // Fetch user
  const fetchUser = useCallback(async () => {
    try {
      const userResult = await getCurrentUser(currentUser);
      setUser(userResult);

      if (userResult.role === 'parent') {
        history.push(Routes.ERROR);
      };
    } catch (e) {
      console.log(e);
    };
  }, [getCurrentUser, currentUser, history]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  
  return user ? (
    <>
      <div className="container d-flex">
        <section className={`left-sided w-100`}>
          <AddEvent user={user} />
        </section>
      </div>
    </>
  ) : <LoaderSVG />;
};
