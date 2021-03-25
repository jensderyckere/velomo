import React, { useState } from 'react';
import { useHistory } from 'react-router';

// Components
import { ClockSVG, DateText, LocationSVG, ParticipantSVG, SpeedSVG } from '../../components';

// Routes
import * as Routes from '../../routes';

export const EventsOverview = ({ events }) => {
  // Routing
  const history = useHistory();

  // States
  const [ paginateIndex, setPaginateIndex ] = useState(4);

  const EventItem = ({ item }) => {
    return (
      <div className="events__items--item" onClick={() => history.push(Routes.EVENT.replace(':id', item._id))}>
        <span className="secundary-font light-font text-size">{DateText(item.details.date)}</span>
        <h5 className="secundary-font bold-font subtitle-size">{item.title}</h5>
        <div className="d-flex align-items-center">
          {
            item.details.duration && (
              <span className="d-flex align-items-center events__items--item--icon secundary-font light-font text-size">
                <ClockSVG />
                 {item.details.duration}
              </span>
            )
          }
          {
            item.details.duration && (
              <span className="d-flex align-items-center events__items--item--icon secundary-font light-font text-size">
                <SpeedSVG />
                 {item.details.speed}km/u
              </span>
            )
          }
          <span className="d-flex align-items-center events__items--item--icon secundary-font light-font text-size">
            <LocationSVG />
             {item.details.location}
          </span>
          <span className="d-flex align-items-center events__items--item--icon secundary-font light-font text-size">
            <ParticipantSVG />
             {item.participants.length} deelnemers
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="events">
      <div className="events__items">
        {
          events.length !== 0 ? events.map((item, index) => {
            return <EventItem key={index} item={item} />
          }) : (
            <span className="events--none tertiary-font light-font text-size">Er zijn nog geen evenementen aangemaakt.</span>
          )
        }
      </div>
      <div className="events__paginate">
        {
          paginateIndex > 4 && (
            <span onClick={() => setPaginateIndex(paginateIndex-4)}>Vorige</span>
          )
        }
        {
          paginateIndex < events.length && (
            <span onClick={() => setPaginateIndex(paginateIndex+4)}>Volgende</span>
          )
        }
      </div>
    </div>
  );
};
