import React from 'react';

// Importing partials
import { LoginSection, RegisterSection, ResetPassword, EditPassword, SuccessPassword} from '../partials';

export const Authentication = ({auth, quote}) => {
  return auth === 'signin' ? (
    <LoginSection quote={quote} />
  ) : auth === 'signup' ? (
    <RegisterSection quote={quote} />
  ) : auth === 'reset-password' ? (
    <ResetPassword quote={quote} />
  ) : auth === 'edit-password' ? (
    <EditPassword quote={quote} />
  ) : auth === 'success-password' && (
    <SuccessPassword quote={quote} />
  );
};