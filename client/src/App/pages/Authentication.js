import React from 'react';
import { NavLink } from 'react-router-dom';

// Importing routes
import * as Routes from '../routes';

// Importing services
import { useStyling } from '../services';

// Importing images 
import Logo from '../assets/logos/logo.svg';

// Importing components
import { Checkbox, Inputfield, Submit } from '../components';

export const Authentication = ({auth, quote}) => {
  const { screenSize } = useStyling();

  const handleLogin = async (e) => {
    e.preventDefault();
  };

  const AuthLayout = ({context, children}) => {
    return (
      <section className={`container auth__form ${screenSize}-auth`}>
        <div className="auth__form__top">
          <img src={Logo} alt="logo" className="auth__form__top--logo" id="auth-logo" />
          <h1 className="auth__form__top--title standard-title">
            {context.title}
          </h1>
          <p className="auth__form__top--text standard-text">
            {context.text}
          </p>
        </div>
        <div className="auth__form__content">
          {children}
        </div>
      </section>
    )
  };

  const QuoteLayout = () => {
    return screenSize === 'lg' || screenSize === 'xl' ? (
      <section className={`auth__quote ${screenSize}-quote`}>
        <div className="container auth__quote__content">
          <h1 className="auth__quote__content--title">
            {quote.quote}
          </h1>
          <h2 className="auth__quote__content--author">
            - {quote.author}
          </h2>
        </div>
      </section>
    ) : ''
  };

  const LoginSection = () => {
    return (
      <div className="auth">
        <AuthLayout 
          context={{
            "title": "Aanmelden.",
            "text": "Oh, hey daar! Ga snel verder om door te gaan waar je gebleven bent.",
          }}
        >
          <form onSubmit={(e) => handleLogin(e)}>
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
        <QuoteLayout />
      </div>
    );
  };

  const RegisterSection = () => {
    return (
      <div className="auth">
        <AuthLayout 
          context={{
            "title": "Registreren.",
            "text": "Leuk dat je erbij komt. Registreer je snel en geniet van alle voordelen.",
          }}
        >
          <form onSubmit={(e) => handleLogin(e)}>
            <div className="d-flex justify-content-between align-items-center">
              <Inputfield 
                name="firstname"
                id="firstname"
                size="small"
                placeholder="Eddy"
                label="Voornaam"
                type="text"
              />
              <Inputfield 
                name="lastname"
                id="lastname"
                size="small"
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
        <QuoteLayout />
      </div>
    )
  };

  return auth === 'signin' ? (
    <LoginSection />
  ) : auth === 'signup' ? (
    <RegisterSection />
  ) : ''
};