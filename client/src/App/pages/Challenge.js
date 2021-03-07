import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

// Partials
import { ChallengeCard, ChallengeCharts, ChallengeContent } from '../partials';

// Services
import { useApi, useAuth } from '../services';

// Utils
import { ScreenSizeClassSwitch } from '../utils';

// Routes
import * as Routes from '../routes';

export const Challenge = () => {
  const { id } = useParams();

  // Routing
  const history = useHistory();

  // Services
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
      history.push(Routes.ERROR);
    };
  }, [getCurrentUser, currentUser, getChallenge, id, history]);

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
        <section className={`right-sided p-relative ${ScreenSizeClassSwitch('w-70', 'w-100')}`}>
          {
            challenge.type === 'duration' && (
              <ChallengeCharts 
                challenge={challenge}
                user={user}
              />
            )
          }
          {
            challenge.type === 'distance' && (
              <ChallengeCharts 
                challenge={challenge}
                user={user}
              />
            )
          }
          <ChallengeContent 
            challenge={challenge}
            user={user}
          />
        </section>
      </div>
    ) : ''
  );
};
