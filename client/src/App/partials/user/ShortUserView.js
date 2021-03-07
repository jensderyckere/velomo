import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

// Images
import UserDefault from '../../assets/icons/user.svg';

// Components
import { ChatSVG, ImageUrl, MoreSVG, SlugText, TrashSVG } from '../../components';

// Routes
import * as Routes from '../../routes';

// Images
import MyProfile from '../../assets/icons/profile.svg';

// Services
import { useAuth } from '../../services';

export const ShortUserView = ({ user, club, cred }) => {
  const history = useHistory();

  const [ more, setMore ] = useState(false);
  const [ viewingUser, setViewingUser ] = useState();

  // Services
  const { undoConnection, getCurrentUser, currentUser } = useAuth();

  // Fetch
  const fetchData = useCallback(async () => {
    const data = await getCurrentUser(currentUser);
    setViewingUser(data);
  }, [getCurrentUser, currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Disconnect
  const disconnectUser = async () => {
    await undoConnection(currentUser, viewingUser._id, user._id);
    window.location.reload();
  };

  return user ? viewingUser && (
    <div className="short-user-view">
      <div className="short-user-view__left" onClick={() => history.push(Routes.PROFILE.replace(':name', SlugText(`${user.firstName + ' ' + user.lastName}`)).replace(':id', user._id))}>
        <span className="avatar avatar-standard" style={{
          backgroundImage: `url(${ImageUrl(user.profile.avatar, UserDefault)})`,
        }}></span>
        <span className="tertiary-font text-size">
          <strong className="secundary-font">{user.firstName + ' ' + user.lastName}</strong><br/>
          {
            club && `Lid van ${club}`
          }
        </span>
      </div>
      <div className="short-user-view__right" onClick={() => setMore(!more)}>
        <MoreSVG />
      </div>
      {
        more && (
          <div className="short-user-view__more more-view">
            <div className="more-view__link">
              <NavLink to={Routes.PROFILE.replace(':name', SlugText(`${user.firstName + ' ' + user.lastName}`)).replace(':id', user._id)}>
                <img src={MyProfile} alt="profile" />
                <span>Mijn profiel</span>
              </NavLink>
            </div>
            <div className="more-view__link">
              <NavLink to={Routes.CREATE_CHAT}>
                <ChatSVG />
                <span>Stuur bericht</span>
              </NavLink>
            </div>
            {
              cred && (
                <div className="more-view__link--delete" onClick={disconnectUser}>
                  <TrashSVG />
                  <span>Verwijder</span>
                </div>
              )
            }
          </div>
        )
      }
    </div>
  ) : ''
};
