import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { default as Moment } from 'moment';
import 'moment/locale/nl-be';

// Services
import { useApi, useAuth } from '../../services';

// Routes
import * as Routes from '../../routes';

// Images
import DefaultUser from '../../assets/icons/user.svg';

// Components
import { ClockSVG, DateText, ImageUrl, NextSVG, PreviousSVG, SlugText } from '../../components';

// Partials
import { ActivityMap } from '../activity';

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
      console.log(error);
    };
  }, [getRandomChallenge, currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const ChartItem = ({ owner }) => {
    const [ showDistance, setShowDistance ] = useState(false);

    return (
      <div className="dashboard-challenge__charts--item d-flex">
        {
          challenge.participants.map((challenger, index) => {
            return challenger.user._id === owner._id && (
              <div className="dashboard-challenge__charts--item__content" key={index}>
                <div className="d-flex justify-content-center">
                  <div onMouseEnter={() => setShowDistance(true)} onMouseLeave={() => setShowDistance(false)} className="avatar avatar-standard pointer" onClick={() => history.push(Routes.MY_PROFILE)} style={{
                    backgroundImage: `url(${ImageUrl(challenger.user.profile.avatar, DefaultUser)})`
                  }}></div>
                  {
                    showDistance && <div className="standard-shadow radius-10 dashboard-challenge__charts--item__content--distance">
                      {challenger.distance.toFixed(2)} {challenge.challenge.type === 'distance' ? 'km' : 'u'}
                    </div>
                  }
                </div>
                <div className="d-flex justify-content-center" style={{
                  height: `${challenge.challenge.type === 'distance' ? ((challenger.distance / maximum) * 100) * 2 : ((challenger.duration / maximum) * 100) * 2}px`
                }}>
                  <div className="dashboard-challenge__charts--item__content--bar" style={{
                    height: `${challenge.challenge.type === 'distance' ? ((challenger.distance / maximum) * 100) * 2 : ((challenger.duration / maximum) * 100) * 2}px`
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
    const [ showDistance, setShowDistance ] = useState(false);

    return participant.user._id !== owner._id ? (
      <div className="dashboard-challenge__charts--item d-flex">
        <div className="dashboard-challenge__charts--item__content">
          <div className="d-flex justify-content-center">
            <div onMouseEnter={() => setShowDistance(true)} onMouseLeave={() => setShowDistance(false)} className="avatar avatar-standard pointer" onClick={() => history.push(Routes.PROFILE.replace(':name', SlugText(participant.user.firstName + ' ' + participant.user.lastName)).replace(':id', participant.user._id))} style={{
              backgroundImage: `url(${ImageUrl(participant.user.profile.avatar, DefaultUser)})`
            }}></div>
            {
              showDistance && <div className="standard-shadow radius-10 dashboard-challenge__charts--item__content--distance">{participant.distance}{challenge.challenge.type === 'distance' ? 'km' : 'u'}</div>
            }
          </div>
          <div className="d-flex justify-content-center" style={{
            height: `${challenge.challenge.type === 'distance' ? ((participant.distance / maximum) * 100) * 2 : ((participant.duration / maximum) * 100) * 2}px`
          }}>
            <div className="dashboard-challenge__charts--item__content--bar" style={{
              height: `${challenge.challenge.type === 'distance' ? ((participant.distance / maximum) * 100) * 2 : ((participant.duration / maximum) * 100) * 2}px`
            }}></div>
          </div>
        </div>
      </div>
    ) : '';
  };

  const DesktopRandomView = () => {
    // States
    const [ submissionIndex, setSubmissionIndex ] = useState(0);

    return (
      <div className="d-flex justify-content-between">
        {
          challenge.challenge.type === 'distance' && (
            <div className="dashboard-challenge__charts d-flex align-items-end">
              <ChartItem owner={user} />
              {
                challenge.participants.map((participant, index) => {
                  return index < 5 && <OtherChartItem participant={participant} owner={user} key={index} />
                })
              }
            </div>
          )
        }
        {
          challenge.challenge.type === 'duration' && (
            <div className="dashboard-challenge__charts d-flex align-items-end">
              <ChartItem owner={user} />
              {
                challenge.participants.map((participant, index) => {
                  return index < 5 && <OtherChartItem participant={participant} owner={user} key={index} />
                })
              }
            </div>
          )
        }
        {
          challenge.challenge.type === 'activity' && (
            <div className="d-flex align-items-center">
              {
                submissionIndex !== 0 && (
                  <div className="pointer margin-right-10" onClick={() => setSubmissionIndex(submissionIndex-1)}>
                    <PreviousSVG />
                  </div>
                )
              }
              <div className="dashboard-challenge__submissions d-flex align-items-end">
                <div className="dashboard-challenge__submissions--item">
                  <div className="p-relative">
                    <div className="p-absolute avatar avatar-standard pointer" onClick={() => history.push(Routes.PROFILE.replace(':name', SlugText(challenge.challenge.submissions[submissionIndex].activity._userId.firstName + ' ' + challenge.challenge.submissions[submissionIndex].activity._userId.lastName)).replace(':id', challenge.challenge.submissions[submissionIndex].activity._userId._id))} style={{
                      backgroundImage: `url(${ImageUrl(challenge.challenge.submissions[submissionIndex].activity._userId.profile.avatar, DefaultUser)})`
                    }}></div>
                    <ActivityMap activity={challenge.challenge.submissions[submissionIndex].activity} />
                  </div>
                  <div className="margin-top-10 padding-10">
                    <p className="tertiary-font light-font text-size margin-0">"{challenge.challenge.submissions[submissionIndex].text}"</p>
                    <span onClick={() => history.push(Routes.ACTIVITY.replace(':id', challenge.challenge.submissions[submissionIndex].activity._id))} className="text-size tertiary-font light-font darkgrey-color pointer hover-text">Gemaakt op {DateText(challenge.challenge.submissions[submissionIndex].activity.activity.starting_time)}</span>
                  </div>
                </div>
              </div>
              {
                challenge.challenge.submissions[submissionIndex+1] && (
                  <div className="pointer margin-left-10" onClick={() => setSubmissionIndex(submissionIndex+1)}>
                    <NextSVG />
                  </div>
                )
              }
            </div>
          )        
        }
        {
          challenge.challenge.type === 'image' && (
            <div className="d-flex align-items-center">
              {
                submissionIndex !== 0 && (
                  <div className="pointer margin-right-10" onClick={() => setSubmissionIndex(submissionIndex-1)}>
                    <PreviousSVG />
                  </div>
                )
              }
              <div className="dashboard-challenge__submissions d-flex align-items-end">
                <div className="dashboard-challenge__submissions--item">
                  <div className="p-relative">
                    <div className="p-absolute avatar avatar-standard pointer" onClick={() => history.push(Routes.PROFILE.replace(':name', SlugText(challenge.challenge.submissions[submissionIndex]._userId.firstName + ' ' + challenge.challenge.submissions[submissionIndex]._userId.lastName)).replace(':id', challenge.challenge.submissions[submissionIndex]._userId._id))} style={{
                      backgroundImage: `url(${ImageUrl(challenge.challenge.submissions[submissionIndex]._userId.profile.avatar, DefaultUser)})`
                    }}></div>
                    <div className="dashboard-challenge__submissions--item__image" style={{
                      backgroundImage: `url(${ImageUrl(challenge.challenge.submissions[submissionIndex].image, '')})`
                    }}></div>
                  </div>
                  <div className="margin-top-10 padding-10">
                    <p className="tertiary-font light-font text-size margin-0">"{challenge.challenge.submissions[submissionIndex].text}"</p>
                    <span className="text-size tertiary-font light-font darkgrey-color">Gemaakt op {DateText(challenge.challenge.submissions[submissionIndex]._createdAt)}</span>
                  </div>
                </div>
              </div>
              {
                challenge.challenge.submissions[submissionIndex+1] && (
                  <div className="pointer margin-left-10" onClick={() => setSubmissionIndex(submissionIndex+1)}>
                    <NextSVG />
                  </div>
                )
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
          <div className="margin-top-20 d-flex justify-content-end align-items-center">
            <ClockSVG />
            <span className="margin-left-10 text-size tertiary-font light-font">
              Nog {Moment.duration(Moment(Date.now()).diff(Moment(challenge.challenge.end_date))).asDays().toFixed(0).split('-')[1]} dagen
            </span>
          </div>
        </div>
      </div>
    )
  };

  return challenge ? (
    <div className="grey-card d-lg-block d-none dashboard-challenge margin-top-20">
      <h1 className="secundary-font title-size bold-font margin-top-30 margin-bottom-50">Op de hoogte van de recentste ontwikkelingen!</h1>
      <DesktopRandomView />
    </div>
  ) : '';
};
