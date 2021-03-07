import React, { useCallback, useEffect, useState } from 'react';

// Services
import { useApi } from '../../services';

// Partials
import { ChallengeItem } from '../challenges';

export const UserBadges = ({ currentUser }) => {
  // States
  const [ current, setCurrent ] = useState('challenges');
  const [ challenges, setChallenges ] = useState();

  // Services
  const { getMyChallenges } = useApi();

  // Fetch
  const fetchData = useCallback(async () => {
    const challengesData = await getMyChallenges(currentUser);
    setChallenges(challengesData);
  }, [getMyChallenges, currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return challenges ? (
    <div className="margin-top-50 user-badges">
      <h1 className="secundary-font bold-font title-size">Verdiensten</h1>
      <div className="d-flex margin-top-30 align-items-center justify-content-end">
        <h3 onClick={() => setCurrent('challenges')} className={`pointer subtitle-size bold-font secundary-font margin-right-10`}>
          Uitdagingen
        </h3>
      </div>
      <div className="margin-top-20">
        {
          current === 'challenges' && (
            challenges.length !== 0 ? challenges.map((challenge, index) => {
              return challenge.completed && (
                <ChallengeItem challenge={challenge._challengeId} key={index} />
              )
            }) : (
              <span className="tertiary-font text-size light-font">Er zijn nog geen uitdagingen voltooid.</span>
            )
          )
        }
      </div>
    </div>
  ) : '';
};
