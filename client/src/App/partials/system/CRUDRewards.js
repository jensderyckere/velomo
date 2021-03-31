import React from 'react';

// Components
import { StandardButton } from '../../components';

export const CRUDRewards = ({ rewards }) => {
  const RewardItem = ({ reward }) => {
    return '';
  };

  return (
    <div className="crud-system">
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
      <div className="justify-content-end d-flex margin-top-20">
        <StandardButton 
          text="Maak beloning"
        />
      </div>
    </div>
  );
};
