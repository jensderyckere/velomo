import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Components
import { Badge, ImageUrl, LoaderSVG } from '../components';

// Routes
import * as Routes from '../routes';

// Services
import { useApi, useAuth } from '../services';
import { ScreenSizeClassSwitch } from '../utils';

export const Challenges = () => {
  // Routing
  const history = useHistory();

  // States
  const [ user, setUser ] = useState();
  const [ clubChallenges, setClubChallenges ] = useState();
  const [ myChallenges, setMyChallenges ] = useState();

  // Services
  const { getClubChallenges, getMyChallenges } = useApi();
  const { currentUser, getCurrentUser } = useAuth();

  // Fetch data 
  const fetchNeeded = useCallback(async () => {
    try {
      const retrievedUser = await getCurrentUser(currentUser);

      if (retrievedUser.role === 'cyclist') {
        const retrievedClubChallenges = await getClubChallenges(currentUser, retrievedUser.cyclist._clubId._userId.id);
        const retrievedOwnChallenges = await getMyChallenges(currentUser);
        setMyChallenges(retrievedOwnChallenges);
        setClubChallenges(retrievedClubChallenges.club._challengeIds);
        setUser(retrievedUser);
      } else if (retrievedUser.role === 'club') {
        const retrievedClubChallenges = await getClubChallenges(currentUser, retrievedUser._id);       
        setClubChallenges(retrievedClubChallenges.club._challengeIds);
        setUser(retrievedUser);
      } else {
        throw new Error();
      };
    } catch (error) {
      history.push(Routes.ERROR);
    };
  }, [getClubChallenges, getMyChallenges, currentUser, getCurrentUser, history]);

  useEffect(() => {
    fetchNeeded();
  }, [fetchNeeded]);

  const ParticipatedChallenges = () => {
    return (
      <div className="challenges margin-bottom-50">
        <h2 className="secundary-font title-size bold-font">Jouw actieve uitdagingen</h2>
        <div className="margin-top-50 margin-bottom-30">
          {
            myChallenges && myChallenges.length !== 0 ? myChallenges.map((challenge, index) => {
              return <ChallengeSection key={index} challenge={challenge._challengeId} />
            }) : (
              <span className="tertiary-font light-font text-size">Er zijn nog geen actieve uitdagingen gaande.</span>
            )
          }
        </div>
      </div>
    )
  };

  const AvailableChallenges = () => {
    return (
      <div className="challenges">
        <h2 className="secundary-font title-size bold-font">Interessante uitdagingen van jouw club</h2>
        <div className="margin-top-50 margin-bottom-30">
          {
            clubChallenges && clubChallenges.length !== 0 ? clubChallenges.map((challenge, index) => {
              return <ChallengeSection key={index} challenge={challenge} />
            }) : (
              <span className="tertiary-font light-font text-size">Er zijn nog geen actieve uitdagingen gaande.</span>
            )
          }
        </div>
      </div>
    )
  };

  const ChallengeSection = ({ challenge }) => {
    return (
      <div className="challenges__item">
        <div className={`${ScreenSizeClassSwitch('d-flex', '')} align-items-center margin-bottom-30`}>
          <div className="d-flex justify-content-center">
          <Badge 
            badge={{
              id: challenge._id,
              size: 'big',
              image: ImageUrl(challenge.badge),
            }}
          />
          </div>
          <div className={`${ScreenSizeClassSwitch('margin-left-30', 'margin-top-30')}`}>
            <h5 className={`secundary-font ${ScreenSizeClassSwitch('text-left', 'text-center')}  subtitle-size bold-font hover-text pointer`} onClick={() => history.push(Routes.CHALLENGE.replace(':id', challenge._id))}>
              {challenge.title}
            </h5>
            <p className={`darkgrey-color ${ScreenSizeClassSwitch('text-left', 'text-center')} text-size tertiary-font ligth-font`}>
              {challenge.shortContent}
            </p>
          </div>
        </div>
        <hr className="standard-hr margin-bottom-20" />
      </div>
    );
  };

  return user ? (
    <div className="container">
      <section className="w-100">
        {
          user.role === 'cyclist' && (
            <>
              <ParticipatedChallenges />
              <AvailableChallenges />
            </>
          )
        }
        {
          user.role === 'club' && (
            <AvailableChallenges />
          )
        }
      </section>
    </div>
  ) : <LoaderSVG />;
};
