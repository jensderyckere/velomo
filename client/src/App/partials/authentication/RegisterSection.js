import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import { Inputfield, Submit, Checkbox } from '../../components';
import { AuthLayout, QuoteLayout, AuthError } from '../authentication';

import * as Routes from '../../routes';
import { useAuth, useStyling } from '../../services';

export const RegisterSection = ({quote}) => {
  const { screenSize } = useStyling();
  const { signUpControl } = useAuth();
  const history = useHistory();

  const [ form, setForm ] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    'repeat-password': '',
    terms: '',
  });

  const [ error, setError ] = useState({
    visible: false,
    message: '',
  });

  const handleFirstCheck = async (e) => {
    e.preventDefault();

    const result = await signUpControl(form.email, form.password, form['repeat-password']);
    
    if (result.status === 409) { 
      setError({
        visible: true,
        message: result.message,
      });

      return;
    };

    if (!form.terms) { 
      setError({
        visible: true,
        message: 'Je kan enkel maar een account aanmaken wanneer je akkoord gaat met de algemene voorwaarden',
      });

      return;
    };

    if (result.redirect) {
      history.push(Routes.SIGNUP_ROLE, {
        credentials: form,
      });
    };
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheck = (value) => {
    setForm({
      ...form,
      terms: value,
    });
  };

  return (
    <div className="auth">
      <AuthLayout 
        context={{
          "title": "Registreren.",
          "text": "Leuk dat je erbij komt. Registreer je snel en geniet van alle voordelen.",
        }}
      >
        <form onSubmit={(e) => handleFirstCheck(e)}>
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <Inputfield 
              name="firstname"
              id="firstname"
              size={screenSize === 'md' || screenSize === 'lg' || screenSize === 'xl' ? "large" : "small"}
              placeholder="Eddy"
              label="Voornaam"
              type="text"
              changeInput={(e) => handleChange(e)}
            />
            <Inputfield 
              name="lastname"
              id="lastname"
              size={screenSize === 'md' || screenSize === 'lg' || screenSize === 'xl' ? "large" : "small"}                
              placeholder="Merckx"
              label="Achternaam"
              type="text"
              changeInput={(e) => handleChange(e)}
            />
          </div>
          <Inputfield 
            name="email"
            id="email"
            size="large"
            placeholder="eddy@kannibaal.be"
            label="E-mail"
            type="email"
            changeInput={(e) => handleChange(e)}
          />
          <Inputfield 
            name="password"
            id="password"
            size="large"
            placeholder="Kies een sterk wachtwoord"
            label="Wachtwoord"
            type="password"
            changeInput={(e) => handleChange(e)}
          />
          <Inputfield 
            name="repeat-password"
            id="repeat-password"
            size="large"
            placeholder="Vul hier het wachtwoord in"
            label="Herhaal wachtwoord"
            type="password"
            changeInput={(e) => handleChange(e)}
          />
          <Checkbox 
            name="terms"
            defaultValue={false}
            id="terms"
            changeInput={handleCheck}
          >
            <p>Ik ga akkoord met de <NavLink to={Routes.TERMS_CONDITIONS}>algemene voorwaarden</NavLink></p>
          </Checkbox>
          <Submit 
            text="Registreren"
          />
          {
            error.visible && (
              <AuthError message={error.message} />
            )
          }
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
