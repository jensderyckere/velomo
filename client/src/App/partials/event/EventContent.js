import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import moment from 'moment';

// Components
import { DateText, GreyButton, ImageUrl, StandardButton, SlugText, ClockSVG, SpeedSVG, LocationSVG } from '../../components';

// Images
import DefaultUser from '../../assets/icons/user.svg';

// Routes
import * as Routes from '../../routes';

// Services
import { useApi, useAuth } from '../../services';

export const EventContent = ({ event, user, refresh }) => {
  // Routing
  const history = useHistory();

  // States
  const [ participated, setParticipated ] = useState();

  // Services
  const { currentUser } = useAuth();
  const { participateEvent, withdrawEvent } = useApi();

  useEffect(() => {
    for (let participant of event.participants) {
      if (String(participant._userId._id) === String(user._id)) {
        setParticipated(true);
      };
    };
  }, [event, user]);

  const addParticipant = async () => {
    await participateEvent(currentUser, event._id);
    refresh();
  };

  const withdrawParticipant = async () => {
    await withdrawEvent(currentUser, event._id);
    refresh();
  };

  return (
    <div className="row">
      <div className="col-md-7 col-12">
        <div className="d-flex align-items-center">
          {
            !moment(Date.now()).isAfter(event.details.date) ? participated ? (
              <StandardButton text="Afmelden" action={withdrawParticipant} />
            ) : (
              <StandardButton text="Deelnemen" action={addParticipant} />
            ) : ''
          }
          {
            event.gpxFile && (
              <GreyButton extraClasses="margin-left-10" text="Download route" />
            )
          }
          {
            user._id === event._creatorId._id && (
              <StandardButton extraClasses="margin-left-10" text="Bewerken" action={() => history.push(Routes.EDIT_EVENT, {id: event._id})} />
            )
          }
          {
            user.role === 'club' && user._id === event._creatorId._id && (
              <StandardButton extraClasses="margin-left-10" text="Aanwezigheden" action={() => history.push(Routes.APPROVE_EVENT.replace(':id', event._id))} />
            )
          }
        </div>
        <div className="margin-top-30">
          <h4 className="secundary-font title-size bold-font">
            {event.title}
          </h4>
          <span className="secundary-font subtitle-size light-font">
            {event.details.location} | {DateText(event.details.date)}
          </span>
          <h5 className="secundary-font bold-font subtitle-size margin-top-30">Over dit evenement</h5>
          <p className="light-font tertiary-font text-size">
            {event.description}
          </p>
          <div className="margin-top-30 d-flex align-items-center">
            <div className="avatar avatar-small margin-right-20 pointer" onClick={() => history.push(Routes.PROFILE.replace(':name', SlugText(event._creatorId.firstName + ' ' + event._creatorId.lastName)).replace(':id', event._creatorId._id))} style={{
              backgroundImage: `url(${ImageUrl(event._creatorId.profile.avatar, DefaultUser)})`
            }}></div>
            <span className="secundary-font bold-font hover-text pointer text-size" onClick={() => history.push(Routes.PROFILE.replace(':name', SlugText(event._creatorId.firstName + ' ' + event._creatorId.lastName)).replace(':id', event._creatorId._id))}>
              {event._creatorId.firstName + ' ' + event._creatorId.lastName}
            </span>
          </div>
        </div>
      </div>
      <div className="col-md-5 col-12 d-flex justify-content-md-end justify-content-start margin-top-30">
        <div>
          <h5 className="secundary-font subtitle-size bold-font margin-bottom-20">Details</h5>
          {
            event.details.duration && (
              <div className="event__detail-item d-flex align-items-center">
                <div className="event__detail-item--content">
                  <ClockSVG />
                </div>
                <span>{event.details.duration} uur</span>
              </div>
            )
          }
          {
            event.details.speed && (
              <div className="event__detail-item d-flex align-items-center">
                <div className="event__detail-item--content">
                  <SpeedSVG />
                </div>
                <span>{event.details.speed}km/u</span>
              </div>
            )
          }
          {
            event.details.location && (
              <div className="event__detail-item d-flex align-items-center">
                <div className="event__detail-item--content">
                  <LocationSVG />
                </div>
                <span>{event.details.location}</span>
              </div>
            )
          }
          <h5 className="secundary-font subtitle-size bold-font margin-top-30 margin-bottom-20">Deelnemers</h5>
          <div className="event__participants d-flex">
            {
              event.participants.length === 0 ? (
                <span className="tertiary-font light-font text-size">
                  Geen deelnemers
                </span>
              ) : (
                event.participants.map((participant, index) => {
                  return index < 3 ? (
                    <div key={index} className="avatar avatar-small pointer" onClick={() => history.push(Routes.PROFILE.replace(':name', SlugText(participant._userId.firstName + ' ' + participant._userId.lastName)).replace(':id', participant._userId._id))} style={{
                      backgroundImage: `url(${ImageUrl(participant._userId.profile.avatar, DefaultUser)})`
                    }}></div>
                  ) : (
                    <div>
                      +{participant.length - 4}
                    </div>
                  )
                })
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
};
