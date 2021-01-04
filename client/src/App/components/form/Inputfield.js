import React from 'react';

// Import screensize
import { useStyling } from '../../services';

export const Inputfield = ({label, id, name, type, size, value, placeholder, changeInput}) => {
  const { screenSize } = useStyling();

  return (
    <span className={`input-field ${screenSize}-input ${size}-length`}>
      <label htmlFor={name}>
        {label}
      </label>
      <input onChange={changeInput} type={type} id={id} name={name} defaultValue={value ? value : ''} placeholder={placeholder ? placeholder : ''}  required/>
    </span>
  );
};
