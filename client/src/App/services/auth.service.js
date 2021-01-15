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

  const [ currentUser, setCurrentUser ] = useState(verifyUser);

  return (
    <AuthContext.Provider value={{
      currentUser,
      setCurrentUser,
      verifyUser,
      signIn,
      signUp,
      signUpControl,
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
