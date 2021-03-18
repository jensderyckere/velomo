import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';

// Services
import { useApi, useAuth } from '../services';

// Routes
import * as Routes from '../routes';

// Components
import { LoaderSVG } from '../components';

// Config
import * as Config from '../config';

export const CallbackStrava = () => {
  // Services
  const { importStravaActivities } = useApi();
  const { currentUser } = useAuth();

  // Routing
  const history = useHistory();

  const fetchActivities = useCallback(async () => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("code");
    
    const authorization = await fetch(`https://www.strava.com/oauth/token?client_id=${Config.clientConfig.stravaClientId}&client_secret=${Config.clientConfig.stravaClientSecret}&code=${token}&grant_type=authorization_code`, {
      method: 'POST',
    }).then((res) => {
      return res.json();
    });

    const activities = await fetch(`https://www.strava.com/api/v3/athlete/activities`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${authorization.access_token}`,
      },
    }).then((res) => {
      return res.json();
    });

    await importStravaActivities(currentUser, {activities});
    
    history.push(Routes.ACTIVITIES);
  }, [importStravaActivities, currentUser, history]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return <LoaderSVG />;
};