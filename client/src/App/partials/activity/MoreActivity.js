import React from 'react';
import { NavLink } from 'react-router-dom';

// Utils
import { SlugText, TrashSVG } from '../../components';

// Routes
import * as Routes from '../../routes';

// Images
import MyProfile from '../../assets/icons/profile.svg';

export const MoreActivity = ({ownership, user, deleteRide}) => {
  return (
    <div className="activities__bio--more--view more-view">
      <div className="more-view__link">
        <NavLink to={Routes.PROFILE.replace(':name', SlugText(`${user.firstName + ' ' + user.lastName}`)).replace(':id', user._id)}>
            <img src={MyProfile} alt="profile" />
            <span>Bekijk profiel</span>
        </NavLink>
      </div>
      {
        ownership ? (
          <>
          <div className="more-view__link--delete" onClick={deleteRide}>
            <TrashSVG />
            <span>Verwijder rit</span>
          </div>
          </>
        ) : (
          ''
        )
      }
    </div>
  )
};
