import React from 'react';
import { useHistory } from 'react-router-dom';

// Components
import { StandardButton } from '../../components';

// Routes
import * as Routes from '../../routes';

export const CreateClubCard = () => {
  const history = useHistory();

  return (
    <div className="grey-card create-card padding-50-30">
      <h1 className="text-center secundary-font title-size bold-font">
        Jouw club is nog niet geconfigureerd. Doe dit zo snel mogelijk.
      </h1>
      <p className="text-center secundary-font text-size margin-top-20">
        Druk op onderstaande knop om deze bewerking uit te voeren.
      </p>
      <div className="d-flex justify-content-center connect-card__button margin-top-20">
        <StandardButton 
          text="Configureer"
          action={() => history.push(Routes.SETTINGS, {type: 'edit_club'})}
        />
      </div>
    </div>
  );
};
