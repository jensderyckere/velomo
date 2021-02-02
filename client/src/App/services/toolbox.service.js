import React, { createContext } from 'react';

const ToolboxContext = createContext();
const useToolbox = () => useToolbox(ToolboxContext);

const ToolboxProvider = ({children}) => {
  const calculateAverageSpeed = (hours, minutes, seconds, distanceInKm) => {
    let totalTime = (hours * 3600) + (minutes * 60) + seconds;
    let distanceInM = distanceInKm / 1000;
    let speedInM = distanceInM / totalTime;
    let speedInKm = speedInM * 1000;

    return speedInKm;
  };

  return <ToolboxContext.Provider value={{
    calculateAverageSpeed,
  }}>
    {children}
  </ToolboxContext.Provider>
};

export {
  ToolboxContext,
  ToolboxProvider,
  useToolbox,
};
