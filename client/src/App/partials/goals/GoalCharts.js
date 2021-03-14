import React, { useCallback, useEffect, useState } from 'react';

// Components
import { CircleChart } from '../../components';

// Services
import { useApi, useAuth } from '../../services';

export const GoalCharts = ({ goal, user }) => {
  // Services 
  const { showGoalsStats } = useApi();
  const { currentUser } = useAuth();

  // Stats
  const [ stats, setStats ] = useState();

  // Fetch goal stats
  const fetchData = useCallback(async () => {
    const data = await showGoalsStats(currentUser, goal._cyclistId._id, goal._id);
    setStats(data);
  }, [currentUser, showGoalsStats, goal]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return stats ? (
    <div className="grey-card d-lg-block d-none goal-charts margin-top-50">
      <h1 className="secundary-font title-size bold-font">Hoe verloopt deze doelstelling?</h1>
      <div className="row margin-top-30">
        <div className="col-12 col-lg-6 d-flex align-items-center">
          <div>
            <div className="secundary-font text-size light-font">
              {
                goal.type === 'ride' ? (
                  `Maximale afstand op één rit tot nu toe`
                ) : (
                  `Afgelegde afstand binnen deze periode`
                )
              }
              <strong className="margin-left-10 bold-font">
                {
                  parseInt(stats.progress)
                }
                km
              </strong>
            </div>
            <div className="secundary-font margin-top-10 text-size light-font">
                {
                  goal.type === 'ride' ? (
                    `Extra afstand nodig op je vorige langste rit`
                  ) : (
                    `Afstand nodig tot voltooien`
                  )
                } 
              <strong className="margin-left-10 bold-font">
                {
                  (parseInt(stats.goal) - parseInt(stats.progress)) > 0 ? (
                    parseInt(stats.goal) - parseInt(stats.progress)
                  ) : (
                    0
                  )
                }
                km
              </strong>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6 d-flex justify-content-lg-end align-items-center justify-content-center">
          <CircleChart percentage={(parseInt(stats.progress) / parseInt(stats.goal)) * 100} />
        </div>
      </div>
    </div>
  ) : '';
};
