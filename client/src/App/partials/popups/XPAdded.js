import React, { useEffect, useState } from 'react';

// Components
import { StandardButton } from '../../components';

export const XPAdded = ({ addedXp, text, currentXp, previousXp, action }) => {
  const [ xpMargins, setXpMargins ] = useState({
    min: 0,
    max: 0,
  });
  const [ lvl, setLvl ] = useState(0);
  const [ xp, setXp ] = useState(previousXp ? previousXp : 0);

  setTimeout(() => {
    setXp(currentXp)
  }, (500));

  // Conclude experience min & max
  useEffect(() => {
    if (xp >= 0 && xp < 1000) {
      setXpMargins({
        min: 0,
        max: 1000,
      });
      setLvl(0);
    };

    if (xp >= 1000 && xp < 4000) {
      setXpMargins({
        min: 1000,
        max: 4000,
      });
      setLvl(1);
    };

    if (xp >= 4000 && xp < 10000) {
      setXpMargins({
        min: 4000,
        max: 10000,
      });
      setLvl(2);
    };

    if (xp >= 10000 && xp < 25000) {
      setXpMargins({
        min: 10000,
        max: 25000,
      });
      setLvl(3);
    };
    
    if (xp >= 25000 && xp < 45000) {
      setXpMargins({
        min: 25000,
        max: 45000,
      });
      setLvl(4);
    };

    if (xp >= 45000 && xp < 70000) {
      setXpMargins({
        min: 45000,
        max: 70000,
      });
      setLvl(5);
    };

    if (xp >= 70000 && xp < 100000) {
      setXpMargins({
        min: 70000,
        max: 100000,
      });
      setLvl(6);
    };

    if (xp >= 100000 && xp < 150000) {
      setXpMargins({
        min: 100000,
        max: 150000,
      });
      setLvl(7);
    };

    if (xp >= 150000 && xp < 250000) {
      setXpMargins({
        min: 150000,
        max: 250000,
      });
      setLvl(8);
    };
  }, [xp]);

  return (
    <div className="popup">
      <div className="popup__card">
        <h1 className="secundary-font orange-color text-center">+{addedXp}XP</h1>
        <p className="tertiary-font text-size light-font text-center">{text}</p>
        <div className="popup__card--lvl d-flex justify-content-between align-items-center">
          <span className="secundary-font bold-font title-size margin-right-10">{lvl}</span>
          <div className="popup__card--lvl--bar">
            <div className="popup__card--lvl--bar__inside" style={{
              width: `${xp !== 0 ? (xp / xpMargins.max) * 100 : 0}%`
            }}></div>
          </div>
          <span className="secundary-font bold-font title-size margin-left-10">{lvl+1}</span>
        </div>
        <div className="popup__card--button d-flex justify-content-center">
          <StandardButton text="Ga verder" action={action} />
        </div>
      </div>
    </div>
  );
};
