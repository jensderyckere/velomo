import React, { useCallback, useEffect, useState } from 'react';

// Components
import { ImageUrl, LoaderSVG, StandardButton } from '../components';

// Partials
import { SystemContent } from '../partials';

// Services
import { useApi, useAuth } from '../services';

// Images
import DefaultUser from '../assets/icons/user.svg';

export const PointsSystem = () => {
  // States
  const [ user, setUser ] = useState();
  const [ system, setSystem ] = useState('loading');
  const [ selectedSystem, setSelectedSystem ] = useState();
  const [ selectedUser, setSelectedUser ] = useState();

  // Services
  const { currentUser, getCurrentUser, getUser } = useAuth();
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
        const systemData = await getSystem(currentUser, userData.member._clubId._userId._id);

        if (systemData.length !== 0) {
          setSystem(systemData);
        } else {
          setSystem(false);
        };
      } else if (userData.role === 'cyclist') {
        const systemData = await getSystem(currentUser, userData.cyclist._clubId._userId._id);

        if (systemData.length !== 0) {
          setSystem(systemData);
        } else {
          setSystem(false);
        };
      } else {
        if (selectedSystem) {
          const selectedUserData = await getUser(currentUser, selectedSystem._id);
          setSelectedUser(selectedUserData);
          const systemData = await getSystem(currentUser, selectedUserData.cyclist._clubId._userId._id);
          setSystem(systemData);
        }
      };
    } catch (e) {
      console.log(e);
    };
  }, [getCurrentUser, currentUser, getSystem, selectedSystem, getUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const changeUser = () => {
    setSystem('loading');
    setSelectedUser(null);
    setSelectedSystem(null);
  };

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
    return selectedSystem ? (
      system !== 'loading' ? <SystemContent
        user={user}
        selectedUser={selectedUser}
        system={system} 
        changeUser={changeUser}
      /> : <LoaderSVG />
    ) : (
      <div className="container d-flex">
        <section className="w-100">
          <h1 className="secundary-font title-size bold-font">
            Selecteer één van jouw renners om hun vooruitgang te zien
          </h1>
          <div className="row margin-top-50">
            {
              user.parent._cyclistIds.length !== 0 ? user.parent._cyclistIds.map((cyclist, index) => {
                return (
                  <div className="col-lg-4 col-12" key={index}>
                    <div className="grey-user-item" onClick={() => setSelectedSystem(cyclist._userId)}>
                      <div className="avatar avatar-standard" style={{
                        backgroundImage: `url(${ImageUrl(cyclist._userId.profile.avatar, DefaultUser)})`
                      }}></div>
                      <h5 className="secundary-font subtitle-size bold-font">
                        {cyclist._userId.firstName + ' ' + cyclist._userId.lastName}
                      </h5>
                    </div>
                  </div>
                )
              }) : (
                <span className="tertiary-font text-size light-font">
                  Je hebt nog geen renners met jouw profiel verbonden.
                </span>
              )
            }
          </div>
        </section>
      </div>
    );
  };

  return user ? user.role === 'parent' ? <ParentChooseSystem /> : system !== 'loading' ? <SystemOverview /> : <LoaderSVG /> : <LoaderSVG />;
};
