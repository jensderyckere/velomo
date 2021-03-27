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
  const { viewPopups, viewedPopup } = useApi();

  // Fetch popups
  const fetchPopups = useCallback(async () => {
    const fetchedPopups = await viewPopups(currentUser);
    setPopups(fetchedPopups);
  }, [currentUser, viewPopups]);

  const nextPopup = async (index) => {
    if (viewedIndex === popups.length) {
      await viewedPopup(currentUser, popups[viewedIndex]._id);
      setPopups(false);
    } else {
      await viewedPopup(currentUser, popups[viewedIndex]._id);
      setViewedIndex(index+1);
    };
  };

  useEffect(() => {
    fetchPopups();
  }, [location, fetchPopups]);

  return popups ? popups[viewedIndex] ? (
    <>
      <XPAdded 
        addedXp={popups[viewedIndex].addedPt}
        text={popups[viewedIndex].text}
        currentXp={popups[viewedIndex].currentPt}
        previousXp={popups[viewedIndex].previousPt}
        action={() => nextPopup(viewedIndex)}
      />
      {children}
    </>
  ) : children : children;
};
