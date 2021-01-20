import React, { useState } from 'react';

// Components 
import { DateText } from '../../components';

export const Welcome = ({ screenSize }) => {
  const [ image, setImage ] = useState();
  const [ quote, setQuote ] = useState();

  return (
    <section className={`welcome ${screenSize === 'xl' || screenSize === 'lg' ? 'd-welcome' : 'm-welcome'}`}>
      <div className="welcome__holder">
        <div className="welcome__holder--image">

        </div>
        <div className="welcome__holder--text">
          <h2 className={`primary-font white-color text-shadow ${screenSize === 'xl' || screenSize === 'lg' ? 'giant-title-size' : 'subtitle-size'}`}>Dit is een test</h2>
          <p className={`secundary-font white-color text-shadow ${screenSize === 'xl' || screenSize === 'lg' ? 'title-size' : 'text-size'}`}>
            <DateText 
              date={Date.now()}
            />
          </p>
        </div>
      </div>
    </section>
  );
};
