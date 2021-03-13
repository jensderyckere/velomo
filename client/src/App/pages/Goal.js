import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

// Partials
import { GoalCard, GoalCharts, GoalContent } from '../partials';

// Services
import { useApi, useAuth } from '../services';

// Utils
import { ScreenSizeClassSwitch } from '../utils';

// Routes
import * as Routes from '../routes';

export const Goal = () => {
  const { id } = useParams();

  // Routing
  const history = useHistory();

  // Services
  const { currentUser, getCurrentUser } = useAuth();
  const { getGoal } = useApi();

  // States
  const [ user, setUser ] = useState();
  const [ goal, setGoal ] = useState();

  const fetchData = useCallback(async () => {
    try {
      const userData = await getCurrentUser(currentUser);
      const goalData = await getGoal(currentUser, id);
      setGoal(goalData);
      setUser(userData);
    } catch (e) {
      history.push(Routes.ERROR);
    };
  }, [getCurrentUser, currentUser, getGoal, id, history]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    user && goal ? (
      <div className={`container d-flex ${ScreenSizeClassSwitch('', 'flex-wrap')}`}>
        <section className={`left-sided p-relative ${ScreenSizeClassSwitch('w-30', 'w-100')}`}>
          <GoalCard 
            goal={goal}
            user={user}
          />
        </section>
        <section className={`right-sided p-relative ${ScreenSizeClassSwitch('w-70', 'w-100')}`}>
          <GoalContent 
            goal={goal}
            user={user}
          />
          <GoalCharts 
            goal={goal}
          />
        </section>
      </div>
    ) : ''
  );
};
