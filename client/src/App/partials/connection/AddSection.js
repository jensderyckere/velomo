import { set } from 'js-cookie';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

// Components
import { Code, StandardButton } from '../../components';

// Routes
import * as Routes from '../../routes';

// Services
import { useAuth } from '../../services';

export const AddSection = ({ user, receiver }) => {
  // Routing
  const history = useHistory();

  // Services
  const { createConnection, currentUser } = useAuth();

  // States
  const [ error, setError ] = useState({
    visible: false,
    text: 'Deze bestaat nie',
  });

  const [ code, setCode ] = useState({
    0: '',
    1: '',
    2: '',
    3: '',
  });

  // Create a connection
  const submitConnection = async () => {
    try {
      const result = await createConnection(currentUser, user._id, `${code[0]}${code[1]}${code[2]}${code[3]}`);

      if (!result.redirect) {
        setError({
          visible: true,
          text: result.message,
        });

        return;
      };

      history.push(Routes.MY_PROFILE);
    } catch (e) {
      setError({
        visible: true,
        text: 'Er is iets verkeerd gelopen',
      });
    };
  };

  return (
    <div className="add-connect">
      <div className="add-connect__top d-flex justify-content-between align-items-center">
        <div className="add-connect__top--left">
          <h2 className="secundary-font title-size bold-font">Een connectie aanmaken</h2>
        </div>
        <div className="add-connect__top--right d-flex justify-content-end align-items-center">
          <StandardButton
            text="Terug naar overzicht"
            action={() => history.push(Routes.MY_PROFILE)}
          />
        </div>
      </div>
      <div className="add-connect__content margin-top-50">
        <h5 className="subtitle-size secundary-font bold-font">
          Start met het toevoegen van een {receiver}
        </h5>
        <p className="text-size tertiary-font">
          Vul in onderstaand veld jouw {receiver} zijn/haar unieke code in.
        </p>
        <form>
          <Code setCode={setCode} code={code} />
          {
            error.visible && (
              <p className="error">
                {error.text}
              </p>
            )
          }
          <StandardButton 
            text="Toevoegen"
            action={submitConnection}
          />
        </form>
      </div>
    </div>
  );
};
