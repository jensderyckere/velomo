import React from 'react';

// Services
import { useStyling } from '../../services';

// Partials
import { DesktopHeader, MobileHeader } from '.';

export const Header = ({ user }) => {
  const { screenSize } = useStyling();

  return (
    <header className={`header ${screenSize === 'xl' || screenSize === 'lg' ? 'd-header' : 'mobile-header'}`}>
      {
        screenSize === 'xl' || screenSize === 'lg' ? (
          <DesktopHeader user={user} />
        ) : (
          <MobileHeader user={user} />
        )
      }
    </header>
  );
};
