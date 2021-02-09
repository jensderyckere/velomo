import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

// Components
import { Distance, Duration, GPXUpload, IMGUpload, Inputfield, Message, Radio, StandardButton, Textarea } from '../../components';

// Services
import { useApi, useAuth } from '../../services';

// Routes
import * as Routes from '../../routes';

export const CreateForm = ({ user }) => {
  // Routing
  const history = useHistory();

  // States
  const [ view, setView ] = useState(false);
  const [ file, setFile ] = useState();
  const [ images, setImages ] = useState([]);
  const [ error, setError ] = useState(false);
  const [ typeTraining, setTypeTraining ] = useState();

  // Services
  const { currentUser } = useAuth();
  const { uploadActivity, createActivity } = useApi();

  // Manuel upload
  const ManuelView = () => {
    // States
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

    const calculateAverageSpeed = (hours, minutes, seconds, distanceInKm) => {
      let totalTime = parseInt(hours * 3600) + parseInt(minutes * 60) + parseInt(seconds);
      let distanceInM = parseInt(distanceInKm) * parseInt(1000);
      let speedInM = parseInt(distanceInM) / totalTime;
      let speedInKm = speedInM * 3.6;
      
      return speedInKm;
    };

    const upload = async () => {
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
        const result = await createActivity(currentUser, {
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
        const result = await createActivity(currentUser, {
          title: form.title,
          description: form.description,
          type: typeTraining,
          object: object,
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
              changeInput={(e) => changeStates(e)}
            />
            <Textarea 
              label="Beschrijving"
              id="description"
              name="description"
              size="large"
              changeInput={(e) => changeStates(e)}
            />
            <Distance
              id="distance"
              name="distance"
              form={form}
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
                message="Uploaden van bestand kon niet worden volbracht"
              />
            )
          }
        </div>
        <div className="margin-top-50 d-flex justify-content-end">
          <StandardButton action={upload} text="Activiteit aanmaken" />
        </div>
      </>
    );
  };

  // View when uploading file
  const UploadingView = () => {
    // States
    const [ form, setForm ] = useState({
      'title': '',
      'description': '',
    });

    // Change states
    const changeStates = (e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    };

    // Submitting activity
    const upload = async () => {
      if (!file || form.title.length === 0 || form.description.length === 0 || !typeTraining) {
        setError(true);
        return;
      };

      try {
        if (images) {
          const result = await uploadActivity(currentUser, {
            title: form.title,
            description: form.description,
            type: typeTraining,
            images: images,
            gpxFile: file,
          });

          if (!result) {
            setError(true);
            return;
          };
        } else {
          const result = await uploadActivity(currentUser, {
            title: form.title,
            description: form.description,
            type: typeTraining,
            gpxFile: file,
          });

          if (!result) {
            setError(true);
            return;
          };
        };

        history.push(Routes.ACTIVITIES);
      } catch (e) {
        history.push(Routes.ERROR);
      };
    };
    return (
      <>
        <div className="section-title">
          <h5>BESTAND UPLOADEN</h5>
        </div>
        <GPXUpload file={file} setFile={setFile} />
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
                message="Uploaden van bestand kon niet worden volbracht"
              />
            )
          }
        </div>
        <div className="margin-top-50 d-flex justify-content-end">
          <StandardButton action={upload} text="Activiteit aanmaken" />
        </div>
      </>
    );
  };

  return (
    <>
      <h1 className="standard-title">
        Activiteit aanmaken
      </h1>
      <div className="activities__create">
        <div className="activities__create--radio margin-top-30">
          <Radio 
            id="manual"
            name="manual"
            index={false}
            setIndex={setView}
            checked={view ? false : true}
          >
            <span className="secundary-font text-size">
              Handmatig toevoegen
            </span>
          </Radio>
          <Radio 
            id="gpx"
            name="gpx"
            index={true}
            setIndex={setView}
            checked={view ? true : false}
          >
            <span className="secundary-font text-size">
              GPX uploaden
            </span>
          </Radio>
        </div>
        {
          view ? (
            <UploadingView />
          ) : (
            <ManuelView />
          )
        }
      </div>
    </>
  );
};
