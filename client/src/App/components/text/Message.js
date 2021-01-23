import React from 'react';

export const Message = ({error, message}) => {
  return (
    <span className={`${error ? 'error-message' : 'success-message'}`}>
      {message}
    </span>
  );
};
