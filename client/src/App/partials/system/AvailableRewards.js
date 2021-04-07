import React from 'react';
import { CheckSVG, ImageUrl } from '../../components';

export const AvailableRewards = ({ rewards, selectedReward, setSelectedReward, user, mobile }) => {
  // Change selected
  const changeSelected = (reward) => {
    setSelectedReward(reward);

    if (mobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  };

  const RewardItem = ({ reward }) => {
    return (
      <div className={`reward-item d-flex ${selectedReward._id === reward._id ? 'selected-reward' : ''}`} onClick={() => changeSelected(reward)}>
        <div className="reward-item__avatar" style={{
          backgroundImage: `url(${ImageUrl(reward.avatar)})`
        }}>
        </div>
        <div className="reward-item__content">
          {
            user.cyclist.pts >= reward.needed_amount && (
              <div className="reward-item__content--check">
                <CheckSVG />
              </div>
            )
          }
          <div>
            <h6 className="secundary-font subtitle-size bold-font">{reward.title}</h6>
            <p className="tertiary-font text-size light-font">Bij het behalen van {reward.needed_amount} punten</p>
            {
              user.role === 'cyclist' && (
                <div className="reward-item__content--progress">
                  <div className="reward-item__content--progress__inner" style={{
                    width: `${(user.cyclist.pts / reward.needed_amount) * 100}%`
                  }}>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="available-rewards margin-top-50">
      <h2 className="secundary-font bold-font title-size">
        Alle beschikbare beloningen
      </h2>
      <div className="awailable-rewards__wrapper margin-top-30">
        {
          rewards.length === 0 ? (
            <span className="tertiary-font light-font text-size">
              Er zijn nog geen beloningen aangemaakt.
            </span>
          ) : (
            rewards.map((reward, index) => {
              return <RewardItem key={index} reward={reward} />
            })
          )
        }
      </div>
    </div>
  );
};
