import React, { useEffect, useState } from 'react';

export const UserLevelBar = ({ lvl, title, xp }) => {
  const [ xpMargins, setXpMargins ] = useState({
    min: 0,
    max: 0,
  });

  // Conclude experience min & max
  useEffect(() => {
    if (xp >= 0 && xp < 1000) {
      setXpMargins({
        min: 0,
        max: 1000,
      });
    };

    if (xp >= 1000 && xp < 4000) {
      setXpMargins({
        min: 1000,
        max: 4000,
      });
    };

    if (xp >= 4000 && xp < 10000) {
      setXpMargins({
        min: 4000,
        max: 10000,
      });
    };

    if (xp >= 10000 && xp < 25000) {
      setXpMargins({
        min: 10000,
        max: 25000,
      });
    };
    
    if (xp >= 25000 && xp < 45000) {
      setXpMargins({
        min: 25000,
        max: 45000,
      });
    };

    if (xp >= 45000 && xp < 70000) {
      setXpMargins({
        min: 45000,
        max: 70000,
      });
    };

    if (xp >= 70000 && xp < 100000) {
      setXpMargins({
        min: 70000,
        max: 100000,
      });
    };

    if (xp >= 100000 && xp < 150000) {
      setXpMargins({
        min: 100000,
        max: 150000,
      });
    };

    if (xp >= 150000 && xp < 250000) {
      setXpMargins({
        min: 150000,
        max: 250000,
      });
    };
  }, [xp]);

  return (
    <div className="user-level-bar margin-top-30">
      <div className="user-level-bar__text margin-bottom-20">
        <h2 className="secundary-font bold-font title-size">Level {lvl}</h2>
        <h5 className="secundary-font bold-font title-size darkgrey-color">{title}</h5>
      </div>
      <div className="user-level-bar__content">
        <div className="user-level-bar__content--box">
          <div className="user-level-bar__content--box--inside" style={{
            width: `${(xp / xpMargins.max) * 100}%`
          }}>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center margin-top-10">
          <span className="secundary-font smallest-size light-font">{xpMargins.min}XP</span>
          <span className="secundary-font smallest-size light-font">{xpMargins.max}XP</span>
        </div>
      </div>
    </div>
  );
};
