import React, { useState } from 'react';
import ReactPlayer from 'react-player';

export const VideoUpload = ({ media, setMedia, label, description }) => {
  // States
  const [ video, setVideo ] = useState();

  // Check upload
  const whenUploading = (e) => {
    const file = e.target.files[0];
  };

  return (
    <div className="row video-upload">
      <div className="col-12 col-lg-6 video-upload__text">
        <span className="video-upload__text--label">{label}</span>
        <span className="video-upload__text--description">{description}</span>
        <div className="video-upload__text--button">
          <span>
            <button>Kies een bestand</button>
            <input type="file" accept="video/mp4,video/x-m4v,video/*" onChange={(e) => whenUploading(e)} />
          </span>
        </div>
      </div>
      <div className="col-12 col-lg-6 video-upload__preview">
        {
          video && (
            <ReactPlayer />
          )
        }
      </div>
    </div>
  )
};