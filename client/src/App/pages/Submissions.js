import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

// Services
import { useApi, useAuth } from '../services';

// Routes
import * as Routes from '../routes';

// Partials
import { SubmissionCard } from '../partials';

// Components
import { LoaderSVG } from '../components';

export const Submissions = () => {
  const { id } = useParams();

  // Routing
  const history = useHistory();

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

      if (userData._id !== challengeData._userId) {
        throw new Error();
      };
    } catch (e) {
      history.push(Routes.ERROR);
    };
  }, [getCurrentUser, currentUser, getChallenge, id, history]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return user ? challenge && (
    <div className="container">
      <section className="w-100">
        <h1 className="secundary-font bold-font title-size">Inzendingen die goedgekeurd moeten worden</h1>
        <div className="margin-top-30 row">
          {
            challenge.submissions.map((submission, index) => {
              return !submission.approved && <SubmissionCard submission={submission} cred={true} key={index} challenge={challenge} />
            })
          }
        </div>
      </section>
    </div>
  ) : <LoaderSVG />;
};
