import React from 'react';
import { useHistory } from 'react-router';

// Components
import { ImageUrl, SlugText } from '../../components';

// Images
import User from '../../assets/icons/user.svg';
import Cover from '../../assets/images/cover_default.jpg';
import DefaultUser from '../../assets/icons/user.svg';

// Partials
import { UserStats } from './UserStats';

// Routes
import * as Routes from '../../routes';

export const UserCard = ({ user, screenSize }) => {
  // Routing
  const history = useHistory();

  return (
    <div className={`user-card radius-10 box-shadow no-overflow ${screenSize === 'xl' || screenSize === 'lg' ? '' : 'p-relative'}`}>
      {
        user.role === 'club' ? (
          <div className="user-card__cover d-flex align-items-center justify-content-center" style={{
            backgroundImage: `url(${ImageUrl(user.club.cover, Cover)})`
          }}>
            <span className="user-card__cover--avatar avatar avatar-big box-shadow" style={{
              backgroundImage: `url(${ImageUrl(user.profile.avatar, User)})`
            }}>
            </span>
          </div>
        ) : (
          <div className="user-card__cover" style={{
            backgroundImage: `url(${ImageUrl(user.profile.avatar, User)})`
          }}>
          </div>
        )
      }
      <div className="padding-30">
        <h3 className="user-card__title text-center secundary-font bold-font subtitle-size">
          {user.role === 'club' ? user.club.name ? user.club.name : 'De Onbekenden' : `${user.firstName + ' ' + user.lastName}`}
        </h3>
        <p className="user-card__subtitle text-center secundary-font text-size darkgrey-color">
          {
            user.role === 'club' ? user.club.location ? user.club.location : 'Een mysterieus eiland' : 
            user.role === 'parent' ? 'Ouder van' : 
            user.role === 'cyclist' ? user.cyclist._clubId ? user.cyclist._clubId._userId.club.name : 'Individueel' : 
            user.role === 'clubmember' ? user.member._clubId ? user.member._clubId._userId.club.name : 'Nog niet aangesloten' : false
          }
        </p>
        {
          user.role === 'cyclist' && (
            <div className="user-card__extra radius-10 bg-lightgrey d-flex justify-content-between align-items-center">
              <UserStats user={user} />
            </div>
          )
        }
        {
          user.role === 'parent' && (
            <div className="user-card__extra">

              {
                user.parent._cyclistIds.map((cyclist, index) => {
                  return <div key={index} className="avatar avatar-small pointer" onClick={() => history.push(Routes.PROFILE.replace(':name', SlugText(cyclist._userId.firstName + ' ' + cyclist._userId.lastName)).replace(':id', cyclist._userId._id))} style={{
                    backgroundImage: `url(${ImageUrl(cyclist._userId.profile.avatar, DefaultUser)})`
                  }}></div>
                })
              }
            </div>
          )
        }
        <div className="user-card__bio tertiary-font text-size standard-lh">
          <h6 className="secundary-font bold-font text-size">Biografie</h6>
          {
            user.profile.bio ? user.profile.bio : 'Deze fanaat is druk naar de koers aan het kijken.'
          }
        </div>
      </div>
    </div>
  );
};
