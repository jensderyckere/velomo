import React, {
  createContext,
  useContext
} from 'react';

// Config
import * as Config from '../config';

const ApiContext = createContext();
const useApi = () => useContext(ApiContext);

const ApiProvider = ({
  children
}) => {
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
    const url = `${Config.clientConfig.apiUrl}upload-activity`;

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
        'Authorization': `Bearer ${token}`,
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
        'Authorization': `Bearer ${token}`,
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

  const ifEvent = async (token, id) => {
    const url = `${Config.clientConfig.apiUrl}if-event/${id}`;

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

  const importStravaActivities = async (token, content) => {
    const url = `${Config.clientConfig.apiUrl}strava-activities`;

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

  const getRandomChallenge = async (token) => {
    const url = `${Config.clientConfig.apiUrl}random-challenge`;

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

  const approveSubmission = async (token, challengeId, userId) => {
    const url = `${Config.clientConfig.apiUrl}approve-submission/${challengeId}/${userId}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    return await res.json();
  };

  const viewMonthlyCharts = async (token, challengeId) => {
    const url = `${Config.clientConfig.apiUrl}participation-monthly-charts/${challengeId}`;

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

  const viewPopups = async (token) => {
    const url = `${Config.clientConfig.apiUrl}popups`;

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

  const viewedPopup = async (token, id) => {
    const url = `${Config.clientConfig.apiUrl}popups/viewed/${id}`;

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

  const getNotifications = async (token) => {
    const url = `${Config.clientConfig.apiUrl}notifications`;

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

  const viewNotification = async (token, id) => {
    const url = `${Config.clientConfig.apiUrl}notifications/${id}`;

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

  const createGoal = async (token, content) => {
    const url = `${Config.clientConfig.apiUrl}goals`;

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

  const editGoal = async (token, id, content) => {
    const url = `${Config.clientConfig.apiUrl}goals/${id}`;

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

  const getGoal = async (token, id) => {
    const url = `${Config.clientConfig.apiUrl}goals/${id}`;

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

  const getUserGoals = async (token, id) => {
    const url = `${Config.clientConfig.apiUrl}user-goals/${id}`;

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

  const getCreatorGoals = async (token, id) => {
    const url = `${Config.clientConfig.apiUrl}creator-goals/${id}`;

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

  const deleteGoal = async (token, id) => {
    const url = `${Config.clientConfig.apiUrl}goals/${id}`;

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

  const showGoalsStats = async (token, userId, goalId) => {
    const url = `${Config.clientConfig.apiUrl}goals-progress/${userId}/${goalId}`;

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

  const getEvents = async (token) => {
    const url = `${Config.clientConfig.apiUrl}events`;

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

  const getEvent = async (token, id) => {
    const url = `${Config.clientConfig.apiUrl}event/${id}`;

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

  const getParticipatedEvents = async (token) => {
    const url = `${Config.clientConfig.apiUrl}participated-events`;

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

  const createEvent = async (token, content) => {
    const url = `${Config.clientConfig.apiUrl}event`;

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

  const editEvent = async (token, id, content) => {
    const url = `${Config.clientConfig.apiUrl}event/${id}`;

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

  const deleteEvent = async (token, id) => {
    const url = `${Config.clientConfig.apiUrl}event/${id}`;

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

  const participateEvent = async (token, id) => {
    const url = `${Config.clientConfig.apiUrl}participate-event/${id}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    return await res.json();
  };

  const withdrawEvent = async (token, id) => {
    const url = `${Config.clientConfig.apiUrl}withdraw-event/${id}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    return await res.json();
  };

  const approvePresence = async (token, eventId, userId) => {
    const url = `${Config.clientConfig.apiUrl}approve-presence/${eventId}/${userId}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    return await res.json();
  };

  const getComments = async (token, id) => {
    const url = `${Config.clientConfig.apiUrl}comments/${id}`;

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

  const createComment = async (token, id, content) => {
    const url = `${Config.clientConfig.apiUrl}comments/${id}`;

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

  const editComment = async (token, id, content) => {
    const url = `${Config.clientConfig.apiUrl}comments/${id}`;

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

  const deleteComment = async (token, id) => {
    const url = `${Config.clientConfig.apiUrl}comments/${id}`;

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

  return ( <ApiContext.Provider value = {
      {
        uploadPicture,
        getVideo,
        getActivity,
        deleteActivity,
        uploadActivity,
        createActivity,
        editActivity,
        importStravaActivities,
        getClubChallenges,
        getChallenge,
        getParticipation,
        participateChallenge,
        withdrawChallenge,
        getMyChallenges,
        getRandomChallenge,
        createChallenge,
        editChallenge,
        deleteChallenge,
        submitSubmission,
        approveSubmission,
        viewMonthlyCharts,
        viewPopups,
        viewedPopup,
        getNotifications,
        viewNotification,
        createGoal,
        getGoal,
        editGoal,
        deleteGoal,
        getUserGoals,
        getCreatorGoals,
        showGoalsStats,
        getEvents,
        getEvent,
        getParticipatedEvents,
        createEvent,
        participateEvent,
        withdrawEvent,
        ifEvent,
        editEvent,
        deleteEvent,
        approvePresence,
        getComments,
        createComment,
        editComment,
        deleteComment,
      }
    }> {
      children
    } </ApiContext.Provider>
  );
};

export {
  ApiContext,
  ApiProvider,
  useApi,
};