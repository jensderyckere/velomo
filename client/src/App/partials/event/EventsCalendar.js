import React, { useEffect } from 'react';
import Moment from 'moment';
import 'moment/locale/nl-be';

export const EventsCalendar = () => {
  const MONTHS = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];

  useEffect(() => {
    const days = Moment(Date.now()).daysInMonth();
    // const month = Moment(Date.now()).month();
    // const dayType = Moment(Date.now()).weekday();
    // const day = Moment(Date.now()).day();
  });

  return (
    <div className="events-calendar">
      <div className="events-calendar__dates-wrapper">
        <div className="events-calendar__dates-wrapper--bar">
          <div>
            M
          </div>
        </div>
        <div className="events-calendar__dates-wrapper--bar">
          <div>
            D
          </div>
        </div>
        <div className="events-calendar__dates-wrapper--bar">
          <div>
            W
          </div>
        </div>
        <div className="events-calendar__dates-wrapper--bar">
          <div>
            D
          </div>
        </div>
        <div className="events-calendar__dates-wrapper--bar">
          <div>
            V
          </div>
        </div>
        <div className="events-calendar__dates-wrapper--bar">
          <div>
            Z
          </div>
        </div>
        <div className="events-calendar__dates-wrapper--bar">
          <div>
            Z
          </div>
        </div>
      </div>
    </div>
  );
};