import React, { useCallback, useEffect, useState } from 'react';

// Partials
import { UserOverview, ChallengeOverview, UserLevelBar } from '..';

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
        <ChallengeOverview 
          user={user}
          cred={cred}
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
    // States
    const [ distanceData, setDistanceData ] = useState();
    const [ distanceMax, setDistanceMax ] = useState();

    const [ typeGraph, setTypeGraph ] = useState("distance");

    // Services
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
      <UserLevelBar 
        lvl={user.cyclist.level}
        title={user.cyclist.level_name}
        xp={user.cyclist.xp}
      />
      <div className="user-content__graph margin-top-50">
        <h3 className="secundary-font bold-font title-size margin-bottom-30">
          {
            typeGraph === "distance" && "Afgelegde afstand"
          }
          {
            typeGraph === "challenges" && "Voltooide uitdagingen"
          }
        </h3>
        <div className="user-content__graph--options d-flex justify-content-end margin-bottom-0">
          <h5 onClick={() => setTypeGraph("distance")} className={`pointer secundary-font user-content__graph--options__option ${typeGraph === 'distance' ? 'used-option' : 'non-used-option'} bold-font subtitle-size margin-right-10`}>Afstand</h5>
          <h5 onClick={() => setTypeGraph("challenges")} className={`pointer secundary-font user-content__graph--options__option ${typeGraph === 'challenges' ? 'used-option' : 'non-used-option'} bold-font subtitle-size`}>Uitdagingen</h5>
        </div>
      </div>
      {
        typeGraph === "distance" && (
          <ColumnChart 
            data={distanceData}
            max={distanceMax}
          />
        )
      }
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
