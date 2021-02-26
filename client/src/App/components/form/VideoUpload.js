import React, { useCallback, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

// Services
// import { useApi } from '../../services';

// Utils
import { axiosInstance } from '../../utils';

export const VideoUpload = ({ media, setMedia, label, description }) => {
  // States
  const [ video, setVideo ] = useState();
  const [ srcVideo, setSrcVideo ] = useState();
  const [ progress, setProgress ] = useState({
    shown: true,
    percentage: 0,
  });
  const [ error, setError ] = useState({
    shown: false,
    message: '',
  });

  // Services
  // const { getVideo } = useApi();

  // Show video
  // const fetchVideo = useCallback(async () => {
  //   try {
  //     const result = await getVideo(video);
  //     setSrcVideo(result);
  //     console.log(result);
  //   } catch (e) {
  //     setError({
  //       message: "Kon video niet ophalen",
  //       shown: true,
  //     });
  //   };
  // }, [getVideo, video]);

  // useEffect(() => {
  // }, [fetchVideo]);

  // Check upload
  const whenUploading = (e) => {
    const file = e.target.files[0];
    const fileSize = file.size / (1024*1024);

    if (fileSize > 64) {
      setError({
        shown: true,
        message: "De video kan maximaal 64MB groot zijn. Deze is net iets te groot."
      });

      return;
    };

    // To the server!
    const formData = new FormData();
    formData.append("video", file);

    axiosInstance.post('/video/upload', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: data => {
        setProgress({
          shown: true,
          percentage: Math.round((100 * data.loaded) / data.total),
        });
      },
    }).then((res) => {
      const result = JSON.parse(res.request.response);
      setVideo(result.filename);
      setMedia(result.filename);
    });
  };

  return (
    <div className="row video-upload d-flex justify-content-between">
      <div className="col-12 col-lg-6 video-upload__text">
        <span className="video-upload__text--label">{label}</span>
        <span className="video-upload__text--description">{description}</span>
        <div className="video-upload__text--button d-flex align-items-center">
          <span>
            <button>Kies een bestand</button>
            <input type="file" accept="video/mp4,video/x-m4v,video/*" onChange={(e) => whenUploading(e)} />
          </span>
          {
            progress.shown && (
              <div className="video-upload__text--button--progress">
                <h3 className="secundary-font text-size bold-font">
                  {progress.percentage}%
                </h3>
                <div className="video-upload__text--button--progress--inside" style={{
                  width: `${progress.percentage}%`,
                }}></div>
              </div>
            )
          }
        </div>
        {
          error.shown && (
            <div className="video-upload__text--message secundary-font text-size bold-font">
              {error.message}
            </div>
          )
        }
      </div>
      <div className="col-12 col-lg-5 video-upload__preview">
        {
          video && (
            <div>
              <video id="example_video_1" className="video-js vjs-default-skin" controls preload="auto" width="100%" height="300px" data-setup='{}'>
                  <source src="http://localhost:8000/velomo-api/video/9def69fd95248a153fb36a65e57e98c0.mp4" type="video/mp4" data-quality="hd" data-res="HD" data-default="true"></source>
              </video>
          </div>      
          )
        }
      </div>
    </div>
  )
};