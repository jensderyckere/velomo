import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

import "react-datepicker/dist/react-datepicker.css";

export const Datepicker = ({ label, whenChanging, startDate }) => {
  // Customised datepicker
  const CustomDate = ({ value, onClick }) => {
    return (
      <div className="datepicker">
        <span className="datepicker__label">
          {label}
        </span>
        <button className="datepicker__input" onClick={onClick}>
          {value}
        </button>
      </div>
    );
  };

  return (
    <DatePicker selected={startDate} customInput={<CustomDate />} onChange={date => whenChanging(date)} />
  );
};
