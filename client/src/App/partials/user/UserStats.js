import React, { useEffect, useState } from 'react';

// Components
import { TotalAchievementsSVG, TotalDistanceSVG, TotalSpeedSVG } from '../../components';

export const UserStats = ({ user }) => {
  // States
  const [ distance, setDistance ] = useState();
  const [ avgSpeed, setAvgSpeed ] = useState();
  const [ achievements, setAchievements ] = useState();

  useEffect(() => {
    if (user.cyclist._activityIds) {
      let totalDistance = 0;
      let totalSpeed = 0;

      for (let i = 0; i < user.cyclist._activityIds.length; i++) {
        totalDistance +=Number(user.cyclist._activityIds[i].activity.total_distance);
        totalSpeed += Number(user.cyclist._activityIds[i].activity.avg_speed);
      };

      totalSpeed = totalSpeed / user.cyclist._activityIds.length;

      setAvgSpeed(totalSpeed);
      setDistance(totalDistance);
      setAchievements(0);
    } else {
      setAvgSpeed(0);
      setDistance(0);
      setAchievements(0);
    }
  }, [user]);

  return (
    <div className="user-stats d-flex justify-content-center align-items-center">
      <div className="user-stats__item">
        <div className="d-flex justify-content-center">
          <TotalDistanceSVG />
        </div>
        <h5 className="smallest-size secundary-font bold-font">{Number(distance).toFixed(2)}km</h5>
      </div>
      <div className="user-stats__line"></div>
      <div className="user-stats__item">
        <div className="d-flex justify-content-center">
          <TotalSpeedSVG />
        </div>
        {
        }
        <h5 className="smallest-size secundary-font bold-font">{Number(avgSpeed).toFixed(2) === NaN ? Number(avgSpeed).toFixed(2) : 0}km/u</h5>
      </div>
      <div className="user-stats__line"></div>
      <div className="user-stats__item">
        <div className="d-flex justify-content-center">
          <TotalAchievementsSVG />
        </div>
        <h5 className="smallest-size secundary-font bold-font">{Number(achievements)}</h5>
      </div>
    </div>
  );
};
