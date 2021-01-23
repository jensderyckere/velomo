import React from 'react';

// Partials
import { ShortUserView } from '../../partials';

// Components
import { StandardButton } from '../button';

export const CyclistsCard = ({ title, cyclists, club, action, cred }) => {
  return (
    <div className="grey-card cyclists-card no-scroll">
      <h1 className="text-center secundary-font title-size bold-font">
        {title}
      </h1>
      <div className="cyclists-card__overview margin-top-30 scroll">
        {
          cyclists && cyclists.length !== 0 ? cyclists.map((cyclist, index) => {
            return <ShortUserView 
              key={index} 
              user={cyclist._userId} 
              club={club} 
              cred={cred} 
            />
          }) : <span className="none d-flex text-center justify-content-center">Er zijn nog geen renners toegevoegd.<br/>Voeg renners toe via onderstaande knop.</span>
        }
      </div>
      <div className="d-flex margin-top-30 justify-content-center">
        <StandardButton 
          text="Voeg renner toe"
          action={action}
        />
      </div>
    </div>
  );
};
