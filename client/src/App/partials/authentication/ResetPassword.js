import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import { Inputfield, Submit } from '../../components';
import { AuthLayout, QuoteLayout } from '../authentication';

import * as Routes from '../../routes';

import { useAuth } from '../../services';
import { AuthError } from './AuthError';

export const ResetPassword = ({quote}) => {
  const history = useHistory();
    const { submitReset } = useAuth();

    const [ form, setForm ] = useState({
      email: "",
    });

    const [ error, setError ] = useState({
      visible: false,
      message: '',
    });

    const handleSubmit = async (e) => {
      e.preventDefault();

      const result = await submitReset(form.email);

      if (result.redirect === false) {
        setError({
          visible: true,
          message: result.message,
        });
  
        return;
      };

      history.push(Routes.EDIT_PASSWORD);
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
            "title": "Wachtwoord herstellen.",
            "text": "Oei, jouw wachtwoord vergeten? Geen probleem. Kies hier om een nieuw wachtwoord aan te vragen.",
          }}
        >
          <form onSubmit={(e) => handleSubmit(e)}>
            <Inputfield 
              name="email"
              id="email"
              size="large"
              placeholder="jij@email.be"
              label="E-mail"
              type="email"
              changeInput={(e) => handleChange(e)}
            />
            <Submit 
              text="Herstelling aanvragen"
            />
            {
              error.visible && (
                <AuthError message={error.message} />
              )
            }
            <div className="auth__form__content--switch">
              <span className="auth__form__content--switch--page">
                Je wachtwoord niet resetten?<br/>
                <NavLink to={Routes.SIGNIN}>
                  Meld je dan hier aan
                </NavLink>
              </span>
            </div>
          </form>
        </AuthLayout>
        <QuoteLayout quote={quote} />
      </div>
  );
};
