import React, { useState } from 'react';

// Components
import { Code, StandardButton } from '../../components';

// Services
import { useAuth } from '../../services';

export const ConnectCard = ({user, title, text}) => {
  const { createConnection, currentUser } = useAuth();

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

      window.location.reload();
    } catch (e) {
      setError({
        visible: true,
        text: 'Er is iets verkeerd gelopen',
      });
    };
  };

  return (
    <div className="grey-card connect-card padding-50-30">
      <h1 className="text-center secundary-font title-size bold-font">
        {title}
      </h1>
      <p className="text-center secundary-font text-size margin-top-20">
        {text}
      </p>
      <form id="connect-form">
        <Code setCode={setCode} code={code} />
        {
          error.visible && (
            <p className="error">
              {error.text}
            </p>
          )
        }
        <div className="d-flex justify-content-center connect-card__button margin-top-20">
          <StandardButton 
            text="Bevestig"
            action={submitConnection}
          />
        </div>
      </form>
    </div>
  );
};