import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

// Partials
import { UserOverview, ChallengeOverview, UserBadges, UserPts } from '..';

// Components
import { ColumnChart, StandardButton } from '../../components';

// Services
import { useAuth } from '../../services';

// Utils
import { ScreenSizeClassSwitch } from '../../utils';

// Routes
import * as Routes from '../../routes';

export const MyUserContent = ({ user, screenSize, cred, watchingUser }) => {
  // Routing
  const history = useHistory();

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
    // States
    const [ cyclists, setCyclists ] = useState([]);

    // Services
    const { currentUser, getUserViaId } = useAuth();

    // Fetch members cyclists
    const fetchData = useCallback(async () => {
      let arrayOfCyclists = [];

      for (let cyclist of user.member._clubId._userId.club._cyclistIds) {
        const result = await getUserViaId(currentUser, cyclist, 'cyclist');
        arrayOfCyclists.push(result);
      };

      setCyclists(arrayOfCyclists);
    }, [currentUser, getUserViaId]);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    return (
      <>
        <UserOverview 
          user={user}
          cyclists={cyclists}
          cred={false}
          screenSize={screenSize}
        />
      </>
    );
  };

  const UserContent = () => {
    // States
    const [ distanceData, setDistanceData ] = useState();
    const [ distanceMax, setDistanceMax ] = useState();

    // eslint-disable-next-line
    const [ typeGraph, setTypeGraph ] = useState("distance");
    const [ ifParent, setIfParent ] = useState(false);

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

        if (user.role === "cyclist") {
          for (let parent of user.cyclist._parentIds) {
            if (String(parent._userId._id) === String(watchingUser._id)) {
              setIfParent(true);
            };
          };
        };
      } catch (e) {
        console.log(e);
      };
    }, [getCurrentCharts, currentUser]);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    return distanceData ? (
      <> 
      {
        user.role === 'cyclist' && user.cyclist._clubId && user.cyclist._clubId._userId._id === watchingUser._id && (
          <div className={`d-flex justify-content-end ${ScreenSizeClassSwitch('', 'margin-top-30')} margin-bottom-20`}>
            <StandardButton 
              text="Doelstelling maken"
              action={() => history.push(Routes.CREATE_GOAL, {cyclistId: user._id})}
            />
          </div>
        )
      }
      {
        user.role === 'cyclist' && watchingUser.role === 'clubmember' && (
          <div className={`d-flex justify-content-end ${ScreenSizeClassSwitch('', 'margin-top-30')} margin-bottom-20`}>
            <StandardButton 
              text="Doelstelling maken"
              action={() => history.push(Routes.CREATE_GOAL, {cyclistId: user._id})}
            />
          </div>
        )
      }
      {
        ifParent && (
          <div className={`d-flex justify-content-end ${ScreenSizeClassSwitch('', 'margin-top-30')} margin-bottom-20`}>
            <StandardButton 
              text="Doelstelling maken"
              action={() => history.push(Routes.CREATE_GOAL, {cyclistId: user._id})}
            />
          </div>
        )
      }
      <UserPts 
        user={user}
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
          {/* <h5 onClick={() => setTypeGraph("distance")} className={`pointer secundary-font user-content__graph--options__option ${typeGraph === 'distance' ? 'used-option' : 'non-used-option'} bold-font subtitle-size margin-right-10`}>Afstand</h5>
          <h5 onClick={() => setTypeGraph("challenges")} className={`pointer secundary-font user-content__graph--options__option ${typeGraph === 'challenges' ? 'used-option' : 'non-used-option'} bold-font subtitle-size`}>Uitdagingen</h5> */}
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
      <UserBadges 
        currentUser={currentUser}
        user={user}
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
