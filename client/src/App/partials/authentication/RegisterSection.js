import React from 'react';
import { NavLink } from 'react-router-dom';

import { Inputfield, Submit, Checkbox } from '../../components';
import { AuthLayout, QuoteLayout } from '../authentication';

import * as Routes from '../../routes';
import { useStyling } from '../../services';

export const RegisterSection = ({quote}) => {
  const { screenSize } = useStyling();

  return (
    <div className="auth">
      <AuthLayout 
        context={{
          "title": "Registreren.",
          "text": "Leuk dat je erbij komt. Registreer je snel en geniet van alle voordelen.",
        }}
      >
        <form onSubmit={(e) => console.log(e)}>
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <Inputfield 
              name="firstname"
              id="firstname"
              size={screenSize === 'md' || screenSize === 'lg' || screenSize === 'xl' ? "large" : "small"}
              placeholder="Eddy"
              label="Voornaam"
              type="text"
            />
            <Inputfield 
              name="lastname"
              id="lastname"
              size={screenSize === 'md' || screenSize === 'lg' || screenSize === 'xl' ? "large" : "small"}                
              placeholder="Merckx"
              label="Achternaam"
              type="text"
            />
          </div>
          <Inputfield 
            name="email"
            id="email"
            size="large"
            placeholder="eddy@kannibaal.be"
            label="E-mail"
            type="email"
          />
          <Inputfield 
            name="password"
            id="password"
            size="large"
            placeholder="Kies een sterk wachtwoord"
            label="Wachtwoord"
            type="password"
          />
          <Inputfield 
            name="repeat-password"
            id="repeat-password"
            size="large"
            placeholder="Vul hier het wachtwoord in"
            label="Herhaal wachtwoord"
            type="password"
          />
          <Checkbox 
            name="terms"
            defaultValue={false}
            id="terms"
          >
            <p>Ik ga akkoord met de <NavLink to={Routes.TERMS_CONDITIONS}>algemene voorwaarden</NavLink></p>
          </Checkbox>
          <Submit 
            text="Registreren"
          />
          <div className="auth__form__content--switch">
            <span className="auth__form__content--switch--page">
              Al een account?<br/>
              <NavLink to={Routes.SIGNIN}>
                Meld je hier aan
              </NavLink>
            </span>
          </div>
        </form>
      </AuthLayout>
      <QuoteLayout quote={quote} />
    </div>
  );
};
