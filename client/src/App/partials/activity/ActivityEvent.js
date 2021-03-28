import React from 'react';
import { useHistory } from 'react-router';

// Components
import { DateText, ImageUrl, SlugText } from '../../components';

// Images
import DefaultUser from '../../assets/icons/user.svg';

// Routes
import * as Routes from '../../routes';

export const ActivityEvent = ({ event, user }) => {
  // Routing
  const history = useHistory();

  return (
    <div className="activity-event margin-top-50">
      <h2 className="secundary-font subtitle-size bold-font">
        Geconnecteerd evenement
      </h2>
      <p className="tertiary-font text-size light-font">
        Deze activiteit werd gekoppeld aan een evenement. U was deel van de groepsrit <strong>"{event.title}"</strong>. Onderaan vind je nog wat details terug over deze groepsrit.
      </p>
      <div onClick={() => history.push(Routes.EVENT.replace(':id', event._id))} className="events-calendar__events-item margin-top-30">
        <div>
          <h5 className="secundary-font text-size bold-font margin-0">
            {event.title}
          </h5>
          <p className="margin-0 text-size light-font secundary-font">
            Op {DateText(event.details.date)}
          </p>
        </div>
        <span className="secundary-font text-size bold-font">
          {event.type}
        </span>
      </div>
      <h5 className="text-size bold-font secundary-font margin-top-50">
        Lotgenoten op dit evenement
      </h5>
      <div className="event__participants d-flex margin-top-20">
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
  );
};
