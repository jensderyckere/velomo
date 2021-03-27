import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

// Services
import { useApi, useAuth } from '../services';

// Routes
import * as Routes from '../routes';

// Partials
import { ChangeChallenge } from '../partials';

// Components
import { LoaderSVG } from '../components';

export const EditChallenge = () => {
  const { id } = useParams();

  // Routing
  const history = useHistory();

  // Services
  const { getCurrentUser, currentUser } = useAuth();
  const { getChallenge } = useApi();

  // States
  const [ user, setUser ] = useState();
  const [ challenge, setChallenge ] = useState();

  // Fetch details
  const fetchDetails = useCallback(async () => {
    try {
      const userResult = await getCurrentUser(currentUser);
      const challengeResult = await getChallenge(currentUser, id);
      setChallenge(challengeResult);
      setUser(userResult);

      if (userResult.role !== 'club') {
        history.push(Routes.ERROR);
      };
    } catch (e) {
      history.push(Routes.ERROR);
    };
  }, [getCurrentUser, currentUser, history, id, getChallenge]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return user ? challenge && (
    <>
      <div className="container d-flex">
        <section className={`left-sided w-100`}>
          <ChangeChallenge 
            challenge={challenge}
          />
        </section>
      </div>
    </>
  ) : <LoaderSVG />;
};
