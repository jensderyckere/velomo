import React, { useEffect, useState } from 'react';
import { Circle } from 'rc-progress';

export const CircleChart = ({ percentage, text }) => {
  // States
  const [ percent, setPercent ] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setPercent(percentage);
    }, 500);
  }, [percentage]);

  return (
    <div className="circle-chart">
      <div className="circle-chart__wrapper">
        <Circle percent={percent} strokeWidth="8" strokeColor="#F3A734"></Circle>
        <span className="secundary-font subtitle-size light-font">{`${percentage}%`}</span>
      </div>
      {
        text && ''
      }
    </div>
  )
}; 