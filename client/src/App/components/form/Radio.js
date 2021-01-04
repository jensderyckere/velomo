import React, { useEffect, useState } from 'react';

// Importing services
import { useStyling } from '../../services';

// Importing assets
import Check from '../../assets/icons/check.svg';

export const Radio = ({name, id, checked, index, setIndex, children}) => {
  const { screenSize } = useStyling();

  return (
    <div className={`radio ${screenSize}-check`}>
      <label htmlFor={name}>
        <span className="radio__box">
          {
            checked ? <img src={Check} alt="check" /> : ''
          }
        </span>
        <input required checked={checked} onChange={() => setIndex(index)} type="radio" id={id} name={name} />
      </label>
      <span className="radio__text">
        {children}
      </span>
    </div>
  );
};
