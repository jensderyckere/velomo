import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import Moment from 'moment';

// Partials
import { MoreActivity } from '..';

// Components
import { DateText, DistanceSVG, MoreSVG, SpeedSVG, TeamSVG, TimeText } from '../../components';

// Routes
import * as Routes from '../../routes';

// Services
import { useApi, useAuth } from '../../services';

export const ActivityItem = ({ user, cred, activity }) => {
    // States
    const [ showMore, setShowMore ] = useState(false);

    // Routing
    const history = useHistory();

    // Services
    const { deleteActivity } = useApi();
    const { currentUser } = useAuth();
  
    // Deleting a activity
    const deleteRide = async () => {
      try {
        const result = await deleteActivity(currentUser, activity._id);
  
        if (result) {
          history.push(Routes.ACTIVITIES); 
        } else {
          history.push(Routes.ERROR);
        };
      } catch (e) {
        history.push(Routes.ERROR);
      };
    };

  return (
    <div className="activities-overview__item">
      <p className="tertiary-font smallest-size light-font margin-0">{DateText(activity.result.start_date_local) + ' om ' + TimeText(activity.result.start_date_local)}</p>
      <NavLink to={Routes.ACTIVITY.replace(':id', activity._id)}><h5 className="secundary-font subtitle-size bold-font">{activity.result.name}</h5></NavLink>
      <div className="d-flex align-items-center">
        <div className="activities__bio--details--item d-flex align-items-center">
          <SpeedSVG />
          <span className="text-size secundary-font margin-left-10">
            {(((activity.result.average_speed) * 3600) / 1000).toFixed(2)}<span className="smallest-size">km/u</span>
          </span>
        </div>
        <div className="activities__bio--details--item d-flex align-items-center">
          <DistanceSVG />
          <span className="text-size secundary-font margin-left-10">
            {(activity.result.distance / 1000).toFixed(2)}<span className="smallest-size">km</span>
          </span>
        </div>
        <div className="activities__bio--details--item d-flex align-items-center">
          <TeamSVG />
          <span className="text-size secundary-font margin-left-10">
            {Moment.utc(activity.result.elapsed_time * 1000).format('HH:mm:ss')}<span className="smallest-size">u</span>
          </span>
        </div>
      </div>
      <div className="activities-overview__item--more" onClick={() => setShowMore(!showMore)}>
        <MoreSVG />
      </div>
      {
        showMore && (
          <MoreActivity 
            ownership={cred}
            user={user}
            activity={activity}
            deleteRide={deleteRide}
          />
        )
      }
    </div>
  )
};
