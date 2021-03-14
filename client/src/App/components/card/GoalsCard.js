import React from 'react';
import { useHistory } from 'react-router-dom';
import { default as Moment } from 'moment';
import 'moment/locale/nl-be';

// Components
import { Badge } from '../badge';
import { DateText, ImageUrl } from '../text';

// Routes
import * as Routes from '../../routes';

export const GoalsCard = ({ title, goals }) => {
  // Routing
  const history = useHistory();

  const GoalShort = ({ goal }) => {
    return !goal.completed && Moment(Date.now()).isBetween(goal.start_date, goal.end_date) ? (
      <div className="challenge-card__item d-flex align-items-center margin-top-10">
        <Badge 
          badge={{
            id: goal._id,
            size: 'small',
            image: ImageUrl(goal.badge),
            goal: true,
          }}
        />
        <div className="margin-left-20">
          <h5 className="secundary-font text-size bold-font margin-0 pointer hover-text" onClick={() => history.push(Routes.GOAL.replace(':id', goal._id))}>
            {goal.title}
          </h5>
          <p className="tertiary-font text-size light-font margin-0">
            Loopt tot {DateText(goal.end_date)}
          </p>
        </div>
      </div>
    ) : ''
  };

  return (
    <div className="grey-card challenge-card">
      <h3 className="secundary-font text-center title-size bold-font margin-bottom-30">{title}</h3>
      {
        goals.map((goal, index) => {
          return goal && <GoalShort key={index} goal={goal} />
        })
      }
    </div>
  )
};