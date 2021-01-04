import React from 'react';

export const AuthError = ({message}) => {
  return (
    <div className="auth__error">
      {message}
    </div>
  );
};
