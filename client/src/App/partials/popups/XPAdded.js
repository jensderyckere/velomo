import React, { useEffect, useState } from 'react';

// Components
import { StandardButton } from '../../components';

export const XPAdded = ({ addedXp, text, currentXp, previousXp, action }) => {
  const [ xp, setXp ] = useState(0);

  setTimeout(() => {
    setXp(currentXp)
  }, (500));

  // Conclude experience min & max
  useEffect(() => {
  }, []);

  return (
    <div className="popup">
      <div className="popup__card">
        <h1 className="secundary-font orange-color text-center">+{addedXp}XP</h1>
        <p className="tertiary-font text-size light-font text-center">{text}</p>
        <div className="popup__card--lvl d-flex justify-content-between align-items-center">
          <span className="secundary-font bold-font title-size margin-right-10">{previousXp}</span>
          <div className="popup__card--lvl--bar">
            <div className="popup__card--lvl--bar__inside" style={{
              width: `${xp !== 0 ? (xp / currentXp) * 100 : 0}%`
            }}></div>
          </div>
          <span className="secundary-font bold-font title-size margin-left-10">{currentXp}</span>
        </div>
        <div className="popup__card--button d-flex justify-content-center">
          <StandardButton text="Ga verder" action={action} />
        </div>
      </div>
    </div>
  );
};
