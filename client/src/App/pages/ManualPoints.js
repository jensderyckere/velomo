import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

// Components
import { GreyButton, Inputfield, LoaderSVG, Message, SelectUser, StandardButton } from '../components';

// Services
import { useApi, useAuth } from '../services';

// Routes
import * as Routes from '../routes';

export const ManualPoints = () => {
  // Routing
  const history = useHistory();

  // States
  const [ user, setUser ] = useState();
  const [ selectedUser, setSelectedUser ] = useState();
  const [ amount, setAmount ] = useState(0);
  const [ error, setError ] = useState({
    visible: true,
    text: '',
  });

  // Services
  const { currentUser, getCurrentUser } = useAuth();
  const { handleManualPoints } = useApi();

  // Fetch all data
  const fetchData = useCallback(async () => {
    const userData = await getCurrentUser(currentUser);

    if (userData.role === 'club') {
      setUser(userData);
    } else if (userData.role === 'clubmember') {
      setUser(userData);
    } else {
      history.push(Routes.ERROR);
    };
  }, [getCurrentUser, currentUser, history]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const givePoints = async () => {
    if (!selectedUser) {
      setError({
        visible: true,
        text: "Er is geen gebruiker geselecteerd.",
      });

      return;
    };

    if (amount === 0 || amount > 3) {
      setError({
        visible: true,
        text: "Dit is geen geldige invoer van punten. Maximaal 3 punten per week.",
      });

      return;
    };

    const result = await handleManualPoints(currentUser, {
      userId: selectedUser._userId._id,
      points: amount,
    });

    if (result.status && result.status === 400) {
      setError({
        visible: true,
        text: "Maximaal 3 punten per week. Probeer binnen een paar dagen opnieuw.",
      });

      return;
    };

    history.push(Routes.POINTS_SYSTEM);
  };

  return user ? (
    <div className="container">
      <section className="w-100">
        <div className="row">
          <div className="col-12 col-lg-6">
            <h3 className="secundary-font title-size bold-font">
              Manueel punten toevoegen
            </h3>
            <div className="manual-points margin-top-30">
              <SelectUser 
                users={user.club._cyclistIds}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
              />
              <Inputfield 
                type="number"
                name="points"
                id="points"
                value={1}
                label="Verdiende punten"
                size="large"
                changeInput={(e) => setAmount(e.target.value)}
              />
              {
                error.visible && (
                  <Message 
                    error={true}
                    message={error.message}
                  />
                )
              }
              <div className="d-flex margin-top-30 justify-content-end align-items-center">
                <StandardButton
                  text="Punten geven"
                  extraClasses="margin-right-10"
                  action={givePoints}
                />
                <GreyButton 
                  text="Annuleer"
                  action={() => history.goBack()}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  ) : <LoaderSVG />;
};
