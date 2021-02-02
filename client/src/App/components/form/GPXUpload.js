import React from 'react';

// Components
import { TrashSVG } from '../svg';

export const GPXUpload = ({file, setFile}) => {
  // Change preview
  const changePreview = (uploaded) => {
    setFile(uploaded);
  };

  return (
    <div className="row">
      <div className="col-12 col-md-4">
        <div className="activities__create--upload d-flex justify-content-center align-items-center">
          {
            file && (
              <div className="activities__create--upload--delete" onClick={() => setFile(null)}>
                <TrashSVG />
              </div>
            )
          }
          <input onChange={(e) => changePreview(e.target.files[0])} type="file" accept=".gpx" name="gpx" />
          <div className="activities__create--upload--wrapper">
            {
              file ? (
                <h5 className="secundary-font text-size bold-font">
                  {file.name}
                </h5>
              ) : (
                <h5 className="secundary-font text-size bold-font">
                  Druk op dit veld of sleep jouw GPX-bestand hierin.
                </h5>
              )
            }
          </div>
        </div>
      </div>
      {
        file && (
          <div className="col-12 col-md-8">
            <div className="activities__create--upload--details">
              <h6 className="secundary-font bold-font text-size margin-top-30">
                Jouw upload is succesvol voltooid!
              </h6>
              <p className="tertiary-font light-font text-size">
                Wil je het bestand verwijderen? Dan kan je dit doen door op het vuilbakje te drukken.
              </p>
            </div>
          </div>
        )
      }
    </div>
  )
};
