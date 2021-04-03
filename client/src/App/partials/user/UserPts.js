import React, { useCallback, useEffect, useState } from 'react';

// Images
import Info from '../../assets/icons/info.png';
import { CheckSVG } from '../../components';

// Services
import { useAuth, useApi } from '../../services';

export const UserPts = ({ user }) => {
  // States
  const [ hoveredMore, setHoveredMore ] = useState(false);
  const [ requirements, setRequirements ] = useState();
  const [ success, setSuccess ] = useState();

  // Services
  const { currentUser } = useAuth();
  const { getRequirementStats } = useApi();

  // Fetch requirements
  const fetchData = useCallback(async () => {
    const requirementsData = await getRequirementStats(currentUser, user._id);
    setRequirements(requirementsData);

    let array = [];

    if (requirementsData) {
      for (let req of requirementsData) {
        if (req.success) {
          array.push(req);
        };
      };  
    };

    setSuccess(array);
  }, [currentUser, getRequirementStats, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="user-pts box-shadow radius-20 p-relative">
      <div className="d-flex align-items-center">
        <div className="user-pts__item">
          <h6 className="secundary-font bold-font subtitle-size">
            Aantal punten
          </h6>
          <h3 className="secundary-font bold-font orange-color">
            {user.cyclist.pts ? user.cyclist.pts : 0}
          </h3>
        </div>
        <div className="user-pts__item margin-left-30">
          <h6 className="secundary-font bold-font subtitle-size">
            Beloningen geclaimd
          </h6>
          <h3 className="secundary-font bold-font orange-color">
            {success ? success.length : 0}/{requirements ? requirements.length : 0}
          </h3>
        </div>
      </div>
      <div className="user-pts__more d-flex align-items-center" onMouseEnter={() => setHoveredMore(true)} onMouseLeave={() => setHoveredMore(false)}>
        <img src={Info} alt="info" />
        <span className="tertiary-font smallest-size light-font">
          Hoe verdien ik punten?
        </span>
      </div>
      {
        hoveredMore && (
          <div className="requirements-popup" onMouseEnter={() => setHoveredMore(true)} onMouseLeave={() => setHoveredMore(false)}>
            <h6 className="secundary-font bold-font subtitle-size">Door volgende verplichtingen te volbrengen:</h6>
            {
              requirements && requirements.length !== 0 ? requirements.map((requirement, index) => {
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
        )
      }
    </div>
  );
};
