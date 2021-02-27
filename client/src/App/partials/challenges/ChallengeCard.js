import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { default as Moment } from "moment";
import 'moment/locale/nl-be';

// Components
import { Badge, DateText, ImageUrl, StandardButton } from '../../components';

// Routes
import * as Routes from '../../routes';

// Services
import { useApi, useAuth } from '../../services';

export const ChallengeCard = ({ challenge, user }) => {
  // Routing
  const history = useHistory();

  // States
  const [ showSubmission, setShowSubmission ] = useState(false);
  const [ participation, setParticipation ] = useState();

  // Services
  const { getParticipation, participateChallenge, withdrawChallenge } = useApi();
  const { currentUser } = useAuth();

  // Fetch participant
  const fetchData = useCallback(async () => {
    try {
      const participationData = await getParticipation(currentUser, challenge._id);
      setParticipation(participationData);
    } catch (error) {
      console.log(error);
    };
  }, [getParticipation, currentUser, challenge._id]);

  useEffect(() => {
    if (user.role === 'cyclist') {
      fetchData();
    };
  }, [fetchData]);

  const startParticipation = async () => {
    let result;

    if (challenge.type === 'distance' || challenge.type === 'duration') {
      result = await participateChallenge(currentUser, {
        challengeId: challenge._id,
      });
    } else {
      setShowSubmission(true);
    };

    if (result) {
      window.location.reload();
    };
  };

  const removeParticipation = async () => {
    const result = await withdrawChallenge(currentUser, {
      challengeId: challenge._id,
    });

    if (result) {
      window.location.reload();
    };
  };

  return (
    <div className="challenge-card radius-10 box-shadow no-overflow">
      <h4 className="secundary-font bold-font subtitle-size text-center">
        Te verdienen badge
      </h4>
      <div className="d-flex justify-content-center margin-top-30">
        {
          user.role !== 'cyclist' && (
            <Badge 
              badge={{
                id: challenge._id,
                size: 'big',
                image: ImageUrl(challenge.badge, ''),
              }}
            />
          )
        }
      </div>
      <div className="d-flex justify-content-center">
        <span className="darkgrey-color tertiary-font text-size margin-top-20">
          {DateText(challenge.start_date) + ' - ' + DateText(challenge.end_date)}
        </span>
      </div>
      <div className="d-flex justify-content-center margin-top-50">
        {
          user.role === 'club' && (
            <StandardButton 
              text="Bewerk uitdaging"
              action={() => history.push(Routes.EDIT_CHALLENGE.replace(':id', challenge._id))}
            />
          )
        }
        {
          Moment(Moment(Date.now()).format('LL')).isBetween(Moment(challenge.start_date).format('LL'), Moment(challenge.end_date).format('LL')) && (
            user.role === 'cyclist' && (
              user._id === participation._userId ? (
                <StandardButton 
                  text="Deelnemen"
                  action={() => startParticipation()}
                />
              ) : (
                <StandardButton 
                  text="Opgeven"
                  action={() => removeParticipation()}
                />
              )
            )
          )
        }
      </div>
    </div>
  );
};
