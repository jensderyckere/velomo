import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { default as Moment } from 'moment';
import 'moment/locale/nl-be';

// Components
import { Badge } from '../badge';
import { DateText, ImageUrl } from '../text';

// Routes
import * as Routes from '../../routes';

export const ChallengesCard = ({ title, challenges }) => {
  // Routing
  const history = useHistory();

  // States
  const [ noChallenges, setNoChallenges ] = useState(true);

  useEffect(() => {
    for (let challengeItem of challenges) {
      if (Moment(Date.now()).isBetween(challengeItem.start_date, challengeItem.end_date)) {
        setNoChallenges(false);
      };
    };
  }, [challenges]);

  const ChallengeShort = ({ challenge }) => {
    return !challenge.completed && Moment(Date.now()).isBetween(challenge.start_date, challenge.end_date) ? (
      <div className="challenge-card__item d-flex align-items-center margin-top-10">
        <Badge 
          badge={{
            id: challenge._id,
            size: 'small',
            image: ImageUrl(challenge.badge)
          }}
        />
        <div className="margin-left-20">
          <h5 className="secundary-font text-size bold-font margin-0 pointer hover-text" onClick={() => history.push(Routes.CHALLENGE.replace(':id', challenge._id))}>
            {challenge.title}
          </h5>
          <p className="tertiary-font text-size light-font margin-0">
            Loopt tot {DateText(challenge.end_date)}
          </p>
        </div>
      </div>
    ) : ''
  };

  return (
    <div className="grey-card challenge-card">
      <h3 className="secundary-font text-center title-size bold-font margin-bottom-30">{title}</h3>
      {
        !noChallenges ? challenges.map((challenge, index) => {
          return challenge._challengeId ? <ChallengeShort key={index} challenge={challenge._challengeId} /> : <ChallengeShort key={index} challenge={challenge} />
        }) : (
          <div className="text-center light-font secundary-font text-size">Er zijn geen actieve uitdagingen momenteel.</div>
        )
      }
    </div>
  )
};
