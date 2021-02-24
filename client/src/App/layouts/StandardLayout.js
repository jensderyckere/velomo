import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Services
import { useAuth } from '../services';

// Routes
import * as Routes from '../routes';

// Partials
import { Footer, Header } from '../partials';

export const StandardLayout = ({ children }) => {
  // Routing
  const history = useHistory();

  // Get token
  const { currentUser, getCurrentUser } = useAuth();

  // States
  const [ user, setUser ] = useState();

  // Fetch current user
  const fetchUser = useCallback(async () => {
    try {
      if (currentUser) {
        const data = await getCurrentUser(currentUser);
        setUser(data);
      };
    } catch (e) {
      history.push(Routes.ERROR);
    };
  }, [getCurrentUser, currentUser, history]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div className="app">
      {
        user && (
          <Header user={user} />
        )
      }
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};
