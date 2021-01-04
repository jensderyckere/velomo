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

    return await res.json(res);
  };

  const signUp = async (firstName, lastName, email, password, role) => {
    const url = `${Config.clientConfig.apiUrl}register`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        role: role,
      }),
    });

    return await res.json(res);
  };

  const [ currentUser, setCurrentUser ] = useState(verifyUser);

  return (
    <AuthContext.Provider value={{
      currentUser,
      setCurrentUser,
      verifyUser,
      signIn,
      signUp,
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
