import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

// Routes
import * as Routes from '../../routes';

export const SideSwitchLink = ({slug, title}) => {
  const { setting } = useParams();
  const history = useHistory();

  return (
    <div onClick={() => history.push(Routes.SETTINGS.replace(':setting', slug))} className={`side-switch__link ${setting === slug ? 'active-link' : ''}`}>
      {
        setting === slug && (
          <div className='side-switch__link--border'></div>
        )
      }
      <span className="secundary-font bold-font text-size">
        {title}
      </span>
    </div>
  );
};
