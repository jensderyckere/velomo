import React from 'react';
import Moment from 'moment';
import 'moment/locale/nl-be';

// Components 
import { DateText } from '../../components';

// Images
import Placeholder from '../../assets/images/welcome.png';

export const Welcome = ({ screenSize }) => {
  return (
    <section className={`welcome ${screenSize === 'xl' || screenSize === 'lg' ? 'd-welcome' : 'm-welcome'}`}>
      <div className="welcome__holder">
        <div className="welcome__holder--image">
          <img src={Placeholder} alt="wva"/>
        </div>
        <div className="welcome__holder--text">
          <h2 className={`primary-font white-color text-shadow ${screenSize === 'xl' || screenSize === 'lg' ? 'giant-title-size' : 'subtitle-size'}`}>Nog {Moment(Date.now()).diff(Moment('01/04/2021'), 'days')} dagen tot de Ronde van Vlaanderen</h2>
          <p className={`secundary-font white-color text-shadow ${screenSize === 'xl' || screenSize === 'lg' ? 'title-size' : 'text-size'}`}>
            -{DateText(Date.now())}
          </p>
        </div>
      </div>
    </section>
  );
};
