import React from 'react';
import { useHistory } from 'react-router';

export const NotFound = () => {
  // Routing
  const history = useHistory();

  return (
    <div className="not-found container">
      <div>
        <h1 className="secundary-font text-center bold-font title-size">Deze pagina lijkt niet te bestaan!</h1>
        <span onClick={() => history.goBack()} className="secundary-font orange-color bold-font text-size text-center">Keer terug</span>
      </div>
    </div>
  )
};