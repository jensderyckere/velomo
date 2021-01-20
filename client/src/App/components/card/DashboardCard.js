import React from 'react';

// Components
import { ConnectCard } from '.';

export const DashboardCard = ({ user }) => {
  return (
    <section className="grey-card dashboard-card">
      {
        user.role === 'cyclist' ? user.cyclist._clubId ? (
          ''
        ) : (
          <ConnectCard 
            user={user}
            title="Oh, zit je reeds in een club? Verbind je hier met hen."
            text="Vul in onderstaand veld jouw ploeg hun unieke code in."
          />
        ) : ''
      }
      {
        user.role === 'member' ? user.member._clubId ? (
          ''
        ) : (
          <ConnectCard 
            user={user}
            title="Oh, zit je reeds in een club? Verbind je hier met hen."
            text="Vul in onderstaand veld jouw ploeg hun unieke code in."
          />
        ) : ''
      }
      {
        user.role === 'parent' ? user.parent._cyclistIds ? (
          ''
        ) : (
          <ConnectCard 
            user={user}
            title="Start met het toevoegen van jouw renners."
            text="Vul in onderstaand veld jouw renner zijn unieke code in."
          />
        ) : ''
      }
      {
        user.role === 'club' ? user.club.name ? (
          ''
        ) : (
          ''
        ) : ''
      }
    </section>
  );
};
