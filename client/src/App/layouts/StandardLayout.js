import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Services
import { useApi, useAuth } from '../services';

// Routes
import * as Routes from '../routes';

// Partials
import { Footer, Header } from '../partials';

export const StandardLayout = ({ children }) => {
  // Routing
  const history = useHistory();

  // Get token
  const { currentUser, getCurrentUser } = useAuth();
  const { getNotifications } = useApi();

  // States
  const [ user, setUser ] = useState();
  const [ amountNotifications, setAmountNotifications ] = useState(0);

  // Fetch current user
  const fetchUser = useCallback(async () => {
    try {
      if (currentUser) {
        const data = await getCurrentUser(currentUser);
        const notificationsData = await getNotifications(currentUser);
        setUser(data);
        setAmountNotifications(notificationsData.length);
      };
    } catch (e) {
      history.push(Routes.ERROR);
    };
  }, [getCurrentUser, currentUser, history, getNotifications]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div className="app">
      {
        user && (
          <Header user={user} notifications={amountNotifications} />
        )
      }
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};
