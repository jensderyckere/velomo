import React from 'react';

// Partials
import { UserOverview } from '.';

export const MyUserContent = ({ user, screenSize, cred }) => {
  const ClubContent = () => {
    return (
      <>
        <UserOverview 
          user={user}
          cyclists={user.club._cyclistIds}
          members={user.club._memberIds}
          cred={cred}
          screenSize={screenSize}
        />
      </>
    );
  };

  const ParentContent = () => {
    return (
      <>
        <UserOverview 
          user={user}
          cyclists={user.parent._cyclistIds}
          cred={cred}
          screenSize={screenSize}
        />
      </>
    );
  };

  const MemberContent = () => {
    return (
      <>
        <UserOverview 
          user={user}
          cyclists={user.member._clubId._userId.club._cyclistIds}
          cred={cred}
          screenSize={screenSize}
        />
      </>
    );
  };

  return (
    <div className="user-content">
      {
        user.role === 'club' && <ClubContent />
      }
      {
        user.role === 'parent' && <ParentContent />
      }
      {
        user.role === 'clubmember' && <MemberContent />
      }
    </div>
  );
};
