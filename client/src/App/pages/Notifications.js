import React, { useCallback, useEffect, useState } from 'react';

// Partials
import { 
  NotificationsOverview 
} from '../partials';

// Services
import {
  useApi,
  useAuth 
} from '../services';

export const Notifications = () => {
  // Services
  const { 
    getNotifications, 
    viewNotification,
  } = useApi();

  const {
    getCurrentUser,
    currentUser,
  } = useAuth();

  // States
  const [
    user,
    setUser
  ] = useState();

  const [
    notifications,
    setNotifications
  ] = useState();

  // Fetch notifications and user
  const fetchData = useCallback(async () => {
    const userData = await getCurrentUser(currentUser);
    const notificationsData = await getNotifications(currentUser);

    setUser(userData);
    setNotifications(notificationsData);

    if (notificationsData.length !== 0) {
      for (let i = 0; i < notificationsData.length; i++) {
        if (notificationsData[i].viewed === false) {
          await viewNotification(currentUser, notificationsData[i]._id);
        };
      };
    };
  }, [getCurrentUser, getNotifications, viewNotification, currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    user && notifications ? (
      <div className="container">
        <section className="right-sided w-100">
          <NotificationsOverview notifications={notifications} />
        </section>
      </div>
    ) : ''
  );
};