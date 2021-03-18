import React, { useEffect, useState } from 'react';
import Polyline from '@mapbox/polyline';

// Components
import { Map } from '../../components';

// Utils
import { ScreenSizeClassSwitch } from '../../utils';

export const ActivityMap = ({ activity }) => {
  const [ coordinates, setCoordinates ] = useState();

  useEffect(() => {
    const polyline = activity.result.map.summary_polyline;
    const longLatArray = Polyline.decode(polyline);

    let correctArray = [];

    for (let i = 0; i < longLatArray.length; i++) {
      correctArray.push([longLatArray[i][1], longLatArray[i][0]]);
    };

    setCoordinates(correctArray);
  }, [activity]);

  return (
    <div className={`activities__map ${ScreenSizeClassSwitch('', 'mobile-map')}`}>
      { coordinates ? <Map coordinates={coordinates} />  : ''}
    </div>
  );
};
