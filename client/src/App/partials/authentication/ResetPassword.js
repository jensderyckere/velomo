import React from 'react';
import { NavLink } from 'react-router-dom';

import { Inputfield, Submit } from '../../components';
import { AuthLayout, QuoteLayout } from '../authentication';

import * as Routes from '../../routes';

export const ResetPassword = ({quote}) => {
    return (
      <div className="auth">
        <AuthLayout 
          context={{
            "title": "Wachtwoord herstellen.",
            "text": "Oei, jouw wachtwoord vergeten? Geen probleem. Kies hier om een nieuw wachtwoord aan te vragen.",
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
            <Submit 
              text="Herstelling aanvragen"
            />
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
  )
};
