import React, { useState } from 'react';

export const Duration = ({ defaultHours, defaultMinutes, defaultSeconds, changeFully, form }) => {
  // States
  const [ hours, setHours ] = useState(defaultHours ? defaultHours : '00');
  const [ minutes, setMinutes ] = useState(defaultMinutes ? defaultMinutes : '00');
  const [ seconds, setSeconds ] = useState(defaultSeconds ? defaultSeconds : '00');

  // Change time
  const changeOnChange = (e) => {
    if (e.target.name === 'hours') {
      if (e.target.value > 24) {
        document.getElementById('hours').value = 24;
        setHours(24);
        changeFully({...form, duration: e.target.value + ':' + minutes + ':' + seconds});
      } else {
        setHours(e.target.value);
        changeFully({...form, duration: e.target.value + ':' + minutes + ':' + seconds});
      };
    };

    if (e.target.name === 'minutes') {
      if (e.target.value > 60) {
        document.getElementById('minutes').value = 60;
        setMinutes(60);
        changeFully({...form, duration: hours + ':' + e.target.value + ':' + seconds});
      } else {
        setMinutes(e.target.value);
        changeFully({...form, duration: hours + ':' + e.target.value + ':' + seconds});
      };    
    };

    if (e.target.name === 'seconds') {
      if (e.target.value > 60) {
        document.getElementById('seconds').value = 60;
        setSeconds(60);
        changeFully({...form, duration: hours + ':' + minutes + ':' + e.target.value});
      } else {
        setSeconds(e.target.value);
        changeFully({...form, duration: hours + ':' + minutes + ':' + e.target.value});
      };
    };
  };

  return (
    <div className="duration">
      <label htmlFor="duration">
        Duur
      </label>
      <div className="duration__field">
        <input type="number" onChange={(e) => changeOnChange(e)} min={0} max={24} id="hours" defaultValue={hours} name="hours" />
        <span>:</span>
        <input type="number" onChange={(e) => changeOnChange(e)} min={0} max={60} id="minutes" defaultValue={minutes} name="minutes" />
        <span>:</span>
        <input type="number" onChange={(e) => changeOnChange(e)} min={0} max={60} id="seconds" defaultValue={seconds} name="seconds" />
      </div>
    </div>
  );
};
