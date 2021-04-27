import React, { useCallback, useEffect, useState } from 'react';

// Partials
import { ActivitiesSwitch, ActivitiesOverview } from '.';

// Services
import { useAuth } from '../../services';

export const Activitites = ({ user }) => {
  const [ cyclists, setCyclists ] = useState([]);
  const [ selected, setSelected ] = useState(
    user.role === 'club' ? user.club._cyclistIds.length !== 0 ? user.club._cyclistIds[0] : false :
    user.role === 'parent' ? user.parent._cyclistIds.length !== 0 ? user.parent._cyclistIds[0] : false : user.role === 'clubmember' ? cyclists.length !== 0 ? cyclists[0] : false : false
  );
  const [ selectedUser, setSelectedUser ] = useState();

  const { currentUser, getUser, getUserViaId } = useAuth();

  const fetchUser = useCallback(async () => {
    if (user.role !== 'cyclist') {
      if (selected) {
        const result = await getUser(currentUser, selected._userId._id);
        setSelectedUser(result);
      };
    };
  }, [getUser, user, currentUser, selected]);

  const fetchExtra = useCallback(async () => {
    if (user.role === 'clubmember') {
      let arrayOfCyclists = [];

      for (let cyclist of user.member._clubId._userId.club._cyclistIds) {
        const result = await getUserViaId(currentUser, cyclist, 'cyclist');
        arrayOfCyclists.push(result);
      };
      
      if (!selected) {
        setSelected(arrayOfCyclists[0]);
      };
      setCyclists(arrayOfCyclists);
    };
  }, [user, getUserViaId, currentUser, selected]);

  useEffect(() => {
    fetchUser();
    fetchExtra();
  }, [fetchUser, fetchExtra]);
  
  return (
    <section className="activities">
      {
        user.role === 'cyclist' ? (
          <h1 className="secundary-font title-size bold-font">
            Jouw laatste activiteiten
          </h1>
        ) : user.role === 'parent' ? (
          user.parent._cyclistIds.length !== 0 ? (
            <ActivitiesSwitch 
              user={user}
              users={user.role === 'parent' ? user.parent._cyclistIds.length !== 0 ? user.parent._cyclistIds : false : false}
              selected={selected}
              setSelected={setSelected}
            />
          ) : (
            <>
              <h1 className="secundary-font title-size bold-font">
                Recente activiteiten
              </h1>
              <span className="tertiary-font light-font text-size">
                Er zijn nog geen renners toegevoegd. Voeg renners toe om recente activiteiten te bekijken.
              </span>
            </>
          )
        ) : user.role === 'club' ? (
          user.club._cyclistIds.length !== 0 ? (
            <ActivitiesSwitch 
              user={user}
              users={user.role === 'club' ? user.club._cyclistIds.length !== 0 ? user.club._cyclistIds : false : false}
              selected={selected}
              setSelected={setSelected}
            />
          ) : (
            <>
              <h1 className="secundary-font title-size bold-font">
                Recente activiteiten
              </h1>
              <span className="tertiary-font light-font text-size">
                Er zijn nog geen renners toegevoegd. Voeg renners toe om recente activiteiten te bekijken.
              </span>
            </>
          )
        ) : (
          cyclists.length !== 0 ? (
            <ActivitiesSwitch 
              user={user}
              users={user.role === 'clubmember' ? cyclists !== 0 ? cyclists : false : false}
              selected={selected}
              setSelected={setSelected}
            />
          ) : (
            <>
              <h1 className="secundary-font title-size bold-font">
                Recente activiteiten
              </h1>
              <span className="tertiary-font light-font text-size">
                Er zijn nog geen renners toegevoegd. Voeg renners toe om recente activiteiten te bekijken.
              </span>
            </>
          )
        )
      }
      <ActivitiesOverview 
        user={user.role === 'cyclist' ? user : selectedUser ? selectedUser : ''}
      />
    </section>
  );
};
