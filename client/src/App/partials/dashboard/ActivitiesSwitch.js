import React, { useState } from 'react';

// Images
import Switch from '../../assets/icons/swap.png';
import User from '../../assets/icons/user.svg';

export const ActivitiesSwitch = ({ user, users, selected, setSelected }) => {
  const [ otherUser, setOtherUser ] = useState(false);

  return (
    <>
      <div className="activities-switch d-flex align-items-center">
        <div className="activities-switch__image" onClick={() => setOtherUser(!otherUser)}>
          <span className="avatar avatar-small" style={{
            backgroundImage: `url(${selected._userId.profile.avatar ? selected._userId.profile.avatar : User})`
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
          <div className="more-view">
            <h2 className="orange-color secundary-font bold-font title-size margin-0">Wissel naar een andere renner</h2>
            {users && users.map((element, index) => {
              return (
                <div className="more-view__user">

                </div>
              )
            })}
          </div>
        )
      }
    </>
  );
};
