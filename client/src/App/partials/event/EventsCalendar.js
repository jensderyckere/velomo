import React, { useEffect, useState } from 'react';
import Moment from 'moment';
import 'moment/locale/nl-be';
import { NextSVG, PreviousSVG } from '../../components';

export const EventsCalendar = () => {
  // Variables
  const MONTHS = Moment.months();

  // States
  const [ month, setMonth ] = useState(Moment(Date.now()).month());
  const [ days, setDays ] = useState(Moment(Date.now()).daysInMonth());
  const [ day, setDay ] = useState(Moment(Date.now()).date());
  // eslint-disable-next-line
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

  const Day = ({ number, extraClass }) => {
    return <div className={`text-center text-size light-font secundary-font events-calendar__dates-wrapper--bar--digit ${day === number ? 'current-day' : ''} ${extraClass && extraClass}`} onClick={() => setDay(number)}>{number}</div>
  };

  const changeMonth = (prev) => {
    const newMonth = prev ? month - 1 : month + 1;
    const newDays = Moment(Moment(`${day}/${newMonth+1}/${year}`, 'DD-MM-YYYY').toDate()).daysInMonth();

    setMonth(newMonth);
    setDays(newDays);

    let mondaysArray = [];
    let tuesdaysArray = [];
    let wednesdaysArray = [];
    let thursdaysArray = [];
    let fridaysArray = [];
    let saturdaysArray = [];
    let sundaysArray = [];

    for (let i = 0; i < newDays; i++) {
      const dayIndex = i+1;
      const fullDate = `${dayIndex}/${newMonth+1}/${year}`;
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
  };

  return (
    <div className="events-calendar">
      <span className="secundary-font text-size light-font">Vandaag</span>
      <h4 className="secundary-font title-size bold-font">{day} {MONTHS[month]} {year}</h4>
      <div className="events-calendar__month-change d-flex align-items-center margin-top-20">
        {
          month !== 0 && (
            <span onClick={() => changeMonth(true)}>
              <PreviousSVG />
            </span>
          )
        }
        <p className="bold-font secundary-font text-size">
          {MONTHS[month]}
        </p>
        {
          month !== 11 && (
            <span onClick={() => changeMonth(false)}>
              <NextSVG />
            </span>
          )
        }
      </div>
      <div className="events-calendar__dates-wrapper d-flex">
        <div className="events-calendar__dates-wrapper--bar">
          <div className="bold-font secundary-font subtitle-size text-center events-calendar__dates-wrapper--bar--date">
            M
          </div>
          {
            mondays && mondays.map((monday, index) => {
              return <Day key={index} number={monday} extraClass={index === 0 ? mondays[0] > sunday[0] ? 'lower-date' : '' : ''}/>
            })
          }
        </div>
        <div className="events-calendar__dates-wrapper--bar">
          <div className="bold-font secundary-font subtitle-size text-center events-calendar__dates-wrapper--bar--date">
            D
          </div>
          {
            tuesdays && tuesdays.map((tuesday, index) => {
              return <Day key={index} number={tuesday} extraClass={index === 0 ? tuesdays[0] > sunday[0] ? 'lower-date' : '' : ''}/>
            })
          }
        </div>
        <div className="events-calendar__dates-wrapper--bar">
          <div className="bold-font secundary-font subtitle-size text-center events-calendar__dates-wrapper--bar--date">
            W
          </div>
          {
            wednesdays && wednesdays.map((wednesday, index) => {
              return <Day key={index} number={wednesday} extraClass={index === 0 ? wednesdays[0] > sunday[0] ? 'lower-date' : '' : ''}/>
            })
          }
        </div>
        <div className="events-calendar__dates-wrapper--bar">
          <div className="bold-font secundary-font subtitle-size text-center events-calendar__dates-wrapper--bar--date">
            D
          </div>
          {
            thursdays && thursdays.map((thursday, index) => {
              return <Day key={index} number={thursday} extraClass={index === 0 ? thursdays[0] > sunday[0] ? 'lower-date' : '' : ''}/>
            })
          }
        </div>
        <div className="events-calendar__dates-wrapper--bar">
          <div className="bold-font secundary-font subtitle-size text-center events-calendar__dates-wrapper--bar--date">
            V
          </div>
          {
            fridays && fridays.map((friday, index) => {
              return <Day key={index} number={friday} extraClass={index === 0 ? fridays[0] > sunday[0] ? 'lower-date' : '' : ''}/>
            })
          }
        </div>
        <div className="events-calendar__dates-wrapper--bar">
          <div className="bold-font secundary-font subtitle-size text-center events-calendar__dates-wrapper--bar--date">
            Z
          </div>
          {
            saturdays && saturdays.map((saturday, index) => {
              return <Day key={index} number={saturday} extraClass={index === 0 ? saturdays[0] > sunday[0] ? 'lower-date' : '' : ''}/>
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