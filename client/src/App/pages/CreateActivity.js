import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Services
import { useAuth } from '../services';

// Routes
import * as Routes from '../routes';

// Partials
import { CreateForm } from '../partials';

// Components
import { LoaderSVG } from '../components';

export const CreateActivity = () => {
  // Routing
  const history = useHistory();

  // Services
  const { currentUser, getCurrentUser } = useAuth();

  // States
  const [ user, setUser ] = useState();

  // Fetch current user
  const fetchUser = useCallback(async () => {
    try {
      const data = await getCurrentUser(currentUser);
      setUser(data);
    } catch (e) {
      history.push(Routes.ERROR);
    };
  }, [getCurrentUser, currentUser, history]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return user ? (
    <>
      <div className="container d-flex">
        <section className={`left-sided w-100`}>
          <CreateForm />
        </section>
      </div>
    </>
  ) : <LoaderSVG />
};