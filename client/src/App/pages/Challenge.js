import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Partials
import { ChallengeCard } from '../partials';

// Services
import { useApi, useAuth } from '../services';

// Utils
import { ScreenSizeClassSwitch } from '../utils';

export const Challenge = () => {
  const { id } = useParams();

  //Services
  const { currentUser, getCurrentUser } = useAuth();
  const { getChallenge } = useApi();

  // States
  const [ user, setUser ] = useState();
  const [ challenge, setChallenge ] = useState();

  const fetchData = useCallback(async () => {
    try {
      const userData = await getCurrentUser(currentUser);
      const challengeData = await getChallenge(currentUser, id);
      setChallenge(challengeData);
      setUser(userData);
    } catch (e) {
      console.log(e);
    };
  }, [getCurrentUser, currentUser, getChallenge, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    user && challenge ? (
      <div className={`container d-flex ${ScreenSizeClassSwitch('', 'flex-wrap')}`}>
        <section className={`left-sided p-relative ${ScreenSizeClassSwitch('w-30', 'w-100')}`}>
          <ChallengeCard 
            challenge={challenge}
            user={user}
          />
        </section>
      </div>
    ) : ''
  );
};
