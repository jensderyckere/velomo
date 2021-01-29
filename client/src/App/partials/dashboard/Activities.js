import React, { useCallback, useEffect, useState } from 'react';

// Partials
import { ActivitiesSwitch, ActivitiesOverview } from '.';

// Services
import { useAuth } from '../../services';

export const Activitites = ({ screenSize, user }) => {
  const [ selected, setSelected ] = useState(
    user.role === 'club' ? user.club._cyclistIds.length !== 0 ? user.club._cyclistIds[0] : false :
    user.role === 'parent' ? user.parent._cyclistIds.length !== 0 ? user.parent._cyclistIds[0] : false : false
  );
  const [ selectedUser, setSelectedUser ] = useState();

  const { currentUser, getUser } = useAuth();

  const fetchUser = useCallback(async () => {
    if (user.role !== 'cyclist') {
      const result = await getUser(currentUser, selected._userId._id);
      setSelectedUser(result);
    };
  }, [getUser, user, currentUser, selected]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  
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
      <ActivitiesOverview 
        user={user.role === 'cyclist' ? user : selectedUser ? selectedUser : ''}
      />
    </section>
  );
};
