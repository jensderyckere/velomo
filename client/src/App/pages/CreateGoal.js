import React, { useCallback, useEffect, useState } from 'react';

// Partials
import { AddGoal } from '../partials';

// Services
import { useAuth } from '../services';

export const CreateGoal = () => {
  // States
  const [ user, setUser ] = useState();

  // Services
  const { currentUser, getCurrentUser } = useAuth();

  const fetchNeeded = useCallback(async () => {
    const userData = await getCurrentUser(currentUser);
    setUser(userData);
  }, [currentUser, getCurrentUser]);

  useEffect(() => {
    fetchNeeded();
  }, [fetchNeeded]);

  return user ? (
    <div className="container d-flex">
      <section className="left-sided w-100">
        <AddGoal user={user} />
      </section>
    </div>
  ) : '';
};
