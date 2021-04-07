import React, { useState } from 'react';

// Utils
import { ScreenSizeClassSwitch } from '../../utils';

// Partials
import { RewardContent, SystemShortcuts } from '.';
import { UserPts } from '../user';
import { AvailableRewards } from './AvailableRewards';

export const SystemContent = ({ system, user, selectedUser, changeUser }) => {
  // States
  const [ selectedReward, setSelectedReward ] = useState(system._rewardIds.length !== 0 ? system._rewardIds[0] : null);

  const DesktopView = () => {
    return user.role !== 'parent' ? (
      <div className="container d-flex">
        <section className="left-sided p-relative w-60">
          <RewardContent 
            reward={selectedReward}
            fixed={true}
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
    ) : (
      <div className="container d-flex">
        <section className="left-sided p-relative w-60">
          <RewardContent 
            reward={selectedReward}
            user={selectedUser}
          />
        </section>
        <section className="right-sided p-relative w-40">
          <div className="margin-bottom-30">
            <h1 className="secundary-font bold-font title-size">
              Puntensysteem van {selectedUser.firstName + ' ' + selectedUser.lastName}
            </h1>
            <span onClick={changeUser} className="tertiary-font light-font orange-color text-size pointer">
              Wijzig renner
            </span>
          </div>
          <UserPts
            user={selectedUser} 
          />
          <AvailableRewards 
            user={selectedUser}
            selectedReward={selectedReward}
            setSelectedReward={setSelectedReward}
            rewards={system._rewardIds}
          />
        </section>
      </div>
    );
  };

  const MobileView = () => {
    return user.role !== 'parent' ? (
      <div className="container">
        <section className="left-sided p-relative w-100">
          <RewardContent 
            reward={selectedReward}
            fixed={false}
            user={user}
          />
        </section>
        <section className="right-sided p-relative w-100">
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
            mobile={true}
            user={user}
            selectedReward={selectedReward}
            setSelectedReward={setSelectedReward}
            rewards={system._rewardIds}
          />
        </section>
      </div>
    ) : (
      <div className="container d-flex">
        <section className="left-sided p-relative w-60">
          <RewardContent 
            reward={selectedReward}
            user={selectedUser}
          />
        </section>
        <section className="right-sided p-relative w-40">
          <div className="margin-bottom-30">
            <h1 className="secundary-font bold-font title-size">
              Puntensysteem van {selectedUser.firstName + ' ' + selectedUser.lastName}
            </h1>
            <span onClick={changeUser} className="tertiary-font light-font orange-color text-size pointer">
              Wijzig renner
            </span>
          </div>
          <UserPts
            user={selectedUser} 
          />
          <AvailableRewards 
            user={selectedUser}
            selectedReward={selectedReward}
            setSelectedReward={setSelectedReward}
            rewards={system._rewardIds}
          />
        </section>
      </div>
    );
  };

  return ScreenSizeClassSwitch(<DesktopView />, <MobileView />);
};