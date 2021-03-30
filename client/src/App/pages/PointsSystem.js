import React, { useCallback, useEffect, useState } from 'react';

// Components
import { LoaderSVG, StandardButton } from '../components';

// Partials
import { SystemContent } from '../partials';

// Services
import { useApi, useAuth } from '../services';

export const PointsSystem = () => {
  // States
  const [ user, setUser ] = useState();
  const [ selectedSystem, setSelectedSystem ] = useState();
  const [ system, setSystem ] = useState('loading');

  // Services
  const { currentUser, getCurrentUser } = useAuth();
  const { getSystem, createSystem } = useApi();

  // Fetch
  const fetchData = useCallback(async () => {
    try {
      const userData = await getCurrentUser(currentUser);
      setUser(userData);

      if (userData.role === 'club') {
        const systemData = await getSystem(currentUser, userData._id);

        if (systemData.length !== 0) {
          setSystem(systemData);
        } else {
          setSystem(false);
        };
      } else if (userData.role === 'clubmember') {
        const systemData = await getSystem(currentUser, userData.member._clubId);

        if (systemData.length !== 0) {
          setSystem(systemData);
        } else {
          setSystem(false);
        };
      } else if (userData.role === 'cyclist') {
        const systemData = await getSystem(currentUser, userData._id);

        if (systemData.length !== 0) {
          setSystem(systemData);
        } else {
          setSystem(false);
        };
      } else {

      };
    } catch (e) {
      console.log(e);
    };
  }, [getCurrentUser, currentUser, getSystem]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createNewSystem = async () => {
    await createSystem(currentUser);

    // Refresh state
    if (user.role === 'club') {
      const systemData = await getSystem(currentUser, user._id);

      if (systemData.length !== 0) {
        setSystem(systemData);
      } else {
        setSystem(false);
      };
    };
  };

  const NoSystem = () => {
    return (
      <div className="container d-flex">
        <section className="w-100 system-none">
          <div className="system-none__wrapper">
            <h2 className="secundary-font title-size text-center bold-font margin-bottom-20">
              Er is nog geen puntensysteem aangemaakt.
            </h2>
            <p className="text-size text-center light-font tertiary-font">
              {
                user.role === "club" ? (
                  'Door op onderstaande knop te drukken, kan je jouw puntensysteem activeren.'
                ) : (
                  'Jouw club heeft nog geen puntensysteem aangemaakt. Kom later terug.'
                )
              }
            </p>
            {
              user.role === "club" && (
                <div className="d-flex justify-content-center margin-top-30">
                  <StandardButton 
                    text="Puntensysteem aanmaken"
                    action={createNewSystem}
                  />
                </div>
              )
            }
          </div>
        </section>
      </div>
    )
  };

  const SystemOverview = () => {
    return system ? (
      <SystemContent
        user={user}
        system={system} 
      />
    ) : (
      <NoSystem />
    );
  };

  const ParentChooseSystem = () => {
    return '';
  };

  return user ? system !== 'loading' ? user.role === 'parent' ? <ParentChooseSystem /> : <SystemOverview /> : <LoaderSVG /> : <LoaderSVG />;
};
