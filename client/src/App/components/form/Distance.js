import React, { useState } from 'react';

export const Distance = ({ id, name, defaultValue, form, setForm }) => {
  // States
  const [ distanceValue, setDistanceValue ] = useState(defaultValue ? defaultValue : 0);

  // Plus
  const higherValue = () => {
    if (distanceValue !== 500) setDistanceValue(parseInt(distanceValue+1));
    document.getElementById(id).value = distanceValue;
    setForm({...form, distance: distanceValue});
  };

  // Minus
  const lowerValue = () => {
    if (distanceValue !== 0) setDistanceValue(parseInt(distanceValue-1));
    document.getElementById(id).value = distanceValue;
    setForm({...form, distance: distanceValue});
  };

  // Change form
  const changeOnChange = (e) => {
    setDistanceValue(e.target.value);
    setForm({...form, distance: e.target.value});
  };

  return (
    <div className="distance">
      <label htmlFor={name}>Afstand</label>
      <div className="distance__field">
        <div className="distance__field--button" onClick={() => lowerValue()}>
          <span>-</span>
        </div>
        <input onChange={(e) => changeOnChange(e)} type="number" min={0} max={500} id={id} name={name} defaultValue={distanceValue ? distanceValue : 0}  />
        <div className="distance__field--button" onClick={() => higherValue()}>
          <span>+</span>
        </div>
      </div>
    </div>
  );
};
