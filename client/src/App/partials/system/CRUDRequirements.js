import React, { useState } from 'react';

// Components
import { StandardButton, Textarea, Inputfield, GreyButton, Radio, Distance, Duration } from '../../components';

// Services
import { useApi, useAuth } from '../../services';

export const CRUDRequirements = ({ requirements, refresh }) => {
  // States
  const [ createView, setCreateView ] = useState(false);
  const [ editView, setEditView ] = useState(false);
  const [ form, setForm ] = useState({
    type: 'distance',
    title: '',
    description: '',
    distance: 0,
    duration: '00:00:00',
    goal_days: 0,
    goal_challenges: 0,
    goal_goals: 0,
    goal_events: 0,
  });

  // Services
  const { createRequirement, editRequirement, deleteRequirement } = useApi();
  const { currentUser } = useAuth();

  const createItem = async () => {
    await createRequirement(currentUser, {
      type: form.type,
      title: form.title,
      description: form.description,
      goal_distance: form.distance,
      goal_duration: form.duration,
      goal_days: form.goal_days,
      goal_challenges: form.goal_challenges,
      goal_goals: form.goal_goals,
      goal_events: form.goal_events,
    });

    refresh();
  };

  const deleteItem = async (id) => {
    await deleteRequirement(currentUser, id);

    refresh();
  };

  const editItem = async () => {
    await editRequirement(currentUser, {
      type: form.type,
      title: form.title,
      description: form.description,
      goal_distance: form.distance,
      goal_duration: form.duration,
      goal_days: form.goal_days,
      goal_challenges: form.goal_challenges,
      goal_goals: form.goal_goals,
      goal_events: form.goal_events,
    });

    setForm({
      type: 'distance',
      title: '',
      description: '',
      distance: 0,
      duration: '00:00:00',
      goal_days: 0,
      goal_challenges: 0,
      goal_goals: 0,
      goal_events: 0,
    });
    setEditView(false);

    refresh();
    return;
  };

  const setEdit = (requirement) => {
    setForm({
      type: requirement.type,
      title: requirement.title,
      description: requirement.description,
      distance: requirement.goal_distance,
      duration: requirement.goal_duration,
      goal_days: requirement.goal_days,
      goal_challenges: requirement.goal_challenges,
      goal_goals: requirement.goal_goals,
      goal_events: requirement.goal_events,
    });
    setEditView(true);
  };

  const cancelEdit = () => {
    setForm({
      type: 'distance',
      title: '',
      description: '',
      distance: 0,
      duration: '00:00:00',
      goal_days: 0,
      goal_challenges: 0,
      goal_goals: 0,
      goal_events: 0,
    });
    setEditView(false);
  };

  const RequirementItem = ({ requirement }) => {
    return (
      <div className="crud-system--item d-flex justify-content-between align-items-center">
        <span className="secundary-font text-size bold-font">
          {requirement.title}
        </span>
        <div className="d-flex align-items-center crud-system--item__buttons">
          <span className="margin-right-10" onClick={() => setEdit(requirement)}>
            <EditSVG />
          </span>
          <span onClick={() => deleteItem(requirement._id)}>
            <TrashSVG />
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="crud-system">
      {
        requirements.length === 0 ? (
          <span className="tertiary-font light-font text-size">
            Er zijn nog geen verplichtingen aangemaakt.
          </span>
        ) : (
          requirements.map((requirement, index) => {
            return <RequirementItem key={index} requirement={requirement} />
          })
        )
      }
      {
        editView ? (
          <div className="crud-system__form margin-top-30">
            <Inputfield 
              name="title"
              id="title"
              placeholder="Titel"
              label="Titel"
              size="large"
              value={form.title}
              changeInput={(e) => setForm({...form, title: e.target.value})}
            />
            <Textarea
              name="description"
              id="description"
              placeholder="Beschrijving"
              label="Beschrijving"
              value={form.description}
              changeInput={(e) => setForm({...form, description: e.target.value})}
            />
            <div className="crud-system__form--radio">
              <h6 className="secundary-font text-size bold-font margin-bottom-30">Type</h6>
              <Radio 
                id="distance"
                name="distance"
                index={"distance"}
                setIndex={setTypeTraining}
                checked={typeTraining === "distance" ? true : false}
              >
                <span className="secundary-font text-size">
                  Afstand
                </span>
              </Radio>
              <Radio 
                id="duration"
                name="duration"
                index={"duration"}
                setIndex={setTypeTraining}
                checked={typeTraining === "duration" ? true : false}
              >
                <span className="secundary-font text-size">
                  Duur
                </span>
              </Radio>
              <Radio 
                id="days"
                name="days"
                index={"days"}
                setIndex={setTypeTraining}
                checked={typeTraining === "days" ? true : false}
              >
                <span className="secundary-font text-size">
                  Dagen
                </span>
              </Radio>
              <Radio 
                id="challenges"
                name="challenges"
                index={"challenges"}
                setIndex={setTypeTraining}
                checked={typeTraining === "challenges" ? true : false}
              >
                <span className="secundary-font text-size">
                  Uitdagingen
                </span>
              </Radio>
              <Radio 
                id="goals"
                name="goals"
                index={"goals"}
                setIndex={setTypeTraining}
                checked={typeTraining === "goals" ? true : false}
              >
                <span className="secundary-font text-size">
                  Doelstellingen
                </span>
              </Radio>
              <Radio 
                id="events"
                name="events"
                index={"events"}
                setIndex={setTypeTraining}
                checked={typeTraining === "events" ? true : false}
              >
                <span className="secundary-font text-size">
                  Evenementen
                </span>
              </Radio>
            </div>
            {
              form.type === "distance" ? (
                <Distance 
                  id="duration"
                  name="duration"
                  form={form}
                  setForm={setForm}
                  defaultValue={form.distance}
                />
              ) : form.type === "duration" ? (
                <Duration 
                  changeFully={setForm}
                  form={form}
                  defaultHours={form.duration.split[0]}
                  defaultMinutes={form.duration.split[1]}
                  defaultSeconds={form.duration.split[2]}
                />
              ) : form.type === "days" ? (
                <Inputfield 
                  name="days"
                  id="days"
                  placeholder="Dagen"
                  label="Dagen"
                  size="large"
                  value={form.goal_days}
                  changeInput={(e) => setForm({...form, goal_days: e.target.value})}
                />
              ) : form.type === "challenges" ? (
                <Inputfield 
                  name="challenges"
                  id="challenges"
                  placeholder="Uitdagingen"
                  label="Uitdagingen"
                  size="large"
                  value={form.goal_challenges}
                  changeInput={(e) => setForm({...form, goal_challenges: e.target.value})}
                />
              ) : form.type === "goals" ? (
                <Inputfield 
                  name="goals"
                  id="goals"
                  placeholder="Doelstellingen"
                  label="Doelstellingen"
                  size="large"
                  value={form.goal_goals}
                  changeInput={(e) => setForm({...form, goal_goals: e.target.value})}
                />
              ) : form.type === "events" ? (
                <Inputfield 
                  name="events"
                  id="events"
                  placeholder="Evenementen"
                  label="Evenementen"
                  size="large"
                  value={form.goal_goals}
                  changeInput={(e) => setForm({...form, goal_events: e.target.value})}
                />
              ) : ''
            }
            <div className="justify-content-end d-flex margin-top-20">
              <StandardButton 
                text="Bewerk verplichting"
                action={() => editItem()}
              />
              <GreyButton 
                action={() => cancelEdit()}
                extraClasses="margin-left-10"
                text="Annuleren"
              />
            </div>
          </div>
        ) : createView ? (
          <div className="crud-system__form margin-top-30">
            <Inputfield 
              name="title"
              id="title"
              placeholder="Titel"
              label="Titel"
              size="large"
              changeInput={(e) => setForm({...form, title: e.target.value})}
            />
            <Textarea
              name="description"
              id="description"
              placeholder="Beschrijving"
              label="Beschrijving"
              changeInput={(e) => setForm({...form, description: e.target.value})}
            />
            <div className="crud-system__form--radio">
              <h6 className="secundary-font text-size bold-font margin-bottom-30">Type</h6>
              <Radio 
                id="distance"
                name="distance"
                index={"distance"}
                setIndex={setTypeTraining}
                checked={typeTraining === "distance" ? true : false}
              >
                <span className="secundary-font text-size">
                  Afstand
                </span>
              </Radio>
              <Radio 
                id="duration"
                name="duration"
                index={"duration"}
                setIndex={setTypeTraining}
                checked={typeTraining === "duration" ? true : false}
              >
                <span className="secundary-font text-size">
                  Duur
                </span>
              </Radio>
              <Radio 
                id="days"
                name="days"
                index={"days"}
                setIndex={setTypeTraining}
                checked={typeTraining === "days" ? true : false}
              >
                <span className="secundary-font text-size">
                  Dagen
                </span>
              </Radio>
              <Radio 
                id="challenges"
                name="challenges"
                index={"challenges"}
                setIndex={setTypeTraining}
                checked={typeTraining === "challenges" ? true : false}
              >
                <span className="secundary-font text-size">
                  Uitdagingen
                </span>
              </Radio>
              <Radio 
                id="goals"
                name="goals"
                index={"goals"}
                setIndex={setTypeTraining}
                checked={typeTraining === "goals" ? true : false}
              >
                <span className="secundary-font text-size">
                  Doelstellingen
                </span>
              </Radio>
              <Radio 
                id="events"
                name="events"
                index={"events"}
                setIndex={setTypeTraining}
                checked={typeTraining === "events" ? true : false}
              >
                <span className="secundary-font text-size">
                  Evenementen
                </span>
              </Radio>
            </div>
            {
              form.type === "distance" ? (
                <Distance 
                  id="duration"
                  name="duration"
                  form={form}
                  setForm={setForm}
                />
              ) : form.type === "duration" ? (
                <Duration 
                  changeFully={setForm}
                  form={form}
                  defaultHours={form.duration.split[0]}
                  defaultMinutes={form.duration.split[1]}
                  defaultSeconds={form.duration.split[2]}
                />
              ) : form.type === "days" ? (
                <Inputfield 
                  name="days"
                  id="days"
                  placeholder="Dagen"
                  label="Dagen"
                  size="large"
                  changeInput={(e) => setForm({...form, goal_days: e.target.value})}
                />
              ) : form.type === "challenges" ? (
                <Inputfield 
                  name="challenges"
                  id="challenges"
                  placeholder="Uitdagingen"
                  label="Uitdagingen"
                  size="large"
                  changeInput={(e) => setForm({...form, goal_challenges: e.target.value})}
                />
              ) : form.type === "goals" ? (
                <Inputfield 
                  name="goals"
                  id="goals"
                  placeholder="Doelstellingen"
                  label="Doelstellingen"
                  size="large"
                  changeInput={(e) => setForm({...form, goal_goals: e.target.value})}
                />
              ) : form.type === "events" ? (
                <Inputfield 
                  name="events"
                  id="events"
                  placeholder="Evenementen"
                  label="Evenementen"
                  size="large"
                  changeInput={(e) => setForm({...form, goal_events: e.target.value})}
                />
              ) : ''
            }
            <div className="justify-content-end d-flex margin-top-20">
              <StandardButton 
                text="Maak verplichting"
                action={() => createItem()}
              />
              <GreyButton 
                action={() => setCreateView(false)}
                extraClasses="margin-left-10"
                text="Annuleren"
              />
            </div>
          </div>
        ) : (
          <div className="justify-content-end d-flex margin-top-50">
            <StandardButton 
              text="Maak verplichting"
              action={() => setCreateView(true)}
            />
          </div>
        )
      }
    </div>
  )
};
