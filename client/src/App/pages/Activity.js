import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

// Services
import { useApi, useStyling, useAuth } from '../services';

// Utils
import { ScreenSizeClassSwitch } from '../utils';

// Routes
import * as Routes from '../routes';

// Partials
import { ActivityBio, ActivityMap } from '../partials';

export const Activity = () => {
  // Id of activity 
  const { id } = useParams();

  // Routing
  const history = useHistory();

  // Services
  const { screenSize } = useStyling();
  const { currentUser, getCurrentUser } = useAuth();
  const { getActivity } = useApi();

  // States
  const [ user, setUser ] = useState();
  const [ activity, setActivity ] = useState();

  // Fetch activity and current user
  const fetchData = useCallback(async () => {
    try {
      const userData = await getCurrentUser(currentUser);
      const activityData = await getActivity(currentUser, id);

      setUser(userData);
      setActivity(activityData);
    } catch (e) {
      history.push(Routes.ERROR);
    };
  }, [getCurrentUser, currentUser, history, id, getActivity]);

  useEffect(() => {
    fetchData();
    return;
  }, [fetchData]);
  
  return (
    user && activity ? (
      <>
      {
        screenSize === 'xl' || screenSize === 'lg' ? (
          <div className={`container d-flex ${ScreenSizeClassSwitch('', 'flex-wrap')}`}>
            <section className="left-sided w-60">
              <ActivityBio user={user} activity={activity} />
            </section>
            <section className="right-sided w-40">
              <ActivityMap activity={activity} />
            </section>
          </div>
        ) : (
          <>
            <ActivityMap activity={activity} />
            <section className="padding-30">
              <ActivityBio user={user} activity={activity} />
            </section>
          </>
        )
      }
      </>
    ) : (
      <></>
    )
  );
};
