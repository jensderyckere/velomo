import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

// Components
import { ImageUrl, StandardButton } from '../../components';

// Routes
import * as Routes from '../../routes';

export const RewardContent = ({ reward, user, fixed }) => {
  // Routing
  const history = useHistory();

  // States
  const [  width, setWidth ] = useState(0);

  useEffect(() => {
    const wrapper = document.getElementById('wrapper').getBoundingClientRect().width;
    setWidth(wrapper);
  }, []);

  return (
    <div className="reward-content-wrapper" id="wrapper">
    <div className={`reward-content ${fixed ? 'fixed-reward' : ''}`} id="content" style={{width: width}}>
      {
        reward ? (
          <>
            <div className="reward-content__banner" style={{
              backgroundImage: `url(${ImageUrl(reward.banner)})`
            }}>
            </div>
            <div className="reward-content__head d-flex align-items-center">
              <div className="reward-content__head--avatar" style={{
                backgroundImage: `url(${ImageUrl(reward.avatar)})`
              }}></div>
              <h5 className="secundary-font bold-font subtitle-size margin-left-20">
                {reward.name}
              </h5>
            </div>
            <div className="margin-top-30 reward-content__inner">
              <div>
                <h6 className="secundary-font bold-font text-size">
                  {reward.title}
                </h6>
                <p className="tertiary-font light-font text-size">
                  {reward.description}
                </p>
              </div>
              {
                user.role === 'cyclist' && (
                  <div className="reward-content--progress-wrapper">
                    <div className="reward-content--progress">
                      <div className="reward-content--progress__inner" style={{
                        width: `${(user.cyclist.pts / reward.needed_amount) * 100}%`
                      }}>
                      </div>
                    </div>
                    <span className="tertiary-font text-size light-font">
                      {
                        (reward.needed_amount - user.cyclist.pts) > 0 ? (
                          `Nog ${reward.needed_amount - user.cyclist.pts} punten te gaan`
                        ) : (
                          'Volbracht'
                        )
                      }
                    </span>
                  </div>
                )
              }
            </div>
          </>
        ) : (
          <div className="reward-content-none">
            <div>
              <h2 className="title-size bold-font secundary-font text-center">
                Er zijn nog geen verdiensten gemaakt.
              </h2>
              <p className="text-center light-font text-size tertiary-font margin-top-20">
                {user.role === "club" ? (
                  'Maak snel nieuwe verdiensten aan om jouw renners te belonen voor hun inspanningen.'
                ) : (
                  'Nog even geduld. Jouw club is druk bezig met het maken van leuke beloningen.'
                )}
              </p>
              {
                user.role === "club" && (
                  <div className="d-flex justify-content-center margin-top-20">
                    <StandardButton 
                      text="Beloning maken"
                      action={() => history.push(Routes.CREATE_REWARD)}
                    />
                  </div>
                )
              }
            </div>
          </div>
        )
      }
    </div>
    </div>
  );
};
