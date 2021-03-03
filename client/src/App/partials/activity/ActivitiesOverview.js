import React, { useState } from 'react';

// Partials
import { ActivityItem } from '../activity';

export const ActivitiesOverview = ({ user, activities, cred }) => {
  // States
  const [ paginate, setPaginate ] = useState(9);

  return (
    <div className="activities-overview">
      {
        activities && activities.length !== 0 ? 
        <>
          {
            activities.map((activity, index) => {
              return index > paginate-10 && index < paginate && <ActivityItem key={index} user={user} cred={cred} activity={activity} />
            })
          }
          <div className="activities-overview__paginate d-flex margin-top-10">
            {
              paginate > 9 && <span onClick={() => setPaginate(paginate+9)} className="left-paginate secundary-font bold-font text-size">Vorige</span>
            }
            {
              activities.length > paginate && <span onClick={() => setPaginate(paginate-9)} className="right-paginate secundary-font bold-font text-size">Volgende</span>
            }
          </div>
        </> : (
          <div className="no-activities secundary-font text-size light-font">
            Er zijn nog geen activiteiten gemaakt.
          </div>
        )
      }
    </div>
  )
};
