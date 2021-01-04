import React from 'react';
import { NavLink } from 'react-router-dom';

import { Inputfield, Submit } from '../../components';
import { AuthLayout, QuoteLayout } from '../authentication';

import * as Routes from '../../routes';

export const LoginSection = ({quote}) => {
  return (
    <div className="auth">
      <AuthLayout 
        context={{
          "title": "Aanmelden.",
          "text": "Oh, hey daar! Ga snel verder om door te gaan waar je gebleven bent.",
        }}
      >
        <form onSubmit={(e) => console.log(e)}>
          <Inputfield 
            name="email"
            id="email"
            size="large"
            placeholder="jij@email.be"
            label="E-mail"
            type="email"
          />
          <Inputfield 
            name="password"
            id="password"
            size="large"
            placeholder="Jouw geheim wachtwoord"
            label="Wachtwoord"
            type="password"
          />
          <Submit 
            text="Aanmelden"
          />
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
