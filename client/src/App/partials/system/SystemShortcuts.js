import React from 'react';
import { useHistory } from 'react-router';

// Components
import { GreyButton, StandardButton } from '../../components';

// Routes
import * as Routes from '../../routes';

export const SystemShortcuts = ({ system }) => {
  // Routing
  const history = useHistory();

  return (
    <div className="system-shortcuts">
      <h6 className="secundary-font bold-font title-size text-center">
        Momenteel zijn er {system._rewardIds.length} beloningen met {system._requirementIds.length} verbonden verplichtingen.
      </h6>
      <div className="d-flex justify-content-center margin-top-30">
        <StandardButton 
          text="Puntensysteem uitbreiden"
          action={() => history.push(Routes.EDIT_SYSTEM)}
        />
      </div>
      <div className="d-flex justify-content-center margin-top-20">
        <GreyButton 
          text="Manueel punten geven"
          action={() => history.push(Routes.MANUAL_POINTS)}
        />
      </div>
    </div>
  );
};