import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const stylingContext = createContext();
const useStyling = () => useContext(stylingContext);

const StylingProvider = ({children}) => {
  /** Get size of screen, needed to adjust styles */
  const getScreenSize = useCallback(() => {
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let size;

    if (width < 575.98) size = 'xs';
    if (width > 575.98 && width < 767.98) size = 'sm';
    if (width > 767.98 && width < 991.98) size = 'md';
    if (width > 991.98 && width < 1199.98) size = 'lg';
    if (width > 1199.98) size = 'xl';

    // When screen is changing
    window.addEventListener('resize', () => {
      width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

      if (width < 575.98) size = 'xs';
      if (width > 575.98 && width < 767.98) size = 'sm';
      if (width > 767.98 && width < 991.98) size = 'md';
      if (width > 991.98 && width < 1199.98) size = 'lg';
      if (width > 1199.98) size = 'xl';

      setScreenSize(size);

      return size;
    });

    return size;
  }, []);

  /** Watch screensize */
  useEffect(() => {
    getScreenSize();
  }, [getScreenSize]);

  const [ screenSize, setScreenSize ] = useState(getScreenSize);

  return (
    <stylingContext.Provider value={{
      screenSize,
      setScreenSize,
    }}>
      {children}
    </stylingContext.Provider>
  )
};

export {
  stylingContext,
  StylingProvider,
  useStyling,
};
