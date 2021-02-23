import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

// Components
import { Inputfield, Radio, StandardButton, Textarea } from '../../components';

// Routes
import * as Routes from '../../routes';

export const AddChallenge = () => {
  // Routing
  const history = useHistory();

  // States
  const [ typeChallenge, setTypeChallenge ] = useState("distance");
  const [ form, setForm ] = useState({
    'title': '',
    'description': '',
    'distance': '',
    'duration': '',
  });

  // Change states
  const changeStates = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className="create-challenge">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="secundary-font bold-font title-size">Uitdaging maken</h5>
          <StandardButton text="Keer terug" action={() => history.push(Routes.MY_PROFILE)} />
        </div>
        <div className="section-title">
          <h5>TYPE UITDAGING</h5>
        </div>
        <div className="create-challenge__radio">
          <Radio 
            id="distance"
            name="distance"
            index="distance"
            setIndex={setTypeChallenge}
            checked={typeChallenge === "distance" ? true : false}
          >
            <span className="secundary-font text-size">
              Op basis van afstand
            </span>
          </Radio>
          <Radio 
            id="duration"
            name="duration"
            index="duration"
            setIndex={setTypeChallenge}
            checked={typeChallenge === "duration" ? true : false}
          >
            <span className="secundary-font text-size">
              Op basis van tijd
            </span>
          </Radio>
          <Radio 
            id="image"
            name="image"
            index="image"
            setIndex={setTypeChallenge}
            checked={typeChallenge === "image" ? true : false}
          >
            <span className="secundary-font text-size">
              Op basis van een afbeelding
            </span>
          </Radio>
          <Radio 
            id="activity"
            name="activity"
            index="activity"
            setIndex={setTypeChallenge}
            checked={typeChallenge === "activity" ? true : false}
          >
            <span className="secundary-font text-size">
              Op basis van een activiteit
            </span>
          </Radio>
          <Radio 
            id="video"
            name="video"
            index="video"
            setIndex={setTypeChallenge}
            checked={typeChallenge === "video" ? true : false}
          >
            <span className="secundary-font text-size">
              Op basis van een video
            </span>
          </Radio>
        </div>
        <div className="section-title margin-top-50">
          <h5>DETAILS INVOEREN</h5>
        </div>
        <div className="row">
          <div className="col-lg-6 col-12">
            <Inputfield 
              label="Titel"
              id="title"
              name="title"
              size="large"
              changeInput={(e) => changeStates(e)}
            />
            <Textarea 
              label="Beschrijving"
              id="description"
              name="description"
              size="large"
              changeInput={(e) => changeStates(e)}
            />
          </div>
        </div>
      </div>
    </>
  );
};
