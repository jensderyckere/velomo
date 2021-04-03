import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

// Components
import { Badge, DateText, ImageUrl, LoaderSVG } from '../components';

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
        setUser(retrievedUser);

        let myArray = [];
        let clubArray = [];

        if (retrievedUser.cyclist._clubId) {
          const retrievedClubChallenges = await getClubChallenges(currentUser, retrievedUser.cyclist._clubId._userId.id);
          const retrievedOwnChallenges = await getMyChallenges(currentUser);

          for (let ownChallenge of retrievedOwnChallenges) {
            if (moment(Date.now()).isBetween(ownChallenge._challengeId.start_date, ownChallenge._challengeId.end_date)) {
              myArray.push(ownChallenge);
            };
          };
  
          for (let clubChallenge of retrievedClubChallenges.club._challengeIds) {
            if (moment(Date.now()).isBetween(clubChallenge._challengeId.start_date, clubChallenge._challengeId.end_date)) {
              clubArray.push(clubChallenge);
            };
          };
        };

        setMyChallenges(myArray);
        setClubChallenges(clubArray);
      } else if (retrievedUser.role === 'club') {
        const retrievedClubChallenges = await getClubChallenges(currentUser, retrievedUser._id);       
        setClubChallenges(retrievedClubChallenges.club._challengeIds);
        setUser(retrievedUser);
      } else {
        throw new Error();
      };
    } catch (error) {
      console.log(error);
    };
  }, [getClubChallenges, getMyChallenges, currentUser, getCurrentUser]);

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
            <p className={`darkgrey-color ${ScreenSizeClassSwitch('text-left', 'text-center')} text-size tertiary-font light-font`}>
              {challenge.shortContent}
            </p>
            <p className={`${ScreenSizeClassSwitch('text-left', 'text-center')} margin-0 orange-color text-size secundary-font bold-font`}>
              {DateText(challenge.start_date)} - {DateText(challenge.end_date)}
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
