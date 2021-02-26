import React, { useCallback, useEffect } from 'react';

// Components
import { ImageUrl } from '../../components';

export const ChallengeContent = ({ challenge }) => {
  // Fetch charts when distance/duration
  const fetchCharts = useCallback(() => {
    try {

    } catch (e) {
      console.log(e);
    };
  });

  // Fetch submissions
  const fetchSubmissions = useCallback(() => {
    try {

    } catch (e) {
      console.log(e);
    };
  });
  
  useEffect(() => {
    if (challenge.type === 'distance' || challenge.type === 'duration') {
      fetchCharts();
    } else {
      fetchSubmissions();
    };
  }, [fetchCharts, fetchSubmissions, challenge]);

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
    </div>
  )
};
