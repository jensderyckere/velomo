import React from 'react';
import { NavLink } from 'react-router-dom';

import { Submit } from '../../components';
import { AuthLayout, QuoteLayout } from '../authentication';

import * as Routes from '../../routes';

export const SuccessPassword = ({quote}) => {
  return (
    <div className="auth">
      <AuthLayout 
        context={{
          "title": "Geslaagde aanpassing.",
          "html": <p className="auth__form__top--text standard-text">Ziezo, je kan weer verder. Ga terug naar de <NavLink to={Routes.SIGNIN}>inlogpagina</NavLink> om toegang te krijgen tot je account.</p>
        }}
      >
        <form onSubmit={(e) => console.log(e)}>
          <Submit 
            text="Keer terug"
          />
        </form>
      </AuthLayout>
      <QuoteLayout quote={quote} />
    </div>
  )
};
