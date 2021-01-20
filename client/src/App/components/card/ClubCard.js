import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Services
import { useAuth } from '../../services';

// Routes
import * as Routes from '../../routes';

// Config
import * as Config from '../../config';

// Images
import CoverDefault from '../../assets/images/cover_default.jpg';
import UserDefault from '../../assets/icons/user.svg';
import { StandardButton } from '../button';

// Components
import { SlugText } from '../text';
import { LoaderSVG } from '../svg';

export const ClubCard = ({ clubid }) => {
  const history = useHistory();
  const { getUser, currentUser } = useAuth();

  const [ club, setClub ] = useState();

  const fetchClub = useCallback(async () => {
    try {
      const data = await getUser(currentUser, clubid);
      setClub(data);
    } catch (e) {
      history.push(Routes.ERROR);
    };
  }, [getUser, currentUser, Routes, history]);

  useEffect(() => {
    fetchClub();
  }, [fetchClub]);

  return (
    <div className="club-card">
      {
        club ? (
          <>
            <div className="club-card--cover cover" style={{
              backgroundImage: `url(${club.club.cover ? `${Config.clientConfig.apiUrl}picture/${club.club.cover}` : CoverDefault})`
            }}>
            </div>
            <div className="d-flex justify-content-center">
              <span className="club-card--avatar avatar avatar-big" style={{
                backgroundImage: `url(${club.profile.avatar ? `${Config.clientConfig.apiUrl}picture/${club.profile.avatar}`: UserDefault})`
              }}>
              </span>
            </div>
            <h3 className="club-card--title text-center title-size secundary-font bold-font margin-top-20">{club.club.name}</h3>
            <p className="club-card--location text-center text-size secundary-font">{club.club.location}</p>
            <div className="d-flex justify-content-center margin-top-50">
              <StandardButton 
                text="Bekijk club"
                action={() => history.push(Routes.CLUB.replace(':name', SlugText(club.club.name)).replace(':id', club._id))}
              />
            </div>
          </>
        ) : <LoaderSVG />
      }
    </div>
  );
};
