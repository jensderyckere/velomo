import React, { createContext } from 'react';

// Moment.js
import Moment from 'moment';
import 'moment/locale/nl-be';

const ToolboxContext = createContext();
const useToolbox = () => useToolbox(ToolboxContext);

const ToolboxProvider = ({children}) => {
  Moment.locale('nl-be');

  const transformDate = (date) => {
    return Moment(date).format('L');
  };

  return <ToolboxContext.Provider value={{
    transformDate,
  }}>
    {children}
  </ToolboxContext.Provider>
};

export {
  ToolboxContext,
  ToolboxProvider,
  useToolbox,
};
