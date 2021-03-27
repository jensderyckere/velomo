import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// Services
import { useApi, useAuth } from '../services';

// Routes
import * as Routes from '../routes';

// Partials
import { ChangeEvent } from '../partials';

// Components
import { LoaderSVG } from '../components';

export const EditEvent = () => {
  const { state } = useLocation();
  const id = state.id;

  // Routing
  const history = useHistory();

  // Services
  const { getCurrentUser, currentUser } = useAuth();
  const { getEvent } = useApi();

  // States
  const [ user, setUser ] = useState();
  const [ event, setEvent ] = useState();

  // Fetch details
  const fetchDetails = useCallback(async () => {
    try {
      if (!state) {
        history.push(Routes.ERROR);
      };

      const userResult = await getCurrentUser(currentUser);
      const eventResult = await getEvent(currentUser, id);
      setEvent(eventResult);
      setUser(userResult);
    } catch (e) {
      history.push(Routes.ERROR);
    };
  }, [getCurrentUser, currentUser, history, id, getEvent, state]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return user ? event && (
    <>
      <div className="container d-flex">
        <section className={`left-sided w-100`}>
          <ChangeEvent user={user} event={event} />
        </section>
      </div>
    </>
  ) : <LoaderSVG />;
};
