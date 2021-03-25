import React from 'react';

// Components
import { StandardButton } from '../../components';

export const SettingsConnections = ({ user }) => {
  const ConnectStrava = () => {
    window.location.href = 'https://www.strava.com/oauth/authorize?client_id=63289&response_type=code&redirect_uri=http://localhost:3000/exchange_token&approval_prompt=force&scope=read,activity:read_all';
  };

  return (
    <>
      <h1 className="secundary-font title-size bold-font">
        Verbindingen
      </h1>
      <div className="margin-top-30">
        <span className="tertiary-font light-font text-size">Om een connectie te maken met anderen, kan je jouw persoonlijke code delen:</span>
        <h3 className="margin-top-20 orange-color giant-title-size bold-font secundary-font">
          {user.profile.uniqueCode}
        </h3>
      </div>
      <div className="margin-top-30">
        <h1 className="secundary-font title-size bold-font margin-bottom-30">
          Activiteiten importeren
        </h1>
        <StandardButton text="Verbind strava" action={ConnectStrava} />
      </div>
    </>
  );
};