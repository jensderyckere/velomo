import React, { useEffect, useRef } from 'react';
import mapbox from 'mapbox-gl';

// Config
import * as Config from '../../config';

mapbox.accessToken = Config.clientConfig.mapboxKey;

export const Map = ({coordinates}) => {
  const ref = useRef(null);

  useEffect(() => {
    const map = new mapbox.Map({
      container: ref.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 9,
      center: [coordinates[0][0], coordinates[0][1]]
    });

    map.on('load', function() {
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          }
        }        
      });
      map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
        'line-join': 'round',
        'line-cap': 'round'
        },
        'paint': {
        'line-color': '#F3A734',
        'line-width': 5
        }
      });
    });

    return () => map.remove();
  }, [coordinates]);

  return <div className="map-container" ref={ref}></div>
};
