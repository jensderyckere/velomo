import React from 'react';

export const StandardButton = ({ extraClasses, text, action }) => {
  return (
    <span onClick={action} className={`standard-button ${extraClasses ? extraClasses : ''}`}>
      {text}
    </span>
  );
};
