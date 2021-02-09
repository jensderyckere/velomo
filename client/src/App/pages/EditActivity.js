import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// Partials
import { EditForm } from '../partials';

// Routes
import * as Routes from '../routes';

export const EditActivity = () => {
  // Routing
  const history = useHistory();

  // Receive states
  const { state } = useLocation();
  const activity = state.activity;

  // Check if activity is in state
  useEffect(() => {
    if (!activity) {
      history.push(Routes.ERROR);
    };
  }, [activity, history]);

  return activity ? (
    <>
      <div className="container d-flex">
        <section className="left-sided w-100">
          <EditForm activity={activity} />
        </section>
      </div>
    </>
  ) : '';
};
