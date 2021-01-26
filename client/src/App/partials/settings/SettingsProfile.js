import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

// Components
import { DeleteButton, GreyButton, ImageUrl, Inputfield, Message, StandardButton, Textarea } from '../../components';

// Images
import DefaultUser from '../../assets/icons/user.svg';
import DefaultCover from '../../assets/images/cover_default.jpg';

// Routes
import * as Routes from '../../routes';

// Services
import { useApi, useAuth } from '../../services';

export const SettingsProfile = ({ user }) => {
  const { currentUser, editProfile } = useAuth();
  const { uploadPicture } = useApi();

  const [ defaultImage, setDefaultImage ] = useState(ImageUrl(user.profile.avatar, DefaultUser));
  const [ defaultTeamCover, setDefaultTeamCover ] = useState(user.role === 'club' && ImageUrl(user.club.cover, DefaultCover));

  const [ uploadedAvatar, setUploadedAvatar ] = useState();
  const [ uploadedCover, setUploadedCover ] = useState();

  const [ error, setError ] = useState({
    visible: false,
    text: '',
  });

  const [ saved, setSaved ] = useState(false);

  const [ fields, setFields ] = useState({
    'avatar': defaultImage,
    'firstName': user.firstName ? user.firstName : '',
    'lastName': user.lastName ? user.lastName : '',
    'bio': user.profile.bio ? user.profile.bio : '',
    '_clubId': user.role === 'cyclist' ? user.cyclist._clubId : user.role === 'member' ? user.member._clubId : null,
    'name': user.role === 'club' ? user.club.name ? user.club.name : '' : '',
    'location': user.role === 'club' ? user.club.location ? user.club.location : '' : '',
    'cover': defaultTeamCover,
  });

  const changeImage = (e) => {
    const file = e.target.files[0];
    const output = URL.createObjectURL(file);

    setDefaultImage(output);
    setUploadedAvatar(e.target.files[0]);
  };

  const changeCover = (e) => {
    const file = e.target.files[0];
    const output = URL.createObjectURL(file);

    setDefaultTeamCover(output);
    setUploadedCover(e.target.files[0]);
  };

  const changeFields = (e) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  };

  const submitEdit = async () => {
    if (fields.firstName.length === 0) setError({visible: true, message: "Gelieve een voornaam in te vullen"});
    if (fields.lastName.length === 0) setError({visible: true, message: "Gelieve een achternaam in te vullen"});

    let result;
    let avatar;
    let cover;

    if (uploadedAvatar) {
      const res = await uploadPicture(currentUser, uploadedAvatar);
      avatar = res.filename;
    } else {
      avatar = user.profile.avatar;
    };

    if (uploadedCover) {
      const res = await uploadPicture(currentUser, uploadedCover);
      cover = res.filename;
    } else {
      cover = user.club.cover;
    };

    switch (user.role) {
      case "club":
        result = await editProfile(currentUser, {
          name: fields.name,
          location: fields.location,
          cover: cover,
          avatar: avatar,
          bio: fields.bio,
          firstName: fields.firstName,
          lastName: fields.lastName,
        });
        break;
      case "clubmember":
        result = await editProfile(currentUser, {
          _clubId: fields._clubId,
          avatar: avatar,
          bio: fields.bio,
          firstName: fields.firstName,
          lastName: fields.lastName,
        });
        break;
      case "cyclist":
        result = await editProfile(currentUser, {
          _clubId: fields._clubId,
          avatar: avatar,
          bio: fields.bio,
          firstName: fields.firstName,
          lastName: fields.lastName,
        });
        break;
      case "parent":
        result = await editProfile(currentUser, {
          avatar: avatar,
          bio: fields.bio,
          firstName: fields.firstName,
          lastName: fields.lastName,
        });
        break;
      default:
        break;
    };

    if (!result) {
      setError({
        visible: true,
        text: 'Jouw wijzigingen konden niet worden opgeslagen.'
      });
      setSaved(false);

      return;
    };

    window.location.reload();
  };

  return (
    <>
      <h1 className="secundary-font title-size bold-font">
        Jouw profiel wijzigen
      </h1>
      <div className="section-title">
        <h5>Over mij</h5>
      </div>
      <div className="row">
        <div className="col-12 d-flex align-items-center margin-bottom-30">
          <div className="avatar avatar-big" style={{
            backgroundImage: `url(${defaultImage ? defaultImage : ImageUrl(defaultImage, DefaultUser)})`
          }}></div>
          <div className="d-flex align-items-center margin-left-30">
            <div className="input-file">
              <input type="file" onChange={(e) => changeImage(e)} accept="image/x-png,image/gif,image/jpeg" />
              <StandardButton 
                text="Aanpassen"
              />
            </div>
            <GreyButton 
              action={() => setDefaultImage(null)}
              extraClasses="margin-left-10"
              text="Verwijderen"
            />
          </div>
        </div>
      </div>
        {
          user.role === 'club' && (
            <div className="row">
              <div className="col-12 col-md-8">
                <div style={{
                  backgroundImage: `url(${defaultTeamCover ? defaultTeamCover : ImageUrl(defaultTeamCover, DefaultCover)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  width: '100%',
                  height: '200px',
                }}>
                </div>
                <div className="d-flex align-items-center margin-top-20">
                  <div className="input-file">
                    <input type="file" onChange={(e) => changeCover(e)} accept="image/x-png,image/gif,image/jpeg" />
                    <StandardButton 
                      text="Aanpassen"
                    />
                  </div>
                  <GreyButton 
                    action={() => setDefaultTeamCover(null)}
                    extraClasses="margin-left-10"
                    text="Verwijderen"
                  />
                </div>
              </div>
            </div>
          )
        }
      <div className="row margin-top-50">
        <div className="col-12 col-md-4">
          <Inputfield 
            label="Voornaam *"
            name="firstName"
            id="firstName"
            value={user.firstName}
            size="large"
            changeInput={(e) => changeFields(e)}
          />
        </div>
        <div className="col-12 col-md-4">
          <Inputfield 
            label="Achternaam *"
            name="lastName"
            id="lastName"
            value={user.lastName}
            size="large"
            changeInput={(e) => changeFields(e)}
          />
        </div>
        {
          user.role === 'club' && (
            <div className="row">
              <div className="col-12 col-md-8">
                <Inputfield 
                  id="name"
                  name="name"
                  value={user.club.name}
                  label="Clubnaam"
                  size="large"
                  changeInput={(e) => changeFields(e)}
                />
              </div>
            </div>
          )
        }
        {
          user.role === 'club' && (
            <div className="row">
              <div className="col-12 col-md-8">
                <Inputfield 
                  id="location"
                  name="location"
                  value={user.club.location}
                  label="Locatie"
                  size="large"
                  changeInput={(e) => changeFields(e)}
                />
              </div>
            </div>
          )
        }
        <div className="col-12 col-md-8">
          <Textarea 
            label="Biografie"
            name="bio"
            id="bio"
            value={user.profile.bio}
            changeInput={(e) => changeFields(e)}
          />
        </div>
      </div>
      {
        user.role === 'cyclist' && (
          <>
          <div className="section-title">
            <h5>Mijn club</h5>
          </div>
          {
            fields._clubId ? (
              <div className="d-flex align-items-center">
                <div className="avatar avatar-big" style={{
                  backgroundImage: `url(${ImageUrl(fields._clubId._userId.profile.avatar, DefaultUser)})`
                }}>
                </div>
                <div className="margin-left-30">
                  <h6 className="secundary-font bold-font text-size margin-0">{!fields._clubId._userId.club.name ? 'Onbekende naam' : fields._clubId._userId.club.name}</h6>
                  <DeleteButton 
                    firstText="Ontkoppelen"
                    action={() => setFields({...fields, _clubId: false})}
                  />
                </div>
              </div>
            ) : (
              <p className="tertiary-font text-size">
                Je bent nog niet aangesloten bij een club. Je kan dit doen door naar <NavLink to={Routes.ADD_CONNECTION}>deze pagina</NavLink> te gaan.
              </p>
            )
          }
          </>
        )
      }
      {
        user.role === 'member' && (
          <>
          <div className="section-title">
            <h5>Mijn club</h5>
          </div>
          {
            user.cyclist._clubId ? (
              <div className="d-flex align-items-center">
                <div className="avatar avatar-big" style={{
                  backgroundImage: `url(${ImageUrl(user.member._clubId._userId.profile.avatar, DefaultUser)})`
                }}>
                </div>
                <div className="margin-left-30">
                  <h6 className="secundary-font bold-font text-size margin-0">{!user.member._clubId._userId.club.name ? 'Onbekende naam' : user.member._clubId._userId.club.name}</h6>
                  <DeleteButton 
                    firstText="Ontkoppelen"
                    action={() => setFields({...fields, _clubId: false})}
                  />
                </div>
              </div>
            ) : (
              <p className="tertiary-font text-size">
                Je bent nog niet aangesloten bij een club. Je kan dit doen door naar <NavLink to={Routes.ADD_CONNECTION}>deze pagina</NavLink> te gaan.
              </p>
            )
          }
          </>
        )
      }
      <div className="row">
        <div className="col-12 col-md-8">
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
  )
};