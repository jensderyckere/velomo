import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

// Components
import { Datepicker, Distance, Duration, GreyButton, IMGUpload, Inputfield, Message, Radio, Slider, StandardButton, Textarea, VideoUpload } from '../../components';

// Partials
import { BadgeUpload } from '.';

// Routes
import * as Routes from '../../routes';

// Services
import { useApi, useAuth } from '../../services';

export const ChangeChallenge = ({ challenge }) => {
  // Routing
  const history = useHistory();

  // Services
  const { uploadPicture, editChallenge, deleteChallenge } = useApi();
  const { currentUser } = useAuth();

  // States
  const [ typeChallenge, setTypeChallenge ] = useState(challenge.type);
  const [ form, setForm ] = useState({
    'title': challenge.title,
    'description': challenge.content,
    'shortContent': challenge.shortContent,
    'distance': challenge.distance,
    'duration': challenge.duration,
    'start_date': Date.now(),
    'end_date': Date.now(),
    'difficulty': challenge.difficulty === 'Makkelijk' ? 0 : challenge.difficulty === 'Medium' ? 1 : 2,
    'badge': '',
  });
  const [ error, setError ] = useState(false);

  const [ images, setImages ] = useState(challenge.images);
  const [ video, setVideo ] = useState('');

  // Change states
  const changeStates = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const changeStartDate = (date) => {
    setForm({
      ...form,
      start_date: date,
    });
  };

  const changeEndDate = (date) => {
    setForm({
      ...form,
      end_date: date,
    });
  };

  const changeDifficulty = (value) => {
    setForm({
      ...form,
      difficulty: value,
    });
  };

  const changeBadge = async (image) => {
    const result = await uploadPicture(currentUser, image);

    setForm({
      ...form,
      badge: result.filename,
    });
  };

  // Upload the challenge
  const updateChallenge = async () => {
    try {
      if (!typeChallenge) {
        setError(true);
        return;
      };
  
      if (form.title.length === 0 || form.description.length === 0 || form.shortContent.length === 0) {
        setError(true);
        return;
      };
  
      if (!form.badge) {
        setError(true);
        return;
      };

      const result = await editChallenge(currentUser, challenge._id, {
        title: form.title,
        content: form.description,
        images: images,
        video: video,
        badge: form.badge,
        shortContent: form.shortContent,
        difficulty: form.difficulty === 0 ? 'Makkelijk' : form.difficulty === 1 ? 'Medium' : form.difficulty === 2 ? 'Moeilijk' : '',
        type: typeChallenge,
        distance: form.distance,
        start_date: form.start_date,
        end_date: form.end_date,
      });

      if (!result) {
        setError(true);
        return;
      };

      history.push(Routes.CHALLENGE.replace(':id', result._id));
    } catch (e) {
      setError(true);
    }
  };

  const removeChallenge = async () => {
    await deleteChallenge(currentUser, challenge._id);
    history.push(Routes.MY_PROFILE);
  };

  return (
    <>
      <div className="create-challenge">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="secundary-font bold-font title-size">"{challenge.title}" bewerken</h5>
          <StandardButton text="Keer terug" action={() => history.push(Routes.CHALLENGE.replace(':id', challenge._id))} />
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
        <div className="row justify-content-between">
          <div className="col-lg-6 col-12">
            <Inputfield 
              label="Titel"
              id="title"
              name="title"
              size="large"
              value={challenge.title}
              changeInput={(e) => changeStates(e)}
            />
            <Textarea 
              label="Tussentitel"
              id="shortContent"
              name="shortContent"
              size="large"
              value={challenge.shortContent}
              changeInput={(e) => changeStates(e)}
            />
            <Textarea 
              label="Beschrijving"
              id="description"
              name="description"
              size="large"
              value={challenge.content}
              changeInput={(e) => changeStates(e)}
            />
            <div className="row">
              <div className="col-lg-6 col-12">
                <Datepicker 
                  label="Startdatum" 
                  startDate={form.start_date} 
                  whenChanging={changeStartDate} 
                />
              </div>
              <div className="col-lg-6 col-12">
                <Datepicker 
                  label="Einddatum" 
                  startDate={form.end_date} 
                  whenChanging={changeEndDate} 
                />
              </div>
            </div>
            {
              typeChallenge === "distance"  && (
                <Distance 
                  id="distance_km" 
                  name="distance"
                  defaultValue={form.distance}
                  form={form}
                  setForm={setForm}
                />
              )
            }
            {
              typeChallenge === "duration"  && (
                <Duration 
                  defaultHours={form.duration.split(':')[0]} 
                  defaultMinutes={form.duration.split(':')[1]} 
                  defaultSeconds={form.duration.split(':')[2]} 
                  form={form}
                  changeFully={setForm}
                />
              )
            }
          </div>
          <div className="col-lg-5 col-12">
            <Slider 
              label="Moeilijkheidsgraad" 
              min={0} 
              max={2} 
              value={form.difficulty}
              onChange={changeDifficulty}
              labels={{
                0: 'Makkelijk',
                1: 'Medium',
                2: 'Moeilijk',
              }}
            />
          </div>
        </div>
        <div className="section-title margin-top-50">
          <h5>AFBEELDINGEN TOEVOEGEN</h5>
        </div>
        <IMGUpload 
          defaultImages={images} 
          setImages={setImages} 
        />
        <div className="section-title margin-top-50">
          <h5>VIDEO TOEVOEGEN</h5>
        </div>
        <VideoUpload 
          label="Video uploaden" 
          description="Je kan een video toevoegen om wat meer helderheid te bieden over deze uitdaging." 
          media={video}
          setMedia={setVideo}
        />
        <div className="section-title margin-top-50">
          <h5>BADGE TOEVOEGEN</h5>
        </div>
        <BadgeUpload 
          defaultImage={form.badge} 
          setDefaultImage={changeBadge} 
          deleteImage={() => setForm({...form, badge: ''})}
        />
        {
          error && (
            <Message 
              error={true}
              message="Deze uitdaging kon niet worden aangemaakt."
            />
          )
        }
        <div className="d-flex justify-content-end margin-top-50">
          <StandardButton  
            text="Uitdaging bewerken"
            extraClasses="margin-right-10"
            action={updateChallenge}
          />
          <GreyButton
            text="Verwijderen"
            action={removeChallenge}
          />
        </div>
      </div>
    </>
  );
};
