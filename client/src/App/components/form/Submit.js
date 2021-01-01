import React from 'react';

// Import services
import { useStyling } from '../../services';

export const Submit = ({text}) => {
  const { screenSize } = useStyling();

  return (
    <button className={`submit-button ${screenSize}-submit`} type="submit">
      {text}
    </button>
  );
};
