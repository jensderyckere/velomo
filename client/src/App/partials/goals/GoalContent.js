import React from 'react';

export const GoalContent = ({ goal, user }) => {
  return (
    <div className="challenge-content">
      <h1 className="secundary-font title-size bold-font margin-top-30">"{goal.title}"</h1>
      <p className="tertiary-font text-size margin-top-30 standard-lh light-font">{goal.content}</p>
    </div>
  )
};
