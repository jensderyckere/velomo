import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

// Services
import { useApi, useAuth } from '../../services';

// Images
import DefaultUser from '../../assets/icons/user.svg';

// Routes
import * as Routes from '../../routes';

// Components
import { ImageUrl, SlugText } from '../../components';

export const ChallengeCharts = ({ challenge, user }) => {
  // Routing
  const history = useHistory();

  // Services
  const { viewMonthlyCharts } = useApi();
  const { currentUser } = useAuth();

  // States
  const [ participants, setParticipants ] = useState();
  const [ maximum, setMaximum ] = useState();

  const fetchCharts = useCallback(async () => {
    try {
      const fetchedCharts = await viewMonthlyCharts(currentUser, challenge._id);
      setParticipants(fetchedCharts);

      if (challenge.type === 'distance') {
        let max = 0;
        for (let i = 0; i < fetchedCharts.length; i++) {
          if (fetchedCharts[i].distance > max) {
            max = fetchedCharts[i].distance;
            setMaximum(max);
          };
        };
      };
    } catch (e) {
      console.log(e);
    };
  }, [challenge, viewMonthlyCharts, currentUser]);

  useEffect(() => {
    fetchCharts();
  }, [fetchCharts]);

  const ChartItem = ({participant}) => {
    // States
    const [ showDistance, setShowDistance ] = useState(false);

    return (
      <div className="dashboard-challenge__charts--item d-flex">
        <div className="dashboard-challenge__charts--item__content">
          <div className="d-flex justify-content-center">
            <div onMouseEnter={() => setShowDistance(true)} onMouseLeave={() => setShowDistance(false)} className="avatar avatar-standard pointer" onClick={() => history.push(Routes.PROFILE.replace(':name', SlugText(participant.user.firstName + ' ' + participant.user.lastName)).replace(':id', participant.user._id))} style={{
              backgroundImage: `url(${ImageUrl(participant.user.profile.avatar, DefaultUser)})`
            }}></div>
            {
              showDistance && <div className="standard-shadow radius-10 dashboard-challenge__charts--item__content--distance">{participant.distance.toFixed(2)}{challenge.type === 'distance' ? 'km' : 'u'}</div>
            }
          </div>
          <div className="d-flex justify-content-center" style={{
            height: `${challenge.type === 'distance' ? ((participant.distance / maximum) * 100) * 2 : ((participant.duration / maximum) * 100) * 2}px`
          }}>
            <div className="dashboard-challenge__charts--item__content--bar" style={{
              height: `${challenge.type === 'distance' ? ((participant.distance / maximum) * 100) * 2 : ((participant.duration / maximum) * 100) * 2}px`
            }}></div>
          </div>
        </div>
      </div>
    )
  };

  return participants ? (
    <div className="grey-card dashboard-challenge margin-bottom-50">
      <h1 className="secundary-font title-size bold-font margin-top-30 margin-bottom-50">Hoe verloopt deze uitdaging momenteel?</h1>
      <div className="dashboard-challenge__charts d-flex align-items-end">
        {
          participants.map((participant, index) => {
            return (
              <ChartItem participant={participant} key={index} />
            )
          })
        }
      </div>
    </div>
  ) : '';
};
