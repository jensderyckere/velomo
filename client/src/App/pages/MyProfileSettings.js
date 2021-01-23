import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

// Services
import { useAuth } from '../services';

// Routes
import * as Routes from '../routes';

// Screensize
import { ScreenSizeClassSwitch } from '../utils';

// Components
import { SideSwitch, SideSwitchLink } from '../components';

// Partials
import { SettingsWrapper } from '../partials';

export const MyProfileSettings = () => {
  const history = useHistory();
  const { setting } = useParams();

  const { currentUser, getCurrentUser } = useAuth();

  const [ user, setUser ] = useState();

  const fetchUser = useCallback(async () => {
    try {
      const data = await getCurrentUser(currentUser);
      setUser(data);
    } catch (e) {
      history.push(Routes.ERROR);
    };
  }, [getCurrentUser, currentUser, history]);

  const decideSettings = useCallback(() => {
    if (setting !== "profile" && setting !== "user" && setting !== "password" && setting !== "connections") {
      history.push(Routes.ERROR);
    };
  }, [setting, history]);

  useEffect(() => {
    fetchUser();
    decideSettings();
  }, [fetchUser, decideSettings]);

  return (
    user ? (
      <>
        <div className="container d-flex">
          <section className={`left-sided ${ScreenSizeClassSwitch('w-20', 'd-none')}`}>
            <SideSwitch>
              <SideSwitchLink 
                slug="profile"
                title="Mijn profiel"
              />
              <SideSwitchLink 
                slug="user"
                title="Gebruikersinstellingen"
              />
              <SideSwitchLink 
                slug="password"
                title="Wachtwoord"
              />
              <SideSwitchLink
                slug="connections"
                title="Verbindingen"
              />
            </SideSwitch>
          </section>
          <section className={`right-sided ${ScreenSizeClassSwitch('w-80', 'w-100')}`}>
            <SettingsWrapper user={user} />
          </section>
        </div>
      </>
    ) : ''
  );
};