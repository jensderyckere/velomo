import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Partials
import { SubmissionCard } from '.';

// Components
import { ImageUrl, StandardButton } from '../../components';

// Routes
import * as Routes from '../../routes';

export const ChallengeContent = ({ challenge, user }) => {
  // Routing
  const history = useHistory();

  // States
  const [ submissions, setSubmissions ] = useState();
  
  useEffect(() => {
    if (challenge.type === 'distance' || challenge.type === 'duration') {
    } else {
      setSubmissions(challenge.submissions);
    };
  }, [challenge]);

  return (
    <div className="challenge-content">
      <h1 className="secundary-font title-size bold-font margin-top-30">"{challenge.title}"</h1>
      <p className="tertiary-font text-size margin-top-30 standard-lh light-font">{challenge.content}</p>
      {
        challenge.images.length !== 0 && (
          <>
            <span className="secundary-font bold-font text-size">Hieronder zie je één of meerdere voorbeelden die misschien kunnen zorgen voor wat inspiratie</span>
            {
              challenge.images.map((image, index) => {
                return <div className="challenge-content__image margin-top-20 margin-bottom-20" key={index} style={{
                  backgroundImage: `url(${ImageUrl(image, '')})`
                }}></div>
              })
            }
          </>
        )
      }
      {
        submissions && submissions.length !== 0 && (
          <div className="margin-top-50">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="secundary-font title-size bold-font margin-top-30">Reeds ingezonden</h1>
              {
                challenge._userId === user._id && (
                  <StandardButton 
                    text="Inzendingen keuren"
                    action={() => history.push(Routes.SUBMISSIONS.replace(':id', challenge._id))}
                  />
                )
              }
            </div>
            <div className="margin-top-30 row">
              {
                submissions.map((submission, index) => {
                  return index < 4 && <SubmissionCard submission={submission} /> 
                })
              }
            </div>
          </div>
        )
      }
    </div>
  )
};
