import React from 'react';

export const SettingsConnections = ({ user }) => {
  console.log(user);
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
    </>
  );
};