import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';

// Components
import { LoaderSVG } from '../components';

// Services
import { useApi, useAuth } from '../services';

// Routes
import * as Routes from '../routes';

// Partials
import { CheckPrensence } from '../partials';

export const EventPresence = () => {
  // Routing
  const history = useHistory();
  const { id } = useParams();

  // States
  const [ event, setEvent ] = useState();
  const [ user, setUser ] = useState();

  // Services
  const { currentUser, getCurrentUser } = useAuth();
  const { getEvent } = useApi();

  // Fetch data
  const fetchData = useCallback(async () => {
    const userData = await getCurrentUser(currentUser);
    const eventData = await getEvent(currentUser, id);

    if (!eventData) {
      history.push(Routes.ERROR);
      return;
    };

    if (userData.role !== "club") {
      history.push(Routes.ERROR);
      return;
    };

    if (String(userData._id) !== String(eventData._creatorId._id)) {
      history.push(Routes.ERROR);
      return;
    };

    setEvent(eventData);
    setUser(userData);
  }, [getCurrentUser, getEvent, currentUser, id, history]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshStates = async () => {
    const eventData = await getEvent(currentUser, id);
    setEvent(eventData);
  };

  return user ? event ? (
    <div className="container">
      <section className="w-100">
        <CheckPrensence event={event} refresh={refreshStates} />
      </section>
    </div>
  ) : <LoaderSVG /> : <LoaderSVG />;
};
