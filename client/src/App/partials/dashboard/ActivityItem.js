import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

// Components
import { Map, DateText, TimeText, TeamSVG, DistanceSVG } from '../../components';

// Routes
import * as Routes from '../../routes';

export const ActivityItem = ({activity}) => {
  const [ coordinates, setCoordinates ] = useState();

  useEffect(() => {
    if (activity.activity.checkpoints) {
      const checkpoints = activity.activity.checkpoints;
      let array = [];
  
      for (let i = 0; i < checkpoints.length; i++) {
        const coordinate = [checkpoints[i].lon, checkpoints[i].lat];
        array.push(coordinate);
      };
  
      setCoordinates(array);
    };
  }, [activity.activity]);

  return (
    <div className="activities__overview--item">
      <div className="row">
        {
          coordinates && (
            <div className="col-12 col-md-6">
              <div className="activities__overview--item--map">
                <>
                  <Map coordinates={coordinates} />
                  <div className="activities__overview--item--map__details d-flex align-items-center">
                    <div className="activities__overview--item--map__details--item margin-right-20">
                      <TeamSVG />
                      <span className="activities__overview--item--map__details--item__text text-size secundary-font bold-font margin-left-10">
                        {activity.type}
                      </span>
                    </div>
                    <div className="activities__overview--item--map__details--item margin-right-20">
                      <DistanceSVG />
                      <span className="activities__overview--item--map__details--item__text text-size secundary-font bold-font margin-left-10">
                        {activity.activity.total_distance.toFixed(2)}<span className="smallest-size"> km</span>
                      </span>
                    </div>
                  </div>
                </>
              </div>
            </div>
          )
        }
        <div className="col-12 col-md-6">
          <div className="activities__overview--item--content">
            <span className="activities__overview--item--content--date tertiary-font smallest-size">
              {DateText(activity.activity.starting_time) + ' om ' + TimeText(activity.activity.starting_time)}
            </span>
            <h3 className="activities__overview--item--content--title secundary-font bold-font title-size">
              {activity.title}
            </h3>
            <p className="activities__overview--item--content--description tertiary-font text-size margin-top-20">
              {activity.description}
            </p>
            <NavLink className="activities__overview--item--content--more tertiary-font bold-font orange-color text-size margin-top-20" to={Routes.ACTIVITY.replace(':id', activity._id)}>
              Bekijk meer
            </NavLink>
          </div>
        </div>
        {
          !activity.activity.checkpoints && (
            <div className="col-12 col-md-6">
              <div className="activities__overview--item--details">
                <div className="activities__overview--item--details__wrapper">
                    <h5 className="secundary-font bold-font text-size">Jouw activiteit samengevat</h5>
                    <div className="activities__overview--item--details__wrapper--item">
                      <TeamSVG />
                      <span className="activities__overview--item--details__wrapper--item--text text-size secundary-font bold-font margin-left-10">
                        {activity.type}
                      </span>
                    </div>
                    <div className="activities__overview--item--details__wrapper--item">
                      <DistanceSVG />
                      <span className="activities__overview--item--map__details--item__text text-size secundary-font bold-font margin-left-10">
                        {activity.activity.total_distance}<span className="smallest-size"> km</span>
                      </span>
                    </div>
                  </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
};
