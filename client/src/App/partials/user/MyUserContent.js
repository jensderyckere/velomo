import React, { useCallback, useEffect, useState } from 'react';

// Partials
import { UserOverview } from '.';

// Components
import { ColumnChart } from '../../components';

// Services
import { useAuth } from '../../services';

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

  const UserContent = () => {
    const [ distanceData, setDistanceData ] = useState();
    const [ distanceMax, setDistanceMax ] = useState();

    const { getCurrentCharts, currentUser } = useAuth();

    const fetchData = useCallback(async () => {
      try {
        const data = await getCurrentCharts(currentUser, user._id);
        
        let distanceArray = [];
        for (let i = 0; i < data.results.length; i++) {
          distanceArray.push({month: data.results[i].month, number: data.results[i].totalDistance});
        };

        setDistanceData(distanceArray);
        setDistanceMax(data.maximum_distance);
      } catch (e) {
        console.log(e);
      };
    }, [getCurrentCharts, currentUser]);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    return distanceData ? (
      <>
        <ColumnChart 
          data={distanceData}
          max={distanceMax}
        />
      </>
    ) : '';
  };

  return (
    <div className="user-content">
      {
        user.role === 'cyclist' && <UserContent />
      }
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
