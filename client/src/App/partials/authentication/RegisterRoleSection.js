import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { Radio, Submit } from '../../components';
import { AuthLayout, QuoteLayout } from '../authentication';

import * as Routes from '../../routes';
import { useAuth } from '../../services';

export const RegisterRoleSection = ({quote}) => {
  const { state } = useLocation();
  const credentials = state.credentials;
  const history = useHistory();
  const { signUp } = useAuth();

  const [ checked, setChecked ] = useState();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let role;

    if (checked === 0) role = 'club';
    if (checked === 1) role = 'clubmember';
    if (checked === 2) role = 'cyclist';
    if (checked === 3) role = 'parent';

    const result = await signUp(credentials.firstname, credentials.lastname, credentials.email, credentials.password, role);
    
    if (result.redirect) {
      history.push(Routes.DASHBOARD);
    } else {
      history.push(Routes.ERROR);
    };
  };


  return (
    <div className="auth">
      <AuthLayout 
        context={{
          "title": "Wie ben je?",
          "text": "We zouden even willen weten welke rol jij vervult binnen de wielerwereld.",
        }}
      >
        <form onSubmit={(e) => handleSignUp(e)}>
          <div className="auth__radio">
            <Radio name="role" checked={checked === 0 ? true : false} setIndex={setChecked} index={0} id="club">
              <p>Ik ben een club</p>
            </Radio>
            <Radio name="role" checked={checked === 1 ? true : false} setIndex={setChecked} index={1} id="clubmember">
              <p>Ik ben een stafverantwoordelijke binnen een club</p>
            </Radio>
            <Radio name="role" checked={checked === 2 ? true : false} setIndex={setChecked} index={2} id="cyclist">
              <p>Ik ben een renner</p>
            </Radio>
            <Radio name="role" checked={checked === 3 ? true : false} setIndex={setChecked} index={3} id="parent">
              <p>Ik ben een ouder van een renner</p>
            </Radio>
          </div>
          <Submit 
            text="Registreren"
          />
        </form>
      </AuthLayout>
      <QuoteLayout quote={quote} />
    </div>
  );
};
