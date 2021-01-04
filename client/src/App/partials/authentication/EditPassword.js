import React from 'react';

import { Inputfield, Submit } from '../../components';
import { AuthLayout, QuoteLayout } from '../authentication';

export const EditPassword = ({quote}) => {
  return (
    <div className="auth">
      <AuthLayout 
        context={{
          "title": "Wachtwoord aanpassen.",
          "text": "Tijd om je wachtwoord aan te passen. Kies hier voor een nieuw, uniek en sterk wachtwoord!",
        }}
      >
        <form onSubmit={(e) => console.log(e)}>
          <Inputfield 
            name="password"
            id="password"
            size="large"
            label="Wachtwoord"
            type="password"
          />
          <Submit 
            text="Bevestigen"
          />
        </form>
      </AuthLayout>
      <QuoteLayout quote={quote} />
    </div>
  );
};
