import React, { useState } from 'react';

// Utils
import { ScreenSizeClassSwitch } from '../../utils';

// Partials
import { RewardContent } from '.';

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

        </section>
      </div>
    );
  };

  return ScreenSizeClassSwitch(<DesktopView />, '');
};