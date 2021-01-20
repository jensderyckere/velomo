import React, { useState } from 'react';

// Components
import { Code, StandardButton } from '../../components';

export const ConnectCard = ({user, title, text, type}) => {
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

  const submitConnection = () => {
    
  };

  return (
    <div className="connect-card padding-50-30">
      <h1 className="text-center secundary-font title-size bold-font">
        {title}
      </h1>
      <p className="text-center secundary-font text-size margin-top-20">
        {title}
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
          />
        </div>
      </form>
    </div>
  );
};