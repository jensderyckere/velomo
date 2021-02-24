import React from 'react';

// Images
import Logo from '../../assets/logos/full-logo.svg';

export const Footer = () => {
  return (
    <footer className="footer d-flex justify-content-center justify-content-md-start">
      <img src={Logo} alt="logo" />
    </footer>
  );
};
