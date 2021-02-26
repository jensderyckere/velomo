import React from 'react';
import { useHistory } from 'react-router-dom';

// Components
import { Badge, DateText, ImageUrl, StandardButton } from '../../components';

// Routes
import * as Routes from '../../routes';

export const ChallengeCard = ({ challenge, user }) => {
  // Routing
  const history = useHistory();

  return (
    <div className="challenge-card radius-10 box-shadow no-overflow">
      <h4 className="secundary-font bold-font subtitle-size text-center">
        Te verdienen badge
      </h4>
      <div className="d-flex justify-content-center margin-top-30">
        {
          user.role !== 'cyclist' && (
            <Badge 
              badge={{
                id: challenge._id,
                size: 'big',
                image: ImageUrl(challenge.badge, ''),
              }}
            />
          )
        }
      </div>
      <div className="d-flex justify-content-center">
        <span className="darkgrey-color tertiary-font text-size margin-top-20">
          {DateText(challenge.start_date) + ' - ' + DateText(challenge.end_date)}
        </span>
      </div>
      <div className="d-flex justify-content-center margin-top-50">
        {
          user.role === 'club' && (
            <StandardButton 
              text="Bewerk uitdaging"
              action={() => history.push(Routes.EDIT_CHALLENGE.replace(':id', challenge._id))}
            />
          )
        }
      </div>
    </div>
  );
};
