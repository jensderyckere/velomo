import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Partials
import { GoalCard, GoalCharts, GoalContent } from '../partials';

// Services
import { useApi, useAuth } from '../services';

// Utils
import { ScreenSizeClassSwitch } from '../utils';

export const Goal = () => {
  const { id } = useParams();

  // Services
  const { currentUser, getCurrentUser } = useAuth();
  const { getGoal } = useApi();

  // States
  const [ user, setUser ] = useState();
  const [ goal, setGoal ] = useState();

  const fetchData = useCallback(async () => {
    try {
      const userData = await getCurrentUser(currentUser);
      setUser(userData);

      const goalData = await getGoal(currentUser, id);
      setGoal(goalData[0])
    } catch (e) {
      console.log(e);
    };
  }, [getCurrentUser, currentUser, getGoal, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return goal ? user ? (
    <div className={`container d-flex ${ScreenSizeClassSwitch('', 'flex-wrap')}`}>
      <section className={`left-sided p-relative ${ScreenSizeClassSwitch('w-30', 'w-100')}`}>
        <GoalCard 
          goal={goal}
        />
      </section>
      <section className={`right-sided p-relative ${ScreenSizeClassSwitch('w-70', 'w-100')}`}>
        <GoalContent 
          goal={goal}
          user={user}
        />
        <GoalCharts 
          goal={goal}
          user={user}
        />
      </section>
    </div>
  ) : '' : '';
};
