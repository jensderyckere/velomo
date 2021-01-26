import React from 'react';

export const Textarea = ({label, id, name, value, placeholder, changeInput, required}) => {
  return (
    <span className={`textarea-field`}>
      <label htmlFor={name}>
        {label}
      </label>
      {
        required ? (
          <textarea onChange={changeInput} id={id} name={name} defaultValue={value ? value : ''} placeholder={placeholder ? placeholder : ''} required/>
        ) : (
          <textarea onChange={changeInput} id={id} name={name} defaultValue={value ? value : ''} placeholder={placeholder ? placeholder : ''} />
        )
      }
    </span>
  );
};
