import React from 'react';

// Images
import Logo from '../../assets/logos/full-logo.svg';
import ArteveldeLogo from '../../assets/logos/artevelde.png';

export const Footer = () => {
  return (
    <footer className="footer d-flex justify-content-between">
      <img src={Logo} alt="logo" />
      <img className="artevelde-logo" src={ArteveldeLogo} alt="artevelde" />
    </footer>
  );
};
