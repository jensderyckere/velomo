import React, { useState } from 'react';
import { GreyButton, ImageUrl, StandardButton, Textarea } from '../../components';

// Services
import { useApi, useAuth } from '../../services';

// Utilities
import { axiosInstance, ScreenSizeClassSwitch } from '../../utils';

export const Submission = ({ challenge, user, hide }) => {
  // Services
  const { currentUser } = useAuth();
  const { submitSubmission } = useApi();

  // States
  const [ submissionForm, setSubmissionForm ] = useState({
    text: '',
    image: '',
    video: '',
    activity: '',
    _userId: user._id,
  });
  const [ correctSubmission, setCorrectSubmission ] = useState(false);
  const [ error, setError ] = useState(false);
  const [ progress, setProgress ] = useState({
    shown: true,
    percentage: 0,
  });

  // Submit the submission
  const createSubmission = async () => {
    if (challenge.type === 'image') {
      if (submissionForm.text.length === 0 || submissionForm.image.length === 0) {
        setError(true);
        return;
      };
    };

    const result = await submitSubmission(currentUser, challenge._id, submissionForm);

    if (result) {
      setCorrectSubmission(true);
    } else {
      setError(true);
    };
  };  

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
      setSubmissionForm({...submissionForm, image: result.filename});
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
            backgroundImage: `url(${ImageUrl(submissionForm.image, '')})`
          }}>
            {
              !submissionForm.image && '?'
            }
          </div>
          <div className="submission__image-upload--buttons">
            <div className="submission__image-upload--buttons--create d-inline-flex pointer margin-bottom-10">
              <span className="secundary-font text-size bold-font white-color">Aanpassen</span>
              <input type="file" accept="image/*" onChange={(e) => uploadImageWithProgress(e.target.files[0])} />
            </div>
            <GreyButton
              text="Verwijder"
              action={() => setSubmissionForm({...submissionForm, image: null})}
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
        <div className="d-flex justify-content-end">
          {
            submissionForm.image && (
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
      </div>
    );
  };

  const ChallengeActivityUpload = () => {
    return '';
  };

  const DesktopSubmission = () => {
    return (
      <div className="submission-popup">
        <div className="submission-popup__card box-shadow radius-20">
          {
            correctSubmission ? (
              ''
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
                      <ChallengeImageUpload />
                    )
                  }
                  {
                    challenge.type === 'activity' && (
                      <ChallengeActivityUpload />
                    )
                  }
                  {
                    error && (
                      <div className="error-message">
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
