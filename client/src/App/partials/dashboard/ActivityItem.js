import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import Polyline from '@mapbox/polyline';
import Moment from 'moment';

// Components
import { Map, DateText, TimeText, TeamSVG, DistanceSVG, ImageUrl, SlugText, SpeedSVG } from '../../components';

// Routes
import * as Routes from '../../routes';

export const ActivityItem = ({activity, user}) => {
  // Routing
  const history = useHistory();
  
  const [ coordinates, setCoordinates ] = useState();

  useEffect(() => {
    const polyline = activity.result.map.summary_polyline;
    const longLatArray = Polyline.decode(polyline);

    let correctArray = [];

    for (let i = 0; i < longLatArray.length; i++) {
      correctArray.push([longLatArray[i][1], longLatArray[i][0]]);
    };

    setCoordinates(correctArray);
  }, [activity]);

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
                        {Moment.utc(activity.result.elapsed_time * 1000).format('HH:mm:ss')}
                      </span>
                    </div>
                    <div className="activities__overview--item--map__details--item margin-right-20">
                      <DistanceSVG />
                      <span className="activities__overview--item--map__details--item__text text-size secundary-font bold-font margin-left-10">
                        {(activity.result.distance / 1000).toFixed(2)}<span className="smallest-size">km</span>
                      </span>
                    </div>
                    <div className="activities__overview--item--map__details--item margin-right-20">
                      <SpeedSVG />
                      <span className="activities__overview--item--map__details--item__text text-size secundary-font bold-font margin-left-10">
                        {(((activity.result.average_speed) * 3600) / 1000).toFixed(2)}<span className="smallest-size">km/u</span>
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
              {DateText(activity.result.start_date_local) + ' om ' + TimeText(activity.result.start_date_local)}
            </span>
            <h3 className="activities__overview--item--content--title secundary-font bold-font title-size">
              {activity.result.name}
            </h3>
            <p className="activities__overview--item--content--description tertiary-font text-size margin-top-20">
              {activity.result.description ? activity.result.description : 'Er is geen beschrijving voor deze rit'}
            </p>
            <div className="activities__overview--item--content--creator d-flex align-items-center margin-top-30 margin-bottom-20">
              <span className="avatar avatar-standard pointer" onClick={() => history.push(Routes.PROFILE.replace(':id', user._id).replace(':name', SlugText(user.firstName + ' ' + user.lastName)))} style={{
                backgroundImage: `url(${ImageUrl(user.profile.avatar)})`
              }}></span>
              <span className="text-size tertiary-font margin-left-20">
                Gemaakt door <br/>
                <strong>{user.firstName + ' ' + user.lastName}</strong>
              </span>
            </div>
            <NavLink className="activities__overview--item--content--more tertiary-font bold-font orange-color text-size margin-top-20" to={Routes.ACTIVITY.replace(':id', activity._id)}>
              Bekijk meer
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
};
