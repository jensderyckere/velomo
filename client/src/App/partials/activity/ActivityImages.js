import React, { useState } from 'react';

// Components
import { ImageUrl } from '../../components';

export const ActivityImages = ({ images }) => {
  const [ view, setView ] = useState();

  const Image = ({ img }) => {
    return (
      <div onClick={() => setView(img)} className="activity-images__img-small" style={{
        backgroundImage: `url(${ImageUrl(img, img)})`
      }}></div>
    )
  };

  return (
    <div className="activity-images">
      <div className="section-title">
        <h5>Gemaakte afbeeldingen</h5>
      </div>
      {
        images.map((image, index) => {
          return <Image img={image} key={index} />
        })
      }
      {
        view && (
          <div className="activity-images--full" style={{
            backgroundImage: `url(${ImageUrl(view, view)})`
          }}>
          </div>
        )
      }
    </div>
  );
};