import React, { createContext, useContext, useState } from 'react';
import Cookies from 'js-cookie';
import * as jwt from 'jsonwebtoken';

// Import config
import * as Config from '../config';

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({children}) => {
  const verifyUser = () => {
    const token = Cookies.get('token');
    
    if (token) {
      try {
        const decoded = jwt.verify(token, 'velomo-secret');

        if (!decoded) throw new Error('Decoding failed');
        if (decoded.exp > Date.now()) throw new Error('Token expired');

        return token;
      } catch (e) {
        return null;
      };
    };

    return null;
  };

  const signIn = async (email, password) => {
    const url = `${Config.clientConfig.apiUrl}login`;
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const result = await res.json();
    Cookies.set('token', result.token);

    return result;
  };

  const signUp = async (firstname, lastname, email, password, role) => {
    const url = `${Config.clientConfig.apiUrl}register`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstname,
        lastName: lastname,
        email: email,
        password: password,
        role: role,
      }),
    });

    const result = await res.json();
    Cookies.set('token', result.token);

    return result;
  };

  const signUpControl = async (email, password, passwordRepeat) => {
    const url = `${Config.clientConfig.apiUrl}register/first-check`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        passwordRepeat: passwordRepeat,
      }),
    });

    return await res.json();
  };

  const submitReset = async (email) => {
    const url = `${Config.clientConfig.apiUrl}reset`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    return await res.json();
  };

  const resetPassword = async (token, password) => {
    const url = `${Config.clientConfig.apiUrl}reset/submit`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: password,
        token: token,
      }),
    });

    return await res.json();
  };

  const getCurrentUser = async (token) => {
    const url = `${Config.clientConfig.apiUrl}current-user`;

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

  const getCurrentCharts = async (token, id) => {
    const url = `${Config.clientConfig.apiUrl}users-charts/${id}`;

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

  const getUser = async (token, id) => {
    const url = `${Config.clientConfig.apiUrl}users/${id}`;

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

  const getUserViaId = async (token, id, type) => {
    const url = `${Config.clientConfig.apiUrl}user-via-id/${id}/${type}`;

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

  const getMultipleUsers = async (token, ids) => {
    let array = [];

    for (const id of ids) {
      const url = `${Config.clientConfig.apiUrl}users/${id}`;

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
  
      array.push(await res.json())
    };

    return array;
  };

  const createConnection = async (token, senderId, code) => {
    const url = `${Config.clientConfig.apiUrl}users/connections`;

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        id: senderId,
        code: code,
      }),
    });

    return await res.json();
  };

  const undoConnection = async (token, senderId, receiverId) => {
    const url = `${Config.clientConfig.apiUrl}users/disconnect`;

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        senderId: senderId,
        receiverId: receiverId,
      }),
    });

    return await res.json();
  };

  const editProfile = async (token, context) => {
    const url = `${Config.clientConfig.apiUrl}users/profile`;

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(context),
    });

    return await res.json();
  };

  const editUser = async (token, context) => {
    const url = `${Config.clientConfig.apiUrl}users/settings`;

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(context),
    });

    return await res.json();
  };

  const editPassword = async (token, context) => {
    const url = `${Config.clientConfig.apiUrl}users/password`;

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(context),
    });

    return await res.json();
  };

  const [ currentUser, setCurrentUser ] = useState(verifyUser);

  const logOut = () => {
    Cookies.remove('token', null);
    return true;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      setCurrentUser,
      getCurrentUser,
      getCurrentCharts,
      getUser,
      getUserViaId,
      getMultipleUsers,
      createConnection,
      undoConnection,
      editProfile,
      editUser,
      editPassword,
      verifyUser,
      signIn,
      signUp,
      signUpControl,
      logOut,
      submitReset,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export {
  AuthContext,
  AuthProvider,
  useAuth,
};
