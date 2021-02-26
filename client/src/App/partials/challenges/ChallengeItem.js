import React from 'react';
import { useHistory } from 'react-router-dom';

// Components
import { Badge, ImageUrl } from '../../components';

// Routes
import * as Routes from '../../routes';

export const ChallengeItem = ({ challenge, completed }) => {
  // Routing
  const history = useHistory();

  return (
    <div className="challenge-overview__items--item box-shadow radius-20 d-flex align-items-center">
      <div className="d-inline-flex margin-right-20">
        <Badge 
          badge={{
            id: challenge._id,
            size: 'standard',
            image: ImageUrl(challenge.badge, ''),
          }}
        />
      </div>
      <div className="challenge-overview__items--item--text">
        <h2 className="secundary-font bold-font subtitle-size hover-text pointer" onClick={() => history.push(Routes.CHALLENGE.replace(':id', challenge._id))}>
          "{challenge.title}"
        </h2>
        <span className="tertiary-font text-size darkgrey-color margin-top-20">{challenge.shortContent}</span>
      </div>
    </div>
  );
};
