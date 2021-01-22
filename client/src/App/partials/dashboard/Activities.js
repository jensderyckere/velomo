import React, { useState } from 'react';

// Partials
import { ActivitiesSwitch } from '.';

export const Activitites = ({ screenSize, user }) => {
  const [ selected, setSelected ] = useState(
    user.role === 'club' ? user.club._cyclistIds.length !== 0 ? user.club._cyclistIds[0] : false :
    user.role === 'parent' ? user.parent._cyclistIds.length !== 0 ? user.parent._cyclistIds[0] : false : false
  );
  
  return (
    <section className="activities margin-top-50">
      {
        user.role === 'cyclist' ? (
          <h1 className="secundary-font title-size bold-font">
            Jouw laatste activiteiten
          </h1>
        ) : (
          user.club._cyclistIds.length !== 0 ? (
            <ActivitiesSwitch 
              user={user}
              users={user.role === 'club' ? user.club._cyclistIds.length !== 0 ? user.club._cyclistIds : false : false}
              selected={selected}
              setSelected={setSelected}
            />
          ) : ''
        )
      }
    </section>
  );
};
