import React from 'react';

export const StandardButton = ({ extraClasses, text, action }) => {
  return (
    <span className={`standard-button ${extraClasses && extraClasses}`}>
      {text}
    </span>
  );
};
