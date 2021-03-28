import React from 'react';
import { useHistory } from 'react-router';

// Images
import DefaultUser from '../../assets/icons/user.svg';

// Components
import { CheckSVG, ImageUrl, SlugText } from '../../components';

// Routes
import * as Routes from '../../routes';

// Services
import { useApi, useAuth } from '../../services';

export const CheckPrensence = ({ event, refresh }) => {
  // Routing
  const history = useHistory();

  // Services
  const { approvePresence } = useApi();
  const { currentUser } = useAuth();

  // Approve presence
  const approve = async (userId) => {
    await approvePresence(currentUser, event._id, userId);
    refresh();
  };

  return (
    <div className="row">
      <div className="col-12">
        <h2 className="secundary-font bold-font title-size margin-bottom-30">Alle deelnemers</h2>
        <div className="presence-wrapper">
          {
            event.participants.length !== 0 ? event.participants.map((participant, index) => {
              return !participant.present ? (
                <div className="presence-wrapper__item d-flex justify-content-between" key={index}>
                  <div className="d-flex align-items-center">
                    <div className="avatar avatar-small pointer" onClick={() => history.push(Routes.PROFILE.replace(':name', SlugText(participant._userId.firstName + ' ' + participant._userId.lastName)).replace(':id', participant._userId._id))} style={{
                      backgroundImage: `url(${ImageUrl(participant._userId.profile.avatar, DefaultUser)})`
                    }}></div>
                    <span className="secundary-font bold-font text-size margin-left-20">
                      {participant._userId.firstName + ' ' + participant._userId.lastName}
                    </span>
                  </div>
                  <div className="presence-wrapper__item--check" onClick={() => approve(participant._userId._id)}> 
                    <CheckSVG />
                  </div>
                </div>
              ) : ''
            }) : (
              <span className="tertiary-font light-font text-size">
                Er zijn geen deelnemers
              </span>
            )
          }
        </div>
      </div>
    </div>
  );
};
