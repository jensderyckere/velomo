import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Partials
import { ActivitiesOverview } from '../partials/activity';

// Routes
import * as Routes from '../routes';

// Services
import { useAuth } from '../services';

export const Activities = () => {
  // Routing
  const history = useHistory();

  // States
  const [ user, setUser ] = useState();

  // Services
  const { currentUser, getCurrentUser } = useAuth();

  // Fetch current user
  const fetchUser = useCallback(async () => {
    try {
      const data = await getCurrentUser(currentUser);

      if (data.role !== "cyclist") {
        history.push(Routes.ERROR);
        return;
      };

      setUser(data);
    } catch (e) {
      history.push(Routes.ERROR);
    };
  }, [history, getCurrentUser, currentUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return user ? (
    <>
    <div className="container d-flex">
      <div className="left-sided w-100">
        <h1 className="standard-title">
          Alle activiteiten
        </h1>
        <ActivitiesOverview 
          activities={user.cyclist._activityIds}
          cred={true}
          user={user}
        />
      </div>
    </div>
    </>
  ) : '';
};
