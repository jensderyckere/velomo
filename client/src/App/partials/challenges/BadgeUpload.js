import React from 'react';

// Components
import { GreyButton, ImageUrl, StandardButton } from '../../components';

// Images
import BadgeDefault from '../../assets/images/badge_default.png';

export const BadgeUpload = ({ defaultImage, setDefaultImage, deleteImage }) => {
  return (
    <div className="badge-upload d-flex">
      <div className="standard-badge">
        <span className="badge-upload avatar avatar-big" style={{
          backgroundImage: `url(${ImageUrl(defaultImage, BadgeDefault)})`
        }}></span>
      </div>
      <div className="badge-upload__buttons d-flex align-items-center">
        <span className="badge-upload__buttons--edit">
          <StandardButton text="Aanpassen" />
          <input type="file" accept="image/*" onChange={(e) => setDefaultImage(e.target.files[0])} />
        </span>
        {
          defaultImage && (
            <GreyButton 
              text="Verwijder" 
              action={deleteImage} 
            />
          )
        }
      </div>
    </div>
  );
};
