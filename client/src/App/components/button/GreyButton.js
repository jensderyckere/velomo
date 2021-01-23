import React from 'react';

export const GreyButton = ({ extraClasses, text, action }) => {
  return (
    <span onClick={action} className={`grey-button ${extraClasses && extraClasses}`}>
      {text}
    </span>
  );
};
