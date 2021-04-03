import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import moment from 'moment';

// Components
import { GreyButton, LoaderSVG, StandardButton } from '../components';

// Partials
import { EventsOverview } from '../partials';

// Services
import { useApi, useAuth } from '../services';

// Routes
import * as Routes from '../routes';

export const EventsArchived = () => {
  // Routing
  const history = useHistory();

  // States
  const [ user, setUser ] = useState();
  const [ events, setEvents ] = useState();

  // Services
  const { currentUser, getCurrentUser } = useAuth();
  const { getEvents } = useApi();

  // Fetch data
  const fetchDetails = useCallback(async () => {
    const userData = await getCurrentUser(currentUser);

    let eventsArray = [];

    const eventsData = await getEvents(currentUser);

    for (let event of eventsData) {
      if (moment(Date.now()).isAfter(event.details.date)) {
        eventsArray.push(event);
      };
    };

    setUser(userData);
    setEvents(eventsArray);
  }, [getCurrentUser, currentUser, getEvents]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return user ? events ? (
    <div className="container">
      <section className="w-100">
        <div className="row d-flex justify-content-between">
          <div className="col-12 margin-bottom-30">
            <div className="d-flex align-items-center">
            {
              user.role !== 'parent' && (
                <StandardButton 
                  text="Evenement maken"
                  action={() => history.push(Routes.CREATE_EVENT)}
                />
              )
            }
            <GreyButton 
              text="Toekomstige evenementen bekijken"
              action={() => history.push(Routes.EVENTS)}
              extraClasses={'margin-left-10'}
            />
            </div>
          </div>
          <div className="col-12 margin-top-30">
            <h2 className="secundary-font title-size bold-font">Alle gearchiveerde evenementen</h2>
            <EventsOverview 
              events={events}
            />
          </div>
        </div>
      </section>
    </div>
  ) : <LoaderSVG /> : <LoaderSVG />;
};
