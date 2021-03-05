import React, { useState } from 'react';

// Components
import { GreyButton, ImageUrl, StandardButton, TeamSVG, Textarea, DistanceSVG, SpeedSVG } from '../../components';

// Services
import { useApi, useAuth } from '../../services';

// Utilities
import { axiosInstance, ScreenSizeClassSwitch } from '../../utils';

export const Submission = ({ challenge, user, hide }) => {
  // Services
  const { currentUser } = useAuth();
  const { submitSubmission } = useApi();

  // States
  const [ correctSubmission, setCorrectSubmission ] = useState(false);
  const [ error, setError ] = useState(false);
  const [ progress, setProgress ] = useState({
    shown: true,
    percentage: 0,
  });
  const [ image, setImage ] = useState(''); 
  const [ activity, setActivity ] = useState('');

  // Upload image
  const uploadImageWithProgress = async (file) => {
    const formData = new FormData();
    formData.append('picture', file);

    axiosInstance.post('/picture/upload', formData, {
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
      setImage(result.filename);
    }).catch((e) => {
      setError(true);
    });
  };

  const ChallengeImageUpload = () => {
    return (
      <div className="submission__image-upload margin-top-30 margin-bottom-20">
        <span className="secundary-font bold-font text-size submission__image-upload__label">
          Afbeelding uploaden
        </span>
        <div className="d-flex margin-top-20 align-items-center">
          <div className="submission__image-upload--preview" style={{
            backgroundImage: `url(${ImageUrl(image, '')})`
          }}>
            {
              !image && '?'
            }
          </div>
          <div className="submission__image-upload--buttons">
            <div className="submission__image-upload--buttons--create d-inline-flex pointer margin-bottom-10">
              <span className="secundary-font text-size bold-font white-color">Aanpassen</span>
              <input type="file" accept="image/*" onChange={(e) => uploadImageWithProgress(e.target.files[0])} />
            </div>
            <GreyButton
              text="Verwijder"
              action={() => setImage(null)}
            />
          </div>
        </div>
        {
          progress.shown && (
            <div className="submission__image-upload--progress margin-top-30 margin-bottom-20">
              <div className="submission__image-upload--progress--inside" style={{
                width: `${progress.percentage}%`,
              }}></div>
            </div>
          )
        }
      </div>
    );
  };

  const ChallengeActivityUpload = () => {
    return (
      <div className="submission__activity-upload no-scroll margin-top-30">
        <div className="submission__activity-upload__list scroll">
          <h5 className="secundary-font text-size bold-font margin-bottom-20 margin-left-20">
            Kies een activiteit
          </h5>
          {
            user.cyclist._activityIds.map((activityItem, index) => {
              return activityItem.activity.checkpoints && (
                <div className={`d-flex submission__activity-upload--item pointer ${activity && activity._id === activityItem._id && 'selected-activity'}`} onClick={() => setActivity(activityItem)} key={index}>
                  <div className="submission__activity-upload--item__text">
                    <h6 className="text-size bold-font secundary-font">
                      {activityItem.title}
                    </h6>
                    <div className="d-flex align-items-center margin-top-10">
                      <div className="d-inline-flex align-items-center margin-right-20">
                        <TeamSVG />
                        <span className="secundary-font light-font text-size margin-left-10">
                          {activityItem.type}
                        </span>
                      </div>
                      <div className="d-inline-flex align-items-center margin-right-20">
                        <DistanceSVG />
                        <span className="secundary-font light-font text-size margin-left-10">
                          {activityItem.activity.total_distance.toFixed(2)}km
                        </span>
                      </div>
                      <div className="d-inline-flex align-items-center">
                        <SpeedSVG />
                        <span className="secundary-font light-font text-size margin-left-10">
                          {activityItem.activity.total_duration}u
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    );
  };

  const DesktopSubmission = () => {
    const [ submissionForm, setSubmissionForm ] = useState({
      text: '',
      video: '',
      activity: '',
      _userId: user._id,
    });

    // Submit the submission
    const createSubmission = async () => {
      if (challenge.type === 'image') {
        if (submissionForm.text.length === 0 || !image) {
          setError(true);
          return;
        };
      };

      const result = await submitSubmission(currentUser, challenge._id, {
        text: submissionForm.text,
        image: image,
        video: submissionForm.video,
        activity: activity._id,
        _userId: user._id,
      });

      if (result) {
        setCorrectSubmission(true);
      } else {
        setError(true);
      };
    }; 

    return (
      <div className="submission-popup">
        <div className="submission-popup__card box-shadow radius-20">
          {
            correctSubmission ? (
              <>
                <h1 className="secundary-font bold-font title-size text-center">
                  Jouw inzending is verstuurd.
                </h1>
                <p className="tertiary-font light-font text-size text-center">
                  De inzending moet enkel nog goedgekeurd worden door jouw club.
                </p>
                <div className="margin-top-30 d-flex justify-content-center">
                  <StandardButton 
                    text="Oké, ik snap het"
                    action={hide}
                  />
                </div>
              </>
            ) : (
              <>
                <h3 className="secundary-font bold-font title-size">
                  Nieuwe inzending
                </h3>
                <div className="margin-top-30">
                  <Textarea 
                    id="text"
                    name="text"
                    label="Beschrijving"
                    changeInput={(e) => setSubmissionForm({...submissionForm, text: e.target.value})}
                  />
                  {
                    challenge.type === 'image' && (
                      <>
                      <ChallengeImageUpload />
                      <div className="d-flex justify-content-end">
                        {
                          image && (
                            <StandardButton 
                              text="Uploaden"
                              action={createSubmission}
                              extraClasses="margin-right-10"
                            />
                          )
                        }
                        <GreyButton 
                          text="Annuleren"
                          action={hide}
                        />
                      </div>
                      </>
                    )
                  }
                  {
                    challenge.type === 'activity' && (
                      <>
                        <ChallengeActivityUpload />
                        <div className="d-flex justify-content-end">
                        {
                          activity && (
                            <StandardButton 
                              text="Uploaden"
                              action={createSubmission}
                              extraClasses="margin-right-10"
                            />
                          )
                        }
                        <GreyButton 
                          text="Annuleren"
                          action={hide}
                        />
                      </div>
                      </>
                    )
                  }
                  {
                    error && (
                      <div className="error-message margin-top-30">
                        <span>Jouw inzending kon niet worden verstuurd. Heb je alle velden ingevuld? Of heb je al eens eerder ingediend?</span>
                      </div>
                    )
                  }
                </div>
              </>
            )
          }
        </div>
      </div>
    );
  };

  const MobileSubmission = () => {
    return !correctSubmission ? (
      <div className="submission-mobile">
        <h3 className="secundary-font bold-font subtitle-size">
          Nieuwe inzending
        </h3>
      </div>
    ) : (
      ''
    );
  };

  return ScreenSizeClassSwitch(<DesktopSubmission />, <MobileSubmission />);
};
