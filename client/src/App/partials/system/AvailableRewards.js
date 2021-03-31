import React from 'react';

export const AvailableRewards = ({ rewards, selectedReward, setSelectedReward, user }) => {
  const RewardItem = ({ reward }) => {
    return '';
  };

  return (
    <div className="available-rewards margin-top-50">
      <h2 className="secundary-font bold-font title-size">
        Alle beschikbare beloningen
      </h2>
      <div className="awailable-rewards__wrapper margin-top-20">
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