import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import * as Routes from '../../routes';

import { Inputfield, Submit } from '../../components';
import { AuthLayout, QuoteLayout } from '../authentication';

import { useAuth } from '../../services';
import { AuthError } from './AuthError';

export const EditPassword = ({quote}) => {
  const history = useHistory();
  const { token } = useParams();
  const { resetPassword } = useAuth();

  const [ form, setForm ] = useState({
    password: '',
  });

  const [ error, setError ] = useState({
    visible: false,
    message: '',
  });

  const handleSubmit = async (e) => {
    const result = await resetPassword(token, form.password);

    if (result.redirect === false) {
      setError({
        visible: true,
        message: result.message,
      });

      return;
    };

    history.push(Routes.SUCCES_PASSWORD);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="auth">
      <AuthLayout 
        context={{
          "title": "Wachtwoord aanpassen.",
          "text": "Tijd om je wachtwoord aan te passen. Kies hier voor een nieuw, uniek en sterk wachtwoord!",
        }}
      >
        <form onSubmit={(e) => handleSubmit(e)}>
          <Inputfield 
            name="password"
            id="password"
            size="large"
            label="Wachtwoord"
            type="password"
            changeInput={(e) => handleChange(e)}
          />
          <Submit 
            text="Bevestigen"
          />
          {
            error.visible && (
              <AuthError message={error.message} />
            )
          }
        </form>
      </AuthLayout>
      <QuoteLayout quote={quote} />
    </div>
  );
};
