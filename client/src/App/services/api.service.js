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

  const getVideo = async (video) => {
    const url = `${Config.clientConfig.apiUrl}video/${video}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const blob = await res.blob();
    const src = window.URL.createObjectURL(blob);

    return src;
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
    formData.append('feeling', content.feeling);
    formData.append('experience', content.experience);

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
    const url = `${Config.clientConfig.apiUrl}manual-activity`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,      
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });

    return await res.json();
  };

  const editActivity = async (token, id, content) => {
    const url = `${Config.clientConfig.apiUrl}activity/${id}`;

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`      
      },
      body: JSON.stringify(content),
    });

    return await res.json();
  };

  const createChallenge = async (token, content) => {
    const url = `${Config.clientConfig.apiUrl}challenge`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`      
      },
      body: JSON.stringify(content),
    });

    return await res.json();
  };

  const getChallenge = async (token, id) => {
    const url = `${Config.clientConfig.apiUrl}challenge/${id}`;

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

  const getParticipation = async (token, id) => {
    const url = `${Config.clientConfig.apiUrl}participation/${id}`;

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

  const participateChallenge = async (token, content) => {
    const url = `${Config.clientConfig.apiUrl}participate-challenge`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`      
      },
      body: JSON.stringify(content),
    });

    return await res.json();
  };

  const withdrawChallenge = async (token, content) => {
    const url = `${Config.clientConfig.apiUrl}withdraw-challenge`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`      
      },
      body: JSON.stringify(content),
    });

    return await res.json();
  };

  const getClubChallenges = async (token, id) => {
    const url = `${Config.clientConfig.apiUrl}club-challenges/${id}`;

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

  const getMyChallenges = async (token) => {
    const url = `${Config.clientConfig.apiUrl}my-challenges`;

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

  const editChallenge = async (token, id, content) => {
    const url = `${Config.clientConfig.apiUrl}challenge/${id}`;

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`      
      },
      body: JSON.stringify(content),
    });

    return await res.json();
  };

  const deleteChallenge = async (token, id) => {
    const url = `${Config.clientConfig.apiUrl}challenge/${id}`;

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

  const submitSubmission = async (token, id, content) => {
    const url = `${Config.clientConfig.apiUrl}submit-submission/${id}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`      
      },
      body: JSON.stringify(content),
    });

    return await res.json();
  };

  return (
    <ApiContext.Provider value={{
      uploadPicture,
      getVideo,
      getActivity,
      deleteActivity,
      uploadActivity,
      createActivity,
      editActivity,
      getClubChallenges,
      getChallenge,
      getParticipation,
      participateChallenge,
      withdrawChallenge,
      getMyChallenges,
      createChallenge,
      editChallenge,
      deleteChallenge,
      submitSubmission,
    }}>
      {children}
    </ApiContext.Provider>
  );
};

export {
  ApiContext,
  ApiProvider,
  useApi,
};
