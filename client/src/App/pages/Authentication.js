import React from 'react';
import { Redirect } from 'react-router-dom';

// Importing partials
import { LoginSection, RegisterSection, ResetPassword, EditPassword, SuccessPassword, RegisterRoleSection } from '../partials';

// Some services
import { useAuth } from '../services';

// Routes
import * as Routes from '../routes';

export const Authentication = ({auth, quote}) => {
  const { currentUser } = useAuth();

  return currentUser ? (
    <Redirect to={Routes.DASHBOARD} />
  ) : auth === 'signin' ? (
    <LoginSection quote={quote} />
  ) : auth === 'signup' ? (
    <RegisterSection quote={quote} />
  ) : auth === 'reset-password' ? (
    <ResetPassword quote={quote} />
  ) : auth === 'edit-password' ? (
    <EditPassword quote={quote} />
  ) : auth === 'success-password' ? (
    <SuccessPassword quote={quote} />
  ) : auth === 'signup-role' ? (
    <RegisterRoleSection quote={quote} />
  ): ''
};