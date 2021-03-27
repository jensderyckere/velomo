import React from 'react';

export const UserPts = ({ user }) => {
  return (
    <div className="user-pts box-shadow radius-20 padding-30 d-flex align-items-center">
      <div className="user-pts__item">
        <h6 className="secundary-font bold-font title-size">
          Aantal punten
        </h6>
        <h3 className="secundary-font bold-font orange-color">
          {user.cyclist.pts ? user.cyclist.pts : 0}
        </h3>
      </div>
      <div className="user-pts__item margin-left-30">
        <h6 className="secundary-font bold-font title-size">
          Beloningen geclaimed
        </h6>
        <h3 className="secundary-font bold-font orange-color">
          5/10
        </h3>
      </div>
    </div>
  );
};
