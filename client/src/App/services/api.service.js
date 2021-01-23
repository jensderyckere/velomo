import React, { createContext, useContext } from 'react';

// Config
import * as Config from '../config';

const ApiContext = createContext();
const useApi = () => useContext(ApiContext);

const ApiProvider = ({children}) => {
  const uploadPicture = async (token, file) => {
    const url = `${Config.clientConfig.apiUrl}picture/upload`;

    const form = new FormData();
    form.append('picture', file);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: form,
    });

    return await res.json();
  };

  return (
    <ApiContext.Provider value={{
      uploadPicture,
    }}>
      {children}
    </ApiContext.Provider>
  )
};

export {
  ApiContext,
  ApiProvider,
  useApi,
};
