import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Services
import { useApi, useAuth } from '../../services';

// Utils
import { ScreenSizeClassSwitch } from '../../utils';

// Routes
import * as Routes from '../../routes';

// Images
import DefaultUser from '../../assets/icons/user.svg';
import { ImageUrl, SlugText } from '../../components';

export const RandomChallenge = ({ user }) => {
  // Routing
  const history = useHistory();

  // Services
  const { getRandomChallenge } = useApi();
  const { currentUser } = useAuth();

  // States
  const [ challenge, setChallenge ] = useState();
  const [ maximum, setMaximum ] = useState(0);

  // Fetch random challenge
  const fetchData = useCallback(async () => {
    try {
      const randomData = await getRandomChallenge(currentUser);
      console.log(randomData)
      setChallenge(randomData);

      if (randomData.challenge.type === 'distance') {
        let max = 0;
        for (let i = 0; i < randomData.participants.length; i++) {
          if (randomData.participants[i].distance > max) {
            max = randomData.participants[i].distance;
            setMaximum(max);
          };
        };
      };
    } catch (error) {
      
    };
  }, [getRandomChallenge, currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const ChartItem = ({ owner }) => {
    return (
      <div className="dashboard-challenge__charts--item d-flex">
        {
          challenge.participants.map((challenger, index) => {
            return challenger.user._id === owner._id && (
              <div className="dashboard-challenge__charts--item__content" key={index}>
                <div className="d-flex justify-content-center">
                  <div className="avatar avatar-standard pointer" onClick={() => history.push(Routes.MY_PROFILE)} style={{
                    backgroundImage: `url(${ImageUrl(challenger.user.profile.avatar, DefaultUser)})`
                  }}></div>
                </div>
                <div className="d-flex justify-content-center" style={{
                  height: `${((challenger.distance / maximum) * 100) * 2}px`
                }}>
                  <div className="dashboard-challenge__charts--item__content--bar" style={{
                    height: `${((challenger.distance / maximum) * 100) * 2}px`
                  }}></div>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  };

  const OtherChartItem = ({ participant, owner }) => {
    return participant.user._id !== owner._id ? (
      <div className="dashboard-challenge__charts--item d-flex">
        <div className="dashboard-challenge__charts--item__content">
          <div className="d-flex justify-content-center">
            <div className="avatar avatar-standard pointer" onClick={() => history.push(Routes.MY_PROFILE)} style={{
              backgroundImage: `url(${ImageUrl(participant.user.profile.avatar, DefaultUser)})`
            }}></div>
          </div>
          <div className="d-flex justify-content-center" style={{
            height: `${((participant.distance / maximum) * 100) * 2}px`
          }}>
            <div className="dashboard-challenge__charts--item__content--bar" style={{
              height: `${((participant.distance / maximum) * 100) * 2}px`
            }}></div>
          </div>
        </div>
      </div>
    ) : '';
  };

  const DesktopRandomView = () => {
    return (
      <div className="d-flex justify-content-between">
        {
          challenge.challenge.type === 'distance' && (
            <div className="dashboard-challenge__charts d-flex align-items-end">
              <ChartItem owner={user} />
              {
                challenge.participants.map((participant, index) => {
                  return <OtherChartItem participant={participant} owner={user} key={index} />
                })
              }
            </div>
          )
        }
        <div className="dashboard-challenge__card box-shadow radius-10">
          <div className="d-flex align-items-center">
            <div className="avatar avatar-standard pointer" onClick={() => history.push(Routes.PROFILE.replace(':name', SlugText(challenge.challenge._userId.club.name)).replace(':id', challenge.challenge._userId.id))} style={{
              backgroundImage: `url(${ImageUrl(challenge.challenge._userId.profile.avatar, DefaultUser)})`
            }}></div>
            <h5 className="secundary-font bold-font text-size margin-0 margin-left-20 pointer hover-text" onClick={() => history.push(Routes.CHALLENGE.replace(':id', challenge.challenge._id))}>
              "{challenge.challenge.title}"
            </h5>
          </div>
          <div className="margin-top-20">
            <p className="tertiary-font text-size light-font margin-0">
              {challenge.challenge.shortContent}
            </p>
          </div>
        </div>
      </div>
    )
  };

  return challenge ? (
    <div className="grey-card dashboard-challenge margin-top-20">
      <h1 className="secundary-font title-size bold-font margin-top-30 margin-bottom-50">Op de hoogte van de recentste ontwikkelingen!</h1>
      <DesktopRandomView />
    </div>
  ) : '';
};
