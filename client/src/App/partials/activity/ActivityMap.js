import React, { useEffect, useState } from 'react';

// Components
import { Map } from '../../components';

// Utils
import { ScreenSizeClassSwitch } from '../../utils';

export const ActivityMap = ({ activity }) => {
  const [ coordinates, setCoordinates ] = useState();

  useEffect(() => {
    if (activity.activity.checkpoints) {
      const checkpoints = activity.activity.checkpoints;
      let array = [];
  
      for (let i = 0; i < checkpoints.length; i++) {
        const coordinate = [checkpoints[i].lon, checkpoints[i].lat];
        array.push(coordinate);
      };
  
      setCoordinates(array);
    };
  }, [activity.activity.checkpoints]);

  return (
    <div className={`activities__map ${ScreenSizeClassSwitch('', 'mobile-map')}`}>
      { coordinates ? <Map coordinates={coordinates} />  : ''}
    </div>
  );
};
