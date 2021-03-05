import React from 'react';
import { useHistory } from 'react-router-dom';

// Components
import { CheckSVG, ImageUrl, SlugText } from '../../components';

// Images
import DefaultUser from '../../assets/icons/user.svg';

// Routes
import * as Routes from '../../routes';

// Services
import { useApi, useAuth } from '../../services';

// Partials
import { ActivityMap } from '../activity';

export const SubmissionCard = ({ submission, cred, challenge }) => {
  // Routing
  const history = useHistory();

  // Services
  const { approveSubmission } = useApi();
  const { currentUser } = useAuth();

  // Approve submission
  const approve = async () => {
    await approveSubmission(currentUser, challenge._id, submission._userId._id);
    window.location.reload();
  };
  
  return (
    <div className={`col-md-6 col-12 ${cred ? 'col-lg-4' : ''}`}>
      <div className="submission-card">
        {
          submission.image && (
            <div className="submission-card__image" style={{
              backgroundImage: `url(${ImageUrl(submission.image, '')})`
            }}></div>
          )
        }
        {
          submission.activity && (
            <ActivityMap activity={submission.activity} />
          )
        }
        <div className="margin-top-30">
          <span className="secundary-font text-size light-font">
            "{submission.text}"
          </span>
          <div className="margin-top-20 d-flex align-items-center">
            <div className="avatar avatar-standard margin-right-20 pointer" onClick={() => history.push(Routes.PROFILE.replace(':name', SlugText(submission._userId.firstName + ' ' + submission._userId.lastName)).replace(':id', submission._userId._id))} style={{
              backgroundImage: `url(${ImageUrl(submission._userId.profile.avatar, DefaultUser)})`
            }}></div>
            <span className="secundary-font bold-font hover-text pointer text-size" onClick={() => history.push(Routes.PROFILE.replace(':name', SlugText(submission._userId.firstName + ' ' + submission._userId.lastName)).replace(':id', submission._userId._id))}>
              {submission._userId.firstName + ' ' + submission._userId.lastName}
            </span>
          </div>
        </div>
      </div>
      {
        cred && (
          <div className="margin-top-30 d-flex justify-content-center">
            <div className="submission-card__check" onClick={approve}>
              <CheckSVG />
            </div>
          </div>
        )
      }
    </div>
  );
};
