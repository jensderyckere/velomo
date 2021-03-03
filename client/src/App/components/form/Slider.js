import React from 'react';
import { default as ReactSlider } from 'react-rangeslider';

export const Slider = ({ label, labels, min, max, onChange, value }) => {
  return (
    <div className="slider">
      <span className="slider__label">{label}</span>
      <ReactSlider labels={labels} min={min} max={max} orientation="horizontal" onChange={onChange} />
    </div>
  );
};
