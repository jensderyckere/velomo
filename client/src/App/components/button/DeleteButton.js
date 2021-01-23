import React, { useState } from 'react';
import { GreyButton } from './GreyButton';

export const DeleteButton = ({firstText, action}) => {
  const [ remove, setRemove ] = useState();

  return (
    remove ? (
      <div className="margin-top-20">
        <div className="d-flex align-items-center">
          <span className="delete-button" onClick={action}>
            Ik ben zeker
          </span>
          <GreyButton 
            text="Nee, toch niet"
            action={() => setRemove(false)}
            extraClasses="margin-left-10"
          />
        </div>
      </div>
    ) : (
      <div className="margin-top-20">
        <GreyButton 
          text={firstText}
          action={() => setRemove(true)}
        />
      </div>
    )
  );
};