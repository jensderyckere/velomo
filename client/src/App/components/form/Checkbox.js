import React, { useState } from 'react';

// Importing services
import { useStyling } from '../../services';

// Importing assets
import Check from '../../assets/icons/check.svg';

export const Checkbox = ({name, id, defaultValue, children}) => {
  const { screenSize } = useStyling();

  // Checking if checkbox has been checked (huge use of "check")
  const [ checked, setChecked ] = useState(defaultValue);
  console.log(checked);

  return (
    <div className={`checkbox ${screenSize}-check`}>
      <label htmlFor={name}>
        <span className="checkbox__box">
          {
            checked ? <img src={Check} alt="check" /> : ''
          }
        </span>
        <input onChange={(e) => setChecked(e.target.checked)} value={defaultValue} type="checkbox" id={id} name={name} />
      </label>
      <span className="checkbox__text">
        {children}
      </span>
    </div>
  );
};
