import React, { useEffect, useState } from 'react';

// Partials
import { ActivityItem } from './ActivityItem';

export const ActivitiesOverview = ({ user }) => {
  const [ paginate, setPaginate ] = useState(3);

  useEffect(() => {
    window.onscroll = function(ev) {
      if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
          setPaginate(paginate+3);
      };
    };
  });

  return (
    <div className="activities__overview">
      {
        user && user.cyclist._activityIds.map((activity, index) => {
          return index < paginate && <ActivityItem key={index} user={user} activity={activity} />
        })
      }
    </div>
  );
};
