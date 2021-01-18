import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

// Services
import { useAuth } from '../services';

// Routes
import * as Routes from '../routes';

export const NeedsAuth = ({children}) => {
  const { currentUser, setCurrentUser, verifyUser } = useAuth();

  useEffect(() => {
    setCurrentUser(verifyUser);
  }, [setCurrentUser, verifyUser]);

  return currentUser ? children : (
    <Redirect to={Routes.SIGNIN} />
  );
};
