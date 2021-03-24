import React, { useState } from 'react';
import { useHistory } from 'react-router';

// Components
import { Inputfield, Radio, StandardButton, Textarea } from '../../components';

// Routes
import * as Routes from '../../routes';

// Services
import { useAuth } from '../../services';

export const AddEvent = ({ user }) => {
  // Routing
  const history = useHistory();

  // Services
  const { currentUser } = useAuth();

  // States
  const [ form, setForm ] = useState({
    title: '',
    description: '',
    details: {
      location: '',
      speed: '',
      date: '',
      duration: '',
    },
    gpxFile: '',
    type: 'ride',
  });

  const [ error, setError ] = useState(false);

  return (
    <>
      <div className="create-challenge">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="secundary-font bold-font title-size">Evenement maken</h5>
          <StandardButton text="Keer terug" action={() => history.push(Routes.CREATE_EVENT)} />
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
              changeInput={(e) => setForm({...form, title: e.target.value})}
            />
            <Textarea 
              label="Beschrijving"
              id="description"
              name="description"
              size="large"
              changeInput={(e) => setForm({...form, description: e.target.value})}
            />
          </div>
        </div>
      </div>
    </>
  )
};
