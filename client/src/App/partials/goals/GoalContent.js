import React from 'react';
import { useHistory } from 'react-router';

// Components
import { StandardButton } from '../../components';

// Routes
import * as Routes from '../../routes';

export const GoalContent = ({ goal, user }) => {
  // Routing
  const history = useHistory();

  return (
    <>
    {
      goal._creatorId._id === user._id ? (
        <div className="d-flex align-items-center">
          <StandardButton 
            text="Bewerk doelstelling"
            action={() => history.push(Routes.EDIT_GOAL.replace(':id', goal._id))}
          />
        </div>
      ) : (
        ''
      )
    }
    <div className="challenge-content">
      <h1 className="secundary-font title-size bold-font margin-top-30">"{goal.title}"</h1>
      <p className="tertiary-font text-size margin-top-30 standard-lh light-font">{goal.description}</p>
    </div>
    </>
  )
};
