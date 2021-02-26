import React from 'react';
import { useHistory } from 'react-router-dom';

// Routes
import * as Routes from '../../routes';

export const Badge = ({ badge }) => {
  // Routing
  const history = useHistory();

  return (
    <span className="standard-badge pointer d-inline-flex" onClick={() => history.push(Routes.CHALLENGE.replace(':id', badge.id))}>
      <div className={`avatar avatar-${badge.size}`} style={{
        backgroundImage: `url(${badge.image})`
      }}></div>
    </span>
  );
};
