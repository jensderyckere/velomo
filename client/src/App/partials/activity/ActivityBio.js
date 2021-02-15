import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

// Components
import { DateText, DistanceSVG, ImageUrl, MoreSVG, SlugText, SpeedSVG, TeamSVG, TimeText } from '../../components';

// Images
import DefaultUser from '../../assets/icons/user.svg';

// Partials
import { MoreActivity } from '.';

// Routes
import * as Routes from '../../routes';

// Services
import { useApi, useAuth } from '../../services';
import { ActivityImages } from './ActivityImages';

export const ActivityBio = ({user, activity}) => {
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
    <div className="activities__bio p-relative">
      <div className="activities__bio--more" onClick={() => setShowMore(!showMore)}>
        <MoreSVG />
      </div>
      {
        showMore && (
          <MoreActivity 
            ownership={user._id === activity.user._id ? true : false} 
            user={user._id === activity.user._id ? user : activity.user}
            activity={activity}
            deleteRide={deleteRide}
          />
        )
      }
      <span className="tertiary-font text-size darkgrey-color">
        {DateText(activity.activity.starting_time) + ' om ' + TimeText(activity.activity.starting_time)}
      </span>
      <h3 className="secundary-font title-size bold-font margin-top-10">
        {activity.title}
      </h3>
      <div className="activities__bio--details d-flex align-items-center">
        <div className="activities__bio--details--item d-flex align-items-center">
          <SpeedSVG />
          <span className="text-size secundary-font margin-left-10">
            {activity.activity.checkpoints ? activity.activity.avg_speed.toFixed(2) : activity.activity.avg_speed}<span className="smallest-size">km/u</span>
          </span>
        </div>
        <div className="activities__bio--details--item d-flex align-items-center">
          <DistanceSVG />
          <span className="text-size secundary-font margin-left-10">
            {activity.activity.checkpoints ? activity.activity.total_distance.toFixed(2) : activity.activity.total_distance}<span className="smallest-size">km</span>
          </span>
        </div>
        <div className="activities__bio--details--item d-flex align-items-center">
          <TeamSVG />
          <span className="text-size secundary-font margin-left-10">
            {activity.type}
          </span>
        </div>
      </div>
      <p className="tertiary-font text-size light-font margin-top-30">
        {activity.description}
      </p>
      <div onClick={() => history.push(Routes.PROFILE.replace(':name', SlugText(`${activity.user.firstName + ' ' + activity.user.lastName}`)).replace(':id', activity.user._id))} className="activities__bio--details--user margin-top-30">
        <span className="avatar avatar-standard" style={{
          backgroundImage: `url(${ImageUrl(activity.user.profile.avatar ? activity.user.profile.avatar : false, DefaultUser)})`
        }}></span>
        <p className="secundary-font bold-font text-size margin-left-10">
          {activity.user.firstName + ' ' + activity.user.lastName}
        </p>
      </div>
      {
        activity.images && (
          <div className="m-top-30">
            <ActivityImages images={activity.images} />
          </div>
        )
      }
    </div>
  );
};
