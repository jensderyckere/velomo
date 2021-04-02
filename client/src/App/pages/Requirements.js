import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

// Services
import { useApi, useAuth } from '../services';

// Routes
import * as Routes from '../routes';

// Components
import { CheckSVG, LoaderSVG } from '../components';

export const Requirements = () => {
  // Routing
  const history = useHistory();

  // States
  const [ requirements, setRequirements ] = useState();
  const [ user, setUser ] = useState();

  // Services
  const { getCurrentUser, currentUser } = useAuth();
  const { getRequirementStats } = useApi();

  // Fetch data
  const fetchData = useCallback(async () => {
    const userData = await getCurrentUser(currentUser);
    setUser(userData);

    if (userData.role === "cyclist") {
      const requirementData = await getRequirementStats(currentUser);
      setRequirements(requirementData);
      console.log(requirementData)
    } else {
      history.push(Routes.ERROR);
    };
  }, [getCurrentUser, currentUser, getRequirementStats, history]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return user ? requirements ? (
    <div className="container">
      <section className="w-100">
        <div className="row">
          <div className="col-12 col-lg-6">
          <h5 className="secundary-font title-size bold-font">Alle verplichtingen om punten te behalen</h5>
          <div className="requirements">
            {
              requirements.length !== 0 ? requirements.map((requirement, index) => {
                return (
                  <div key={index} className="requirements__item d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="secundary-font bold-font text-size">
                        {requirement.requirement.title}
                      </h6>
                      <p className="tertiary-font light-font text-size">
                        {requirement.requirement.description}
                      </p>
                    </div>
                    {
                      requirement.success && (
                        <div className="requirements__item--check">
                          <CheckSVG />
                        </div>
                      )
                    }
                  </div>
                )
              }) : (
                <span className="text-size tertiary-font light-font">
                  Er zijn nog geen verplichtingen aangemaakt.
                </span>
              )
            }
          </div>
          </div>
        </div>
      </section>
    </div>
  ) : <LoaderSVG /> : <LoaderSVG />;
};
