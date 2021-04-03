import React, { useCallback, useEffect, useState } from 'react';

// Services
import { useApi } from '../../services';

// Partials
import { ChallengeItem } from '../challenges';
import { GoalItem } from '../goals';

export const UserBadges = ({ currentUser, user }) => {
  // States
  const [ current, setCurrent ] = useState('challenges');
  const [ challenges, setChallenges ] = useState();
  const [ goals, setGoals ] = useState();

  // Services
  const { getCompletedChallenges, getCompletedGoals } = useApi();

  // Fetch
  const fetchData = useCallback(async () => {
    const challengesData = await getCompletedChallenges(currentUser, user._id);
    const goalsData = await getCompletedGoals(currentUser, user._id);

    setChallenges(challengesData);
    setGoals(goalsData);
  }, [getCompletedChallenges, getCompletedGoals, currentUser, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return challenges ? (
    <div className="margin-top-50 user-badges">
      <h1 className="secundary-font bold-font title-size">Verdiensten</h1>
      <div className="d-flex margin-top-30 align-items-center justify-content-end">
        <h3 onClick={() => setCurrent('challenges')} className={`pointer subtitle-size bold-font secundary-font margin-right-10 ${current === 'challenges' ? 'active' : 'inactive'}`}>
          Uitdagingen
        </h3>
        <h3 onClick={() => setCurrent('goals')} className={`pointer subtitle-size bold-font secundary-font margin-right-10 ${current === 'goals' ? 'active' : 'inactive'}`}>
          Doelstellingen
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
        {
          current === 'goals' && (
            goals.length !== 0 ? goals.map((goal, index) => {
              return (
                <GoalItem goal={goal} key={index} />
              )
            }) : (
              <span className="tertiary-font text-size light-font">Er zijn nog geen doelstellingen voltooid.</span>
            )
          )
        }
      </div>
    </div>
  ) : '';
};
