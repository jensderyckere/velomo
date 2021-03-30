import React from 'react';
import { useHistory } from 'react-router';

// Components
import { StandardButton } from '../../components';

// Routes
import * as Routes from '../../routes';

export const RewardContent = ({ reward, user }) => {
  // Routing
  const history = useHistory();

  return (
    <div className="reward-content">
      {
        reward ? (
          ''
        ) : (
          <div className="reward-content-none">
            <div>
              <h2 className="title-size bold-font secundary-font text-center">
                Er zijn nog geen verdiensten gemaakt.
              </h2>
              <p className="text-center light-font text-size tertiary-font margin-top-20">
                {user.role === "club" ? (
                  'Maak snel nieuwe verdiensten aan om jouw renners te belonen voor hun inspanningen.'
                ) : (
                  'Nog even geduld. Jouw club is druk bezig met het maken van leuke beloningen.'
                )}
              </p>
              {
                user.role == "club" && (
                  <div className="d-flex justify-content-center margin-top-20">
                    <StandardButton 
                      text="Beloning maken"
                      action={() => history.push(Routes.CREATE_REWARD)}
                    />
                  </div>
                )
              }
            </div>
          </div>
        )
      }
    </div>
  );
};
