import React, { useCallback, useEffect, useState } from 'react';

// Partials
import { EventsCalendar } from '../partials';

// Services
import { useApi, useAuth } from '../services';

export const Events = () => {
  // States
  const [ user, setUser ] = useState();
  const [ events, setEvents ] = useState();
  const [ participatedEvents, setParticipatedEvents ] = useState();

  // Services
  const { currentUser, getCurrentUser } = useAuth();
  const { getEvents, getParticipatedEvents } = useApi();

  // Fetch data
  const fetchDetails = useCallback(async () => {
    const userData = await getCurrentUser(currentUser);

    const eventsData = await getEvents(currentUser);
    const participatedData = await getParticipatedEvents(currentUser);

    setUser(userData);
    setEvents(eventsData);
    setParticipatedEvents(userData.role === 'cyclist' ? participatedData : eventsData);
  }, [getCurrentUser, currentUser, getEvents, getParticipatedEvents]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return user ? events ? participatedEvents ? (
    <div className="container">
      <section className="w-100">
        <div className="row">
          <div className="col-lg-6 d-lg-flex d-none">
            <EventsCalendar />
          </div>
          <div className="col-lg-6 col-12">
            <h2 className="secundary-font title-size bold-font">Alle beschikbare evenementen</h2>
          </div>
        </div>
      </section>
    </div>
  ) : '' : '' : '';
};
