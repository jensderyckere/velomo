import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

// Components
import { LoaderSVG } from '../components';

// Services
import { useApi, useAuth } from '../services';

// Routes
import * as Routes from '../routes';
import { CRUDRewards } from '../partials';

export const EditSystem = () => {
  // Routing
  const history = useHistory();

  // States
  const [ user, setUser ] = useState();
  const [ system, setSystem ] = useState();

  // Services
  const { getCurrentUser, currentUser } = useAuth();
  const { getSystem } = useApi();

  // Fetch
  const fetchData = useCallback(async () => {
    const userData = await getCurrentUser(currentUser);
    setUser(userData);

    if (userData.role !== 'club') {
      history.push(Routes.ERROR);
      return;
    };

    const systemData = await getSystem(currentUser, userData._id);

    if (systemData.length === 0) {
      history.push(Routes.ERROR);
      return;
    };

    setSystem(systemData);
  }, [getCurrentUser, currentUser, getSystem, history]);

  const refreshStates = async () => {
    const systemData = await getSystem(currentUser, userData._id);
    setSystem(systemData);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return user ? system ? (
    <div className="container d-flex">
      <section className="w-100">
        <h1 className="title-size bold-font secundary-font">Puntensysteem bewerken</h1>
        <div className="section-title margin-top-50">
          <h5>Beloningen</h5>
        </div>
        <CRUDRewards 
          rewards={system._rewardIds}
          refresh={refreshStates}
        />
        <div className="section-title margin-top-50">
          <h5>Voorwaarden</h5>
        </div>
      </section>
    </div>
  ) : <LoaderSVG /> : <LoaderSVG />;
};
