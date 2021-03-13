import React from 'react';

// Components
import { Badge, DateText, ImageUrl } from '../../components';

export const GoalCard = ({ goal, user }) => {
  return (
    <div className="challenge-card radius-10 box-shadow no-overflow">
      <h4 className="secundary-font bold-font subtitle-size text-center">
        Te verdienen badge
      </h4>
      <div className="d-flex justify-content-center margin-top-30">
        <Badge 
          badge={{
            id: goal._id,
            size: 'big',
            image: ImageUrl(goal.badge, ''),
          }}
        />
      </div>
      <div className="d-flex justify-content-center">
        <span className="darkgrey-color tertiary-font text-size margin-top-20">
          {DateText(goal.start_date) + ' - ' + DateText(goal.end_date)}
        </span>
      </div>
    </div>
  );
};