import React, { useEffect, useState } from 'react';
import Moment from 'moment';
import 'moment/locale/nl-be';

export const EventsCalendar = () => {
  // Variables
  const MONTHS = Moment.months();

  // States
  const [ month, setMonth ] = useState(Moment(Date.now()).month());
  const [ days, setDays ] = useState(Moment(Date.now()).daysInMonth());
  const [ day, setDay ] = useState(Moment(Date.now()).date());
  const [ year, setYear ] = useState(Moment(Date.now()).year());

  const [ mondays, setMondays ] = useState([]);
  const [ tuesdays, setTuesdays ] = useState([]);
  const [ wednesdays, setWednesdays ] = useState([]);
  const [ thursdays, setThursdays ] = useState([]);
  const [ fridays, setFridays ] = useState([]);
  const [ saturdays, setSaturdays ] = useState([]);
  const [ sunday, setSunday ] = useState([]);

  useEffect(() => {
    let mondaysArray = [];
    let tuesdaysArray = [];
    let wednesdaysArray = [];
    let thursdaysArray = [];
    let fridaysArray = [];
    let saturdaysArray = [];
    let sundaysArray = [];

    for (let i = 0; i < days; i++) {
      const dayIndex = i+1;
      const fullDate = `${dayIndex}/${month+1}/${year}`;
      const parsedDate = Moment(fullDate, 'DD-MM-YYYY').toDate();
      const dayType = Moment(parsedDate).weekday();
      
      switch (dayType) {
        case 0:
          mondaysArray.push(dayIndex);
          break;
        case 1:
          tuesdaysArray.push(dayIndex);
          break;
        case 2:
          wednesdaysArray.push(dayIndex);
          break;
        case 3:
          thursdaysArray.push(dayIndex);
          break;
        case 4:
          fridaysArray.push(dayIndex);
          break;
        case 5:
          saturdaysArray.push(dayIndex);
          break;
        case 6:
          sundaysArray.push(dayIndex);
          break;
        default:
          break;
      };

      setMondays(mondaysArray);
      setTuesdays(tuesdaysArray);
      setWednesdays(wednesdaysArray);
      setThursdays(thursdaysArray);
      setFridays(fridaysArray);
      setSaturdays(saturdaysArray);
      setSunday(sundaysArray);
    };
  }, [month, days, year]);

  const Day = ({ number }) => {
    return <div className={`text-center text-size light-font secundary-font events-calendar__dates-wrapper--bar--digit ${day === number ? 'current-day' : ''}`} onClick={() => setDay(number)}>{number}</div>
  };

  return (
    <div className="events-calendar">
      <span className="secundary-font text-size light-font">Vandaag</span>
      <h4 className="secundary-font title-size bold-font">{day} {MONTHS[month]} {year}</h4>
      <div className="events-calendar__month-change">

      </div>
      <div className="events-calendar__dates-wrapper d-flex">
        <div className="events-calendar__dates-wrapper--bar">
          <div className="bold-font secundary-font subtitle-size text-center events-calendar__dates-wrapper--bar--date">
            M
          </div>
          {
            mondays && mondays.map((monday, index) => {
              return <Day key={index} number={monday}/>
            })
          }
        </div>
        <div className="events-calendar__dates-wrapper--bar">
          <div className="bold-font secundary-font subtitle-size text-center events-calendar__dates-wrapper--bar--date">
            D
          </div>
          {
            tuesdays && tuesdays.map((tuesday, index) => {
              return <Day key={index} number={tuesday}/>
            })
          }
        </div>
        <div className="events-calendar__dates-wrapper--bar">
          <div className="bold-font secundary-font subtitle-size text-center events-calendar__dates-wrapper--bar--date">
            W
          </div>
          {
            wednesdays && wednesdays.map((wednesday, index) => {
              return <Day key={index} number={wednesday}/>
            })
          }
        </div>
        <div className="events-calendar__dates-wrapper--bar">
          <div className="bold-font secundary-font subtitle-size text-center events-calendar__dates-wrapper--bar--date">
            D
          </div>
          {
            thursdays && thursdays.map((thursday, index) => {
              return <Day key={index} number={thursday}/>
            })
          }
        </div>
        <div className="events-calendar__dates-wrapper--bar">
          <div className="bold-font secundary-font subtitle-size text-center events-calendar__dates-wrapper--bar--date">
            V
          </div>
          {
            fridays && fridays.map((friday, index) => {
              return <Day key={index} number={friday}/>
            })
          }
        </div>
        <div className="events-calendar__dates-wrapper--bar">
          <div className="bold-font secundary-font subtitle-size text-center events-calendar__dates-wrapper--bar--date">
            Z
          </div>
          {
            saturdays && saturdays.map((saturday, index) => {
              return <Day key={index} number={saturday}/>
            })
          }
        </div>
        <div className="events-calendar__dates-wrapper--bar">
          <div className="bold-font secundary-font subtitle-size text-center events-calendar__dates-wrapper--bar--date">
            Z
          </div>
          {
            sunday && sunday.map((sun, index) => {
              return <Day key={index} number={sun}/>
            })
          }
        </div>
      </div>
      <h4 className="secundary-font subtitle-size bold-font margin-top-50">Jouw komende evenementen</h4>
    </div>
  );
};