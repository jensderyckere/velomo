import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

// Components
import { Badge, ImageUrl, StandardButton } from '../components';

// Services
import { useApi, useAuth } from '../services';

// Routes
import * as Routes from '../routes';

// Utils
import { ScreenSizeClassSwitch } from '../utils';

export const Goals = () => {
  // Routing
  const history = useHistory();

  // States
  const [ user, setUser ] = useState();
  const [ goals, setGoals ] = useState();

  // Services
  const { currentUser, getCurrentUser } = useAuth();
  const { getUserGoals, getCreatorGoals } = useApi();

  // Fetch data
  const fetchNeeded = useCallback(async () => {
    const retrievedUser = await getCurrentUser(currentUser);
    setUser(retrievedUser);

    if (retrievedUser.role === 'cyclist') {
      const goalsData = await getUserGoals(currentUser, retrievedUser._id);
      setGoals(goalsData);
    } else {
      const goalsData = await getCreatorGoals(currentUser, retrievedUser._id);
      setGoals(goalsData);
    };
  }, [currentUser, getCurrentUser, getCreatorGoals, getUserGoals]);

  useEffect(() => {
    fetchNeeded();
  }, [fetchNeeded]);

  const GoalSection = ({ goal }) => {
    return (
      <div className="challenges__item">
        <div className={`${ScreenSizeClassSwitch('d-flex', '')} align-items-center margin-bottom-30`}>
          <div className="d-flex justify-content-center">
          <Badge 
            badge={{
              id: goal._id,
              size: 'big',
              image: ImageUrl(goal.badge),
              goal: true,
            }}
          />
          </div>
          <div className={`${ScreenSizeClassSwitch('margin-left-30', 'margin-top-30')}`}>
            <h5 className={`secundary-font ${ScreenSizeClassSwitch('text-left', 'text-center')}  subtitle-size bold-font hover-text pointer`} onClick={() => history.push(Routes.GOAL.replace(':id', goal._id))}>
              {goal.title}
            </h5>
            <p className={`darkgrey-color ${ScreenSizeClassSwitch('text-left', 'text-center')} text-size tertiary-font ligth-font`}>
              {goal.description}
            </p>
          </div>
        </div>
        <hr className="standard-hr margin-bottom-20" />
      </div>
    );
  };

  return user ? (
    <div className="container">
      <section className="w-100">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="secundary-font title-size bold-font">Jouw doelstellingen</h2>
          {
            user.role === 'cyclist' && (
              <StandardButton 
                text="Doelstelling maken"
                action={() => history.push(Routes.CREATE_GOAL, {cyclistId: user._id})}
              />
            )
          }
        </div>
        <div className="goals margin-top-30">
          {
            goals && goals.length !== 0 ? goals.map((goal, index) => {
              return <GoalSection key={index} goal={goal} />
            }) : (
              <span className="tertiary-font light-font text-size">Er zijn nog geen actieve doelstellingen gaande.</span>
            )
          }
        </div>
      </section>
    </div>
  ) : '';
};
