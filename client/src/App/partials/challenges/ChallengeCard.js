import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { default as Moment } from "moment";
import 'moment/locale/nl-be';

// Components
import { Badge, DateText, ImageUrl, StandardButton } from '../../components';

// Partials
import { Submission } from '../../partials';

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

      if (participationData.message) {
        return;
      };

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
        <Badge 
          badge={{
            id: challenge._id,
            size: 'big',
            image: ImageUrl(challenge.badge, ''),
          }}
        />
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
          challenge.type === 'distance' || challenge.type === 'duration' ? (
            Moment(Date.now()).isBetween(challenge.start_date, challenge.end_date) && (
              user.role === 'cyclist' && (
                !participation ? (
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
          ) : (
            Moment(Date.now()).isBetween(challenge.start_date, challenge.end_date) && (
              user.role === 'cyclist' && (
                <StandardButton 
                  text="Inzending versturen"
                  action={() => setShowSubmission(true)}
                />
              )
            )
          )
        }
        {
          showSubmission && (
            <Submission 
              challenge={challenge} 
              user={user} 
              hide={() => setShowSubmission(false)}
            />
          )
        }
      </div>
    </div>
  );
};
