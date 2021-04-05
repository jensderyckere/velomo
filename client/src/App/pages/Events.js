import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import moment from 'moment';

// Components
import { GreyButton, LoaderSVG, StandardButton } from '../components';

// Partials
import { EventsCalendar, EventsOverview } from '../partials';

// Services
import { useApi, useAuth } from '../services';

// Routes
import * as Routes from '../routes';

export const Events = () => {
  // Routing
  const history = useHistory();

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

    let eventsArray = [];
    let participatedArray = [];

    const eventsData = await getEvents(currentUser);
    const participatedData = await getParticipatedEvents(currentUser);

    if (userData.role === 'parent') {
      for (let event of eventsData) {
        for (let mainEvent of event.events) {
          if (moment(Date.now()).isBefore(mainEvent.details.date)) {
            eventsArray.push({event: mainEvent, user: event.user});
          };
        }
      };
    } else {
      for (let event of eventsData) {
        if (moment(Date.now()).isBefore(event.details.date)) {
          eventsArray.push(event);
        };
      };
    };

    for (let event of participatedData) {
      if (moment(Date.now()).isBefore(event.details.date)) {
        participatedArray.push(event);
      };
    };

    setUser(userData);
    setEvents(eventsArray);
    setParticipatedEvents(userData.role === 'cyclist' ? participatedArray : eventsArray);
  }, [getCurrentUser, currentUser, getEvents, getParticipatedEvents]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return user ? events ? participatedEvents ? (
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
              text="Verlopen evenementen bekijken"
              action={() => history.push(Routes.ARCHIVED_EVENTS)}
              extraClasses={'margin-left-10'}
            />
            </div>
          </div>
          <div className="col-lg-6 d-lg-flex d-none">
            <EventsCalendar 
              user={user}
              events={participatedEvents} 
            />
          </div>
          <div className="col-lg-5 col-12">
            <h2 className="secundary-font title-size bold-font">Alle beschikbare evenementen</h2>
            <EventsOverview 
              user={user}
              events={events}
            />
          </div>
        </div>
      </section>
    </div>
  ) : <LoaderSVG /> : <LoaderSVG /> : <LoaderSVG />;
};
