import React from 'react';
import { useParams } from 'react-router-dom';

// Partials
import { SettingsProfile, SettingsUser, SettingsPassword, SettingsConnections } from '.';

export const SettingsWrapper = ({ user }) => {
  const { setting } = useParams();

  return (
    <div className="settings-wrapper">
      {
        setting === 'profile' && (
          <SettingsProfile user={user} />
        )
      }
      {
        setting === 'user' && (
          <SettingsUser user={user} />
        )
      }
      {
        setting === 'password' && (
          <SettingsPassword user={user} />
        )
      }
      {
        setting === 'connections' && (
          <SettingsConnections user={user} />
        )
      }
    </div>
  );
};
