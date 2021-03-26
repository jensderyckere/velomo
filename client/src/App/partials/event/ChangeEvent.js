import React, { useState } from 'react';
import { useHistory } from 'react-router';

// Components
import { Datepicker, Duration, GreyButton, Inputfield, Message, Radio, StandardButton, Textarea } from '../../components';

// Routes
import * as Routes from '../../routes';

// Services
import { useApi, useAuth } from '../../services';

export const ChangeEvent = ({ user, event }) => {
  // Routing
  const history = useHistory();

  // Services
  const { currentUser } = useAuth();
  const { editEvent, deleteEvent } = useApi();

  // States
  const [ form, setForm ] = useState({
    title: event.title,
    description: event.description,
    location: event.details.location ? event.details.location : '',
    speed: event.details.speed ? event.details.speed : '',
    date: Date.now(),
    duration: event.details.duration ? event.details.duration : '00:00:00',
    gpxFile: event.gpxFile ? event.gpxFile : '',
    type: event.type.toLowerCase(),
  });

  const [ error, setError ] = useState(false);

  const updateEvent = async () => {
    if (form.title.length === 0 || form.description.length === 0 || form.location.length === 0 || form.date.length || 0) {
      setError(true);
      return;
    };

    if (form.type === "ride") {
      if (form.duration === '00:00:00' || form.speed.length === 0) {
        setError(true);
        return;
      };

      const result = await editEvent(currentUser, event._id, {
        title: form.title,
        description: form.description,
        details: {
          location: form.location,
          speed: form.speed,
          date: form.date,
          duration: form.duration,
        },
        type: form.type,
        gpxFile: form.gpxFile,
      });

      history.push(Routes.EVENT.replace(':id', result._id));
    } else {
      const result = await editEvent(currentUser, event._id, {
        title: form.title,
        description: form.description,
        details: {
          location: form.location,
          date: form.date,
        },
        type: form.type,
      });

      history.push(Routes.EVENT.replace(':id', result._id));
    };
  };

  const removeEvent = async () => {
    await deleteEvent(currentUser, event._id);
    history.push(Routes.EVENTS);
  };

  return (
    <>
      <div className="create-challenge">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="secundary-font bold-font title-size">Evenement bewerken</h5>
          <StandardButton text="Keer terug" action={() => history.goBack()} />
        </div>
        <div className="section-title">
          <h5>TYPE EVENEMENT</h5>
          <div className="create-challenge__radio">
            <Radio 
              id="ride"
              name="ride"
              index="ride"
              setIndex={() => setForm({...form, type: "ride"})}
              checked={form.type === "ride" ? true : false}
            >
              <span className="secundary-font text-size">Een groepsrit</span>
            </Radio>
            <Radio 
              id="team"
              name="team"
              index="team"
              setIndex={() => setForm({...form, type: "team"})}
              checked={form.type === "team" ? true : false}
            >
              <span className="secundary-font text-size">Een bijeenkomst</span>
            </Radio>
          </div>
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
              value={form.title}
              changeInput={(e) => setForm({...form, title: e.target.value})}
            />
            <Textarea 
              label="Beschrijving"
              id="description"
              name="description"
              size="large"
              value={form.description}
              changeInput={(e) => setForm({...form, description: e.target.value})}
            />
          </div>
        </div>
        <div className="section-title margin-top-50">
          <h5>SPECIFIEKE GEGEVENS</h5>
        </div>
        {
          form.type === "ride" && (
            <div className="row">
              <div className="col-lg-3 col-md-6 col-12">
                <Duration 
                  defaultHours={form.duration.split(':')[0]} 
                  defaultMinutes={form.duration.split(':')[1]} 
                  defaultSeconds={form.duration.split(':')[2]} 
                  form={form}
                  changeFully={setForm}
                />
              </div>
              <div className="col-lg-3 col-md-6 col-12">
                <Inputfield 
                  label="Snelheid"
                  id="speed"
                  name="speed"
                  size="large"
                  value={form.speed}
                  changeInput={(e) => setForm({...form, speed: e.target.value})}
                />
              </div>
            </div>
          )
        }
        <div className="row">
          <div className="col-lg-3 col-md-6 col-12">
            <Inputfield 
              label="Locatie"
              id="location"
              name="location"
              size="large"
              value={form.location}
              changeInput={(e) => setForm({...form, location: e.target.value})}
            />
          </div>
          <div className="col-lg-3 col-md-6 col-12">
            <Datepicker 
              label="Datum" 
              startDate={form.date} 
              whenChanging={(date) => setForm({...form, date: date})} 
            />
          </div>
        </div>
        {
          error && (
            <Message 
              error={true}
              message="Dit evenement kon niet worden bewerkt."
            />
          )
        }
        <div className="d-flex justify-content-end align-items-center margin-top-50">
          <StandardButton  
            text="Bewerken"
            extraClasses="margin-right-10"
            action={updateEvent}
          />
          <GreyButton
            text="Verwijderen"
            action={removeEvent}
          />
        </div>
      </div>
    </>
  );
};
