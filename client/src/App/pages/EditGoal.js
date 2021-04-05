import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';

// Components
import { LoaderSVG } from '../components';

// Partials
import { ChangeGoal } from '../partials';

// Services
import { useApi, useAuth } from '../services';

export const EditGoal = () => {
  // Location
  const { id } = useParams();

  // States
  const [ user, setUser ] = useState();
  const [ goal, setGoal ] = useState();

  // Services
  const { currentUser, getCurrentUser } = useAuth();
  const { getGoal } = useApi();

  const fetchNeeded = useCallback(async () => {
    const userData = await getCurrentUser(currentUser);
    const goalData = await getGoal(currentUser, id);
    setUser(userData);
    setGoal(goalData[0]);
  }, [currentUser, getCurrentUser, getGoal, id]);

  useEffect(() => {
    fetchNeeded();
  }, [fetchNeeded]);

  return user ? goal ? (
    <div className="container d-flex">
      <section className="left-sided w-100">
        <ChangeGoal user={user} goal={goal} />
      </section>
    </div>
  ) : <LoaderSVG /> : <LoaderSVG />;
};
