import React from 'react';

// Partials
import { UserOverview } from '.';

export const MyUserContent = ({ user, screenSize }) => {
  const ClubContent = () => {
    return (
      <>
        <UserOverview 
          user={user}
          cyclists={user.club._cyclistIds}
          members={user.club._memberIds}
          cred={true}
          screenSize={screenSize}
        />
      </>
    )
  };

  const ParentContent = () => {
    return (
      <>
        <UserOverview 
          user={user}
          cyclists={user.parent._cyclistIds}
          cred={true}
          screenSize={screenSize}
        />
      </>
    )
  };

  return (
    <div className="user-content">
      {
        user.role === 'club' && <ClubContent />
      }
      {
        user.role === 'parent' && <ParentContent />
      }
    </div>
  );
};
