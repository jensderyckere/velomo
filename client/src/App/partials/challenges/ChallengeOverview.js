import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Components
import { StandardButton } from '../../components';

// Services
import { useApi, useAuth } from '../../services';

// Routes
import * as Routes from '../../routes';

export const ChallengeOverview = ({ user, cred }) => {
  // Routing
  const history = useHistory();

  // Services
  const { getClubChallenges } = useApi()
  const { currentUser } = useAuth();

  // States
  const [ challenges, setChallenges ] = useState();
  const [ paginateIndex, setPaginateIndex ] = useState(3);

  // Fetch challenge
  const fetchChallenges = useCallback(async () => {
    try {
      if (user.role === 'club') {
        const challengesResult = await getClubChallenges(currentUser, user._id);
        setChallenges(challengesResult.club_challengeIds);
      };
    } catch (e) {
      console.log(e);
    };
  }, [user, currentUser, getClubChallenges]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  return (
    <div className="challenge-overview">
      <div className="d-flex justify-content-between align-items-center margin-bottom-30">
        <h2 className="secundary-font title-size bold-font">Lopende uitdagingen</h2>
        <StandardButton text="Nieuwe uitdagingen" action={() => history.push(Routes.CREATE_CHALLENGE)} />
      </div>
      <div className="challenge-overview__items">
        {
          challenges && challenges.length !== 0 ? challenges.map((challenge, index) => {

          }) : (
            <span className="challenge-overview__items--none tertiary-font light-font text-size">Er zijn nog geen uitdagingen aangemaakt.</span>
          )
        }
      </div>
      {
        challenges && challenges.length > 3 && (
          <div className="challenge-overview__paginate">
            {
              paginateIndex > 3 && (
                <span onClick={() => setPaginateIndex(paginateIndex-3)}>Vorige</span>
              )
            }
            {
              paginateIndex < challenges.length && (
                <span onClick={() => setPaginateIndex(paginateIndex+3)}>Volgende</span>
              )
            }
          </div>
        )
      }
    </div>
  )
};
