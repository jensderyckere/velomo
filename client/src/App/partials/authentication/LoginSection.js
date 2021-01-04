import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import { Inputfield, Submit } from '../../components';
import { AuthLayout, QuoteLayout, AuthError } from '../authentication';

import * as Routes from '../../routes';
import { useAuth } from '../../services';

export const LoginSection = ({quote}) => {
  const { signIn } = useAuth();
  const history = useHistory();

  const [ form, setForm ] = useState({
    email: '',
    password: '',
  });

  const [ error, setError ] = useState({
    visible: false,
    message: '',
  });

  const handleSignIn = async (e) => {
    e.preventDefault();
    const result = await signIn(form.email, form.password);

    if (!result.redirect) {
      setError({
        visible: true,
        message: result.message,
      });
      return;
    };

    history.push(Routes.DASHBOARD);
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
          "title": "Aanmelden.",
          "text": "Oh, hey daar! Ga snel verder om door te gaan waar je gebleven bent.",
        }}
      >
        <form onSubmit={(e) => handleSignIn(e)}>
          <Inputfield 
            name="email"
            id="email"
            size="large"
            placeholder="jij@email.be"
            label="E-mail"
            type="email"
            changeInput={(e) => handleChange(e)}
          />
          <Inputfield 
            name="password"
            id="password"
            size="large"
            placeholder="Jouw geheim wachtwoord"
            label="Wachtwoord"
            type="password"
            changeInput={(e) => handleChange(e)}
          />
          <Submit 
            text="Aanmelden"
          />
          {
            error.visible && (
              <AuthError message={error.message} />
            )
          }
          <NavLink className="auth__form__content--under-button-ref" to={Routes.RESET_PASSWORD}>
            Wachtwoord vergeten
          </NavLink>
          <div className="auth__form__content--switch">
            <span className="auth__form__content--switch--page">
              Nog geen account?<br/>
              <NavLink to={Routes.SIGNUP}>
                Registreer hier
              </NavLink>
            </span>
          </div>
        </form>
      </AuthLayout>
      <QuoteLayout quote={quote} />
    </div>
  );
};
