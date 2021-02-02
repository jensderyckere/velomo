import React from 'react';

// Services
import { useApi, useAuth } from '../../services';

// Components
import { ImageUrl } from '../text';
import { TrashSVG } from '../svg';

// Images
import DefaultUser from '../../assets/icons/user.svg';

export const IMGUpload = ({ defaultImages, setImages }) => {
  // Services
  const { uploadPicture } = useApi();
  const { currentUser } = useAuth();

  // Add image
  const addImage = async (file) => {
    const result = await uploadPicture(currentUser, file);

    let array = [];
    for (let i = 0; i < defaultImages.length; i++) {
      array.push(defaultImages[i]);
    };

    array.push(result.filename);

    setImages(array);
  };

  // Delete image
  const deleteImage = async (index) => {
    let array = [];
    for (let i = 0; i < defaultImages.length; i++) {
      array.push(defaultImages[i]);
    };

    array.splice(index, 1);

    setImages(array);
  };

  return (
    <div className="activities__create--images d-flex align-items-center">
      { 
        defaultImages && defaultImages.length !== 0 && defaultImages.map((element, index) => {
          return (
            <div key={index} className="activities__create--images--item" style={{
              backgroundImage: `url(${ImageUrl(element, DefaultUser)})`,
            }}>
              <div className="activities__create--images--item--delete d-flex justify-content-center align-items-center" onClick={() => deleteImage(index)}>
                <TrashSVG />
              </div>
            </div>
          )
        })
      }
      <div className="activities__create--images__upload">
        <span className="secundary-font bold-font orange-color">+</span>
        <input onChange={(e) => addImage(e.target.files[0])} type="file" accept="image/*" />
      </div>
    </div>
  );
};
