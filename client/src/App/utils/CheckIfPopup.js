import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { XPAdded } from '../partials';

// Services
import { useApi, useAuth } from '../services';

export const CheckIfPopup = ({ children }) => {
  // Fetch when routing
  const location = useLocation();

  // States
  const [ popups, setPopups ] = useState(null);
  const [ viewedIndex, setViewedIndex ] = useState(0);

  // Services
  const { currentUser } = useAuth();
  const { viewPopups } = useApi();

  // Fetch popups
  const fetchPopups = useCallback(async () => {
    const fetchedPopups = await viewPopups(currentUser);
    setPopups(fetchedPopups);
  }, [currentUser, viewPopups]);

  const nextPopup = async (index) => {
    if (viewedIndex === popups.length) {
      setPopups(false);
    } else {
      setViewedIndex(index+1);
    };
  };

  useEffect(() => {
    fetchPopups();
  }, [location, fetchPopups]);

  return popups ? popups[viewedIndex] ? (
    <>
      <XPAdded 
        addedXp={popups[viewedIndex].addedXp}
        text={popups[viewedIndex].text}
        currentXp={popups[viewedIndex].currentXp}
        previousXp={popups[viewedIndex].previousXp}
        action={() => nextPopup(viewedIndex)}
      />
      {children}
    </>
  ) : children : children;
};
