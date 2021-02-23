import React, { useState } from 'react';

// Images
import Switch from '../../assets/icons/swap.png';
import User from '../../assets/icons/user.svg';
import { ImageUrl } from '../../components';

export const ActivitiesSwitch = ({ user, users, selected, setSelected }) => {
  const [ otherUser, setOtherUser ] = useState(false);

  const changeSelected = (element) => {
    setSelected(element);
    setOtherUser(!otherUser);
  };

  return (
    <div className="p-relative no-scroll">
      <div className="activities-switch d-flex align-items-center">
        <div className="activities-switch__image" onClick={() => setOtherUser(!otherUser)}>
          <span className="avatar avatar-small" style={{
            backgroundImage: `url(${ImageUrl(selected._userId.profile.avatar, User)})`
          }}>
          </span>
          <img src={Switch} alt="switch" />
        </div>
        <h1 className="secundary-font bold-font title-size margin-0">
          Activiteiten van {selected._userId.firstName}
        </h1>
      </div>
      {
        otherUser && (
          <div className="activities-switch__more more-view scroll">
            <h2 className="orange-color secundary-font bold-font subtitle-size margin-0 margin-bottom-20">Wissel om naar...</h2>
            {users && users.map((element, index) => {
              return (
                <div key={index} onClick={() => changeSelected(element)} className="more-view__user d-flex align-items-center">
                  <span className="more-view__user--avatar avatar avatar-small" style={{
                    backgroundImage: `url(${ImageUrl(element._userId.profile.avatar, User)})`
                  }}></span>
                  <span className="more-view__user--info secundary-font bold-font text-size margin-left-20">
                    <strong>
                      {element._userId.firstName + ' ' + element._userId.lastName}
                    </strong>
                  </span>
                </div>
              )
            })}
          </div>
        )
      }
    </div>
  );
};
