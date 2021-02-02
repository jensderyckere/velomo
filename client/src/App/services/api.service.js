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

  const getActivity = async (token, id) => {
    const url = `${Config.clientConfig.apiUrl}activity/${id}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`      
      },
    });

    return await res.json();
  };

  const deleteActivity = async (token, id) => {
    const url = `${Config.clientConfig.apiUrl}activity/${id}`;

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`      
      },
    });

    return await res.json();
  };

  const uploadActivity = async (token, content) => {
    const url = `${Config.clientConfig.apiUrl}activity`;

    const formData = new FormData();
    formData.append('title', content.title);
    formData.append('description', content.description);
    formData.append('type', content.type);
    formData.append('gpxFile', content.gpxFile);

    if (content.images) formData.append('images', content.images);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`      
      },
      body: formData,
    });

    return await res.json();
  };

  const createActivity = async (token, content) => {
    const url = `${Config.clientConfig.apiUrl}manuel-activity`;

    const formData = new FormData();
    formData.append('title', content.title);
    formData.append('description', content.description);
    formData.append('type', content.type);
    formData.append('object', content.object);

    if (content.images) formData.append('images', content.images);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`      
      },
      body: formData,
    });

    return await res.json();
  };

  return (
    <ApiContext.Provider value={{
      uploadPicture,
      getActivity,
      deleteActivity,
      uploadActivity,
      createActivity,
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
