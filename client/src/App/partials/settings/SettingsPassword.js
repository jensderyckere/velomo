import React, { useState } from 'react';

// Components
import { Inputfield, Message, StandardButton } from '../../components';

// Services
import { useAuth } from '../../services';

export const SettingsPassword = ({ user }) => {
  const { currentUser, editPassword } = useAuth();

  const [ error, setError ] = useState({
    visible: false,
    text: '',
  });

  const [ saved, setSaved ] = useState(false);

  const [ fields, setFields ] = useState({
    "password": user.password,
  });

  const changeFields = (e) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  };

  const submitEdit = async () => {
    if (fields.password.length < 8) {
      setError({
        visible: true,
        message: "Dit wachtwoord is niet geldig",
      });

      return;
    };

    const res = await editPassword(currentUser, {
      password: fields.password,
    });

    if (!res) {
      setError({
        visible: true,
        message: "Dit wachtwoord is niet geldig",
      });

      return;
    };

    setSaved(true);
    window.location.reload();
  };

  return (
    <>
      <h1 className="secundary-font title-size bold-font">
        Wachtwoord aanpassen
      </h1>
      <div className="section-title">
        <h5>Wachtwoord</h5>
      </div>
      <div className="row">
        <div className="col-md-8 col-12">
          <Inputfield 
            label="Wachtwoord"
            name="password"
            type="password"
            id="password"
            value={user.email}
            size="large"
            changeInput={(e) => changeFields(e)}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-8 col-12">
          <div className={`d-flex ${saved ? 'justify-content-between' : error.visible ? 'justify-content-between' : 'justify-content-end'} margin-top-30`}>
            {
              error.visible && (
                <Message 
                  error={true}
                  message={error.text}
                />
              )
            }
            {
              saved && (
                <Message
                  error={false}
                  message="Jouw wijzigingen zijn opgeslagen."
                />
              )
            }
            <StandardButton 
              text="Bewaar wijzigingen"
              action={() => submitEdit()}
            />
          </div>
        </div>
      </div>
    </>
  );
};
