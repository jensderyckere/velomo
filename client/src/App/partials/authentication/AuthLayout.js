import React from 'react';

import { useStyling } from '../../services';

import Logo from '../../assets/logos/logo.svg';

export const AuthLayout = ({context, children}) => {
  const { screenSize } = useStyling();

  return (
    <section className={`container auth__form ${screenSize}-auth`}>
      <div className="auth__form__top">
        <img src={Logo} alt="logo" className="auth__form__top--logo" id="auth-logo" />
        <h1 className="auth__form__top--title standard-title">
          {context.title}
        </h1>
        {
          context.text && (
            <p className="auth__form__top--text standard-text">
              {context.text}
            </p>
          )
        }
        {
          context.html && (
            context.html
          )
        }
      </div>
      <div className="auth__form__content">
        {children}
      </div>
    </section>
  );
};