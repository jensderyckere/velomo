import React, { useState } from 'react';
import { useHistory } from 'react-router';

// Services
import { useApi, useAuth } from '../../services';

// Routes
import * as Routes from '../../routes';

// Components
import { Inputfield, Radio, Textarea, Datepicker, Distance, Message, StandardButton, GreyButton, DeleteButton } from '../../components';
import { BadgeUpload } from '../challenges';

export const ChangeGoal = ({ goal }) => {
  // Routing
  const history = useHistory();

  // Services
  const { currentUser } = useAuth();
  const { uploadPicture, editGoal, deleteGoal } = useApi();

  // States
  const [ type, setType ] = useState(goal.type)
  const [ form, setForm ] = useState({
    title: goal.title,
    description: goal.description,
    start_date: Date.now(),
    end_date: Date.now(),
    goal: goal.goal,
    badge: goal.badge,
  });
  const [ error, setError ] = useState(false);

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

  const changeBadge = async (image) => {
    const result = await uploadPicture(currentUser, image);

    setForm({
      ...form,
      badge: result.filename,
    });
  };

  const uploadGoal = async () => {
    if (!type) {
      setError(true);
      return;
    };

    if (form.title.length === 0 || form.description.length === 0 || form.goal === 0) {
      setError(true);
      return;
    };

    if (!form.badge) {
      setError(true);
      return;
    };

    const result = await editGoal(currentUser, goal._id, {
      title: form.title,
      description: form.title,
      type: type,
      goal: form.goal,
      badge: form.badge,
      start_date: form.start_date,
      end_date: form.end_date,
    });

    if (!result) {
      setError(true);
      return;
    };

    history.push(Routes.GOAL.replace(':id', result._id));
  };

  const removeGoal = async () => {
    await deleteGoal(currentUser, goal._id);
    history.push(Routes.GOALS);
  };

  return (
    <div className="create-challenge">
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="secundary-font bold-font title-size">Doelstelling bewerken</h5>
        <DeleteButton 
          firstText="Verwijder"
          action={removeGoal}
        />
      </div>
      <div className="section-title">
        <h5>TYPE DOELSTELLING</h5>
      </div>
      <div className="create-challenge__radio">
          <Radio 
            id="ride"
            name="ride"
            index="ride"
            setIndex={setType}
            checked={type === "ride" ? true : false}
          >
            <span className="secundary-font text-size">
              Op basis van één rit
            </span>
          </Radio>
          <Radio 
            id="month"
            name="month"
            index="month"
            setIndex={setType}
            checked={type === "month" ? true : false}
          >
            <span className="secundary-font text-size">
              Op basis van één maand
            </span>
          </Radio>
          <Radio 
            id="year"
            name="year"
            index="year"
            setIndex={setType}
            checked={type === "year" ? true : false}
          >
            <span className="secundary-font text-size">
              Op basis van één jaar
            </span>
          </Radio>
        </div>
        <div className="section-title margin-top-50">
          <h5>DETAILS INVOEREN</h5>
        </div>
        <div className="row justify-content-between">
          <div className="col-12 col-lg-8">
            <Inputfield 
              label="Titel"
              id="title"
              name="title"
              size="large"
              value={goal.title}
              changeInput={(e) => changeStates(e)}
            />
            <Textarea 
              label="Beschrijving"
              id="description"
              name="description"
              size="large"
              value={goal.description}
              changeInput={(e) => changeStates(e)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-12">
            <Datepicker 
              label="Startdatum" 
              startDate={form.start_date} 
              whenChanging={changeStartDate} 
            />
          </div>
          <div className="col-lg-4 col-12">
            <Datepicker 
              label="Einddatum" 
              startDate={form.end_date} 
              whenChanging={changeEndDate} 
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-12">
            <Distance 
              id="goal" 
              name="goal"
              defaultValue={form.goal}
              form={form}
              setForm={setForm}
            />
          </div>
        </div>
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
              message="Deze doelstelling kon niet worden aangemaakt."
            />
          )
        }
      <div className="d-flex justify-content-end margin-top-50">
        <StandardButton  
          text="Doelstelling bewerken"
          extraClasses="margin-right-10"
          action={uploadGoal}
        />
        <GreyButton
          text="Annuleren"
          action={() => history.push(Routes.GOALS)}
        />
      </div>
    </div>
  );
};