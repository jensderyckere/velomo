import React, { useState } from 'react';

// Utils
import { ScreenSizeClassSwitch } from '../../utils';

// Partials
import { RewardContent, SystemShortcuts } from '.';
import { UserPts } from '../user';
import { AvailableRewards } from './AvailableRewards';

export const SystemContent = ({ system, user }) => {
  // States
  const [ selectedReward, setSelectedReward ] = useState(system._rewardIds.length !== 0 ? system._rewardIds[0] : null);

  const DesktopView = () => {
    return (
      <div className="container d-flex">
        <section className="left-sided p-relative w-60">
          <RewardContent 
            reward={selectedReward}
            user={user}
          />
        </section>
        <section className="right-sided p-relative w-40">
          {
            user.role === "cyclist" && (
              <UserPts
                user={user} 
              />
            )
          }
          {
            user.role === "club" ? user._id === system._clubId._id && (
              <SystemShortcuts 
                system={system}
              />
            ) : ''
          }
          <AvailableRewards 
            user={user}
            selectedReward={selectedReward}
            setSelectedReward={setSelectedReward}
            rewards={system._rewardIds}
          />
        </section>
      </div>
    );
  };

  return ScreenSizeClassSwitch(<DesktopView />, '');
};