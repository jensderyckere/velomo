import React, { useState } from 'react';
import { useHistory } from 'react-router';

// Components
import { ClockSVG, DateText, ImageUrl, LocationSVG, ParticipantSVG, SlugText, SpeedSVG } from '../../components';

// Routes
import * as Routes from '../../routes';

// Images
import DefaultUser from '../../assets/icons/user.svg';

export const EventsOverview = ({ events, user }) => {
  // Routing
  const history = useHistory();

  // States
  const [ paginateIndex, setPaginateIndex ] = useState(4);

  const EventItem = ({ item }) => {
    return user.role !== "parent" ? (
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
             {item.participants.length} deelnemer(s)
          </span>
        </div>
      </div>
    ) : (
      <div className="events__items--item" onClick={() => history.push(Routes.EVENT.replace(':id', item.event._id))}>
        <span className="secundary-font light-font text-size">{DateText(item.event.details.date)}</span>
        <h5 className="secundary-font bold-font subtitle-size">{item.event.title}</h5>
        <div className="d-flex align-items-center">
          {
            item.event.details.duration && (
              <span className="d-flex align-items-center events__items--item--icon secundary-font light-font text-size">
                <ClockSVG />
                 {item.event.details.duration}
              </span>
            )
          }
          {
            item.event.details.duration && (
              <span className="d-flex align-items-center events__items--item--icon secundary-font light-font text-size">
                <SpeedSVG />
                 {item.event.details.speed}km/u
              </span>
            )
          }
          <span className="d-flex align-items-center events__items--item--icon secundary-font light-font text-size">
            <LocationSVG />
             {item.event.details.location}
          </span>
          <span className="d-flex align-items-center events__items--item--icon secundary-font light-font text-size">
            <ParticipantSVG />
             {item.event.participants.length} deelnemer(s)
          </span>
        </div>
        <div className="d-flex align-items-center margin-top-30">
          <div className="avatar avatar-small margin-right-10 pointer" nClick={() => history.push(Routes.PROFILE.replace(':name', SlugText(item.user.firstName + ' ' + item.user.lastName)).replace(':id', item.user._id))} style={{
              backgroundImage: `url(${ImageUrl(item.user.profile.avatar, DefaultUser)})`
            }}>
          </div>
          <span className="secundary-font text-size bold-font">
            {item.user.firstName + ' ' + item.user.lastName}
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
