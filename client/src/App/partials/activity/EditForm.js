import React, { useState } from 'react';

// Components
import { Radio, Inputfield, Textarea, IMGUpload, StandardButton, Message, Distance, Duration } from '../../components';

// Services
import { useApi, useAuth } from '../../services';

export const EditForm = ({ activity }) => {
  // States
  const [ typeTraining, setTypeTraining ] = useState(activity.type);
  const [ images, setImages ] = useState(activity.images);
  const [ error, setError ] = useState(false);

  // Services
  const { editActivity } = useApi();
  const { currentUser } = useAuth();

  const EditFile = () => {
    // States
    const [ form, setForm ] = useState({
      'title': activity.title,
      'description': activity.description,
    });

    // Change states
    const changeStates = (e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    };

    const edit = async () => {
      const object = activity.activity;

      if (images) {
        const result = await editActivity(currentUser, activity._id, {
          title: form.title,
          description: form.description,
          type: typeTraining,
          images: images,
          object: object,
        });

        if (!result) {
          setError(true);
          return;
        };
      } else {
        const result = await editActivity(currentUser, activity._id, {
          title: form.title,
          description: form.description,
          type: typeTraining,
          object: object,
          images: images,
        });

        if (!result) {
          setError(true);
          return;
        };
      };
    };

    return (
      <>
        <div className="section-title">
          <h5>DETAILS INVOEREN</h5>
        </div>
        <div className="row">
          <div className="col-md-6 col-12">
            <Inputfield 
              label="Titel"
              id="title"
              name="title"
              size="large"
              value={activity.title}
              changeInput={(e) => changeStates(e)}
            />
            <Textarea 
              label="Beschrijving"
              id="description"
              name="description"
              size="large"
              value={activity.description}
              changeInput={(e) => changeStates(e)}
            />
          </div>
        </div>
      <div className="section-title">
        <h5>TYPE ACTIVITEIT</h5>
      </div>
        <div className="activities__create--radio">
          <Radio 
            id="training"
            name="training"
            index={"Training"}
            setIndex={setTypeTraining}
            checked={typeTraining === "Training" ? true : false}
          >
            <span className="secundary-font text-size">
              Training
            </span>
          </Radio>
          <Radio 
            id="race"
            name="race"
            index={"Race"}
            setIndex={setTypeTraining}
            checked={typeTraining === "Race" ? true : false}
          >
            <span className="secundary-font text-size">
              Wedstrijd
            </span>
        </Radio>
      </div>
        <div className="section-title">
          <h5>FOTO'S TOEVOEGEN</h5>
        </div>
        <IMGUpload defaultImages={images} setImages={setImages} />
        <div className="margin-top-50">
          {
            error && (
              <Message 
                error={true}
                message="Bewerken van activiteit kon niet worden volbracht"
              />
            )
          }
        </div>
        <div className="margin-top-50 d-flex justify-content-end">
          <StandardButton action={edit} text="Activiteit bewerken" />
        </div>
      </>
    )
  };

  const EditManual = () => {
    // States
    const [ form, setForm ] = useState({
      'title': activity.title,
      'description': activity.description,
      'distance': activity.total_distance,
      'duration': activity.duration,
    });

    // Change states
    const changeStates = (e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    };

    const calculateAverageSpeed = (hours, minutes, seconds, distanceInKm) => {
      let totalTime = parseInt(hours * 3600) + parseInt(minutes * 60) + parseInt(seconds);
      let distanceInM = parseInt(distanceInKm) * parseInt(1000);
      let speedInM = parseInt(distanceInM) / totalTime;
      let speedInKm = speedInM * 3.6;
      
      return speedInKm;
    };

    const edit = async () => {
      const splittedTime = form.duration.split(":");

      if (form.title.length === 0 || form.description.length === 0 || form.distance.length === 0 || splittedTime[0].length === 0 || splittedTime[1].length === 0 || splittedTime[2].length === 0) {
        setError(true);
        return;
      };

      const avgSpeed = calculateAverageSpeed(splittedTime[0], splittedTime[1], splittedTime[2], form.distance).toFixed(2);

      const object = {
        'total_distance': form.distance,
        'avg_speed': avgSpeed,
        'duration': form.duration,
      };

      if (images) {
        const result = await editActivity(currentUser, {
          title: form.title,
          description: form.description,
          type: typeTraining,
          images: images,
          object: object,
        });

        if (!result) {
          setError(true);
          return;
        };
      } else {
        const result = await editActivity(currentUser, {
          title: form.title,
          description: form.description,
          type: typeTraining,
          object: object,
          images: images,
        });

        if (!result) {
          setError(true);
          return;
        };
      };
    };

    return (
      <>
      <div className="section-title">
        <h5>TYPE ACTIVITEIT</h5>
      </div>
        <div className="activities__create--radio">
          <Radio 
            id="training"
            name="training"
            index={"Training"}
            setIndex={setTypeTraining}
            checked={typeTraining === "Training" ? true : false}
          >
            <span className="secundary-font text-size">
              Training
            </span>
          </Radio>
          <Radio 
            id="race"
            name="race"
            index={"Race"}
            setIndex={setTypeTraining}
            checked={typeTraining === "Race" ? true : false}
          >
            <span className="secundary-font text-size">
              Wedstrijd
            </span>
        </Radio>
      </div>
      <div className="section-title">
        <h5>DETAILS INVOEGEN</h5>
      </div>
      <div className="row">
        <div className="col-md-6 col-12">
          <Inputfield 
            label="Titel"
            id="title"
            name="title"
            size="large"
            value={form.title}
            changeInput={(e) => changeStates(e)}
          />
          <Textarea 
            label="Beschrijving"
            id="description"
            name="description"
            size="large"
            value={form.description}
            changeInput={(e) => changeStates(e)}
          />
          <Distance
            id="distance"
            name="distance"
            form={form}
            defaultValue={form.distance}
            setForm={setForm}
          />
          <Duration 
            changeFully={setForm}
            form={form}
          />
        </div>
      </div>
      <div className="section-title">
        <h5>FOTO'S TOEVOEGEN</h5>
      </div>
      <IMGUpload defaultImages={images} setImages={setImages} />
      <div className="margin-top-50">
        {
          error && (
            <Message 
              error={true}
              message="Bewerken van activiteit kon niet worden volbracht"
            />
          )
        }
      </div>
      <div className="margin-top-50 d-flex justify-content-end">
        <StandardButton action={edit} text="Activiteit bewerken" />
      </div>
    </>
    )
  };

  return (
    <>
      <h1 className="standard-title">
        "{activity.title}" bewerken
      </h1>
      <div className="activities__create">
        {
          activity.activity.checkpoints ? (
            <EditFile />
          ) : (
            <EditManual />
          )
        }
      </div>
    </>
  )
};
