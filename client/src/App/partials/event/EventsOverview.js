import React, { useState } from 'react';

export const EventsOverview = ({ events }) => {
  // States
  const [ paginateIndex, setPaginateIndex ] = useState(4);

  const EventItem = ({ item }) => {
    return (
      ''
    );
  };

  return (
    <div className="events">
      <div className="events__items">
        {
          events.length !== 0 ? events.map((item, index) => {
            return <EventItem key={index} item={item} />
          }) : (
            <span className="events--none tertiary-font light-font text-size">Er zijn nog geen evenementen aangemaakt.</span>
          )
        }
      </div>
      <div className="events__paginate">
        {
          paginateIndex > 4 && (
            <span onClick={() => setPaginateIndex(paginateIndex-4)}>Vorige</span>
          )
        }
        {
          paginateIndex < events.length && (
            <span onClick={() => setPaginateIndex(paginateIndex+4)}>Volgende</span>
          )
        }
      </div>
    </div>
  );
};
