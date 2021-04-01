import React, { useState } from 'react';

// Components
import { EditSVG, GreyButton, ImageUrl, Inputfield, StandardButton, Textarea, TrashSVG } from '../../components';

// Images
import DefaultUser from '../../assets/icons/user.svg';
import DefaultCover from '../../assets/images/cover_default.jpg';

// Services
import { useApi, useAuth } from '../../services';

export const CRUDRewards = ({ rewards, refresh }) => {
  // States
  const [ createView, setCreateView ] = useState(false);
  const [ editView, setEditView ] = useState(false);
  const [ form, setForm ] = useState({
    name: '',
    title: '',
    description: '',
    banner: '',
    avatar: '',
    needed_amount: '',
  });
  const [ defaultAvatar, setDefaultAvatar ] = useState();
  const [ defaultBanner, setDefaultBanner ] = useState();

  // Services
  const { createReward, uploadPicture, editReward, deleteReward } = useApi();
  const { currentUser } = useAuth();

  const changeAvatar = (e) => {
    const file = e.target.files[0];
    const output = URL.createObjectURL(file);

    setDefaultAvatar(output);
    setForm({...form, avatar: e.target.files[0]});
  };

  const changeBanner = (e) => {
    const file = e.target.files[0];
    const output = URL.createObjectURL(file);

    setDefaultBanner(output);
    setForm({...form, banner: e.target.files[0]});
  };

  const createItem = async () => {
    const avatar = await uploadPicture(currentUser, form.avatar);
    const banner = await uploadPicture(currentUser, form.banner);

    await createReward(currentUser, {
      name: form.name,
      title: form.title,
      description: form.description,
      avatar: avatar.filename,
      banner: banner.filename,
      needed_amount: Number(form.needed_amount),
    });

    refresh();
  };

  const deleteItem = async (id) => {
    await deleteReward(currentUser, id);

    refresh();
  };

  const editItem = async () => {
    if (defaultAvatar && defaultBanner) {
      const avatar = await uploadPicture(currentUser, form.avatar);
      const banner = await uploadPicture(currentUser, form.banner);

      await editReward(currentUser, {
        name: form.name,
        title: form.title,
        description: form.description,
        avatar: avatar.filename,
        banner: banner.filename,
        needed_amount: Number(form.needed_amount),
      });
      setForm({
        title: '',
        name: '',
        description: '',
        avatar: '',
        banner: '',
        needed_amount: ''
      });
      setEditView(false);
      setDefaultAvatar('');
      setDefaultBanner('');

      refresh();
      return;
    };

    if (defaultAvatar) {
      const avatar = await uploadPicture(currentUser, form.avatar);

      await editReward(currentUser, {
        name: form.name,
        title: form.title,
        description: form.description,
        avatar: avatar.filename,
        banner: form.banner,
        needed_amount: Number(form.needed_amount),
      });
      setForm({
        title: '',
        name: '',
        description: '',
        avatar: '',
        banner: '',
        needed_amount: ''
      });
      setEditView(false);
      setDefaultAvatar('');
      setDefaultBanner('');

      refresh();
      return;
    };

    if (defaultAvatar) {
      const banner = await uploadPicture(currentUser, form.banner);

      await editReward(currentUser, {
        name: form.name,
        title: form.title,
        description: form.description,
        avatar: form.avatar,
        banner: banner.filename,
        needed_amount: Number(form.needed_amount),
      });
      setForm({
        title: '',
        name: '',
        description: '',
        avatar: '',
        banner: '',
        needed_amount: ''
      });
      setEditView(false);
      setDefaultAvatar('');
      setDefaultBanner('');

      refresh();
      return;
    };
  };

  const setEdit = (reward) => {
    setForm({
      title: reward.title,
      name: reward.name,
      description: reward.description,
      avatar: reward.avatar,
      banner: reward.banner,
      needed_amount: reward.needed_amount
    });
    setEditView(true);
  };

  const cancelEdit = () => {
    setForm({
      title: '',
      name: '',
      description: '',
      avatar: '',
      banner: '',
      needed_amount: ''
    });
    setEditView(false);
    setDefaultAvatar('');
    setDefaultBanner('');
  };

  const RewardItem = ({ reward }) => {
    return (
      <div className="crud-system--item d-flex justify-content-between align-items-center">
        <span className="secundary-font text-size bold-font">
          {reward.title} | {reward.needed_amount} punten
        </span>
        <div className="d-flex align-items-center crud-system--item__buttons">
          <span className="margin-right-10" onClick={() => setEdit(reward)}>
            <EditSVG />
          </span>
          <span onClick={() => deleteItem(reward._id)}>
            <TrashSVG />
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="crud-system">
      {
        rewards.length === 0 ? (
          <span className="tertiary-font light-font text-size">
            Er zijn nog geen beloningen aangemaakt.
          </span>
        ) : (
          rewards.map((reward, index) => {
            return <RewardItem key={index} reward={reward} />
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
          <Inputfield 
            name="name"
            id="name"
            placeholder="Naam uitgever"
            label="Uitgever"
            size="large"
            value={form.name}
            changeInput={(e) => setForm({...form, name: e.target.value})}
          />
          <Inputfield 
            name="needed_amount"
            id="needed_amount"
            placeholder="Nodige punten"
            label="Nodige punten"
            size="large"   
            value={form.needed_amount}
            changeInput={(e) => setForm({...form, needed_amount: e.target.value})}           
          />
          <h6 className="secundary-font text-size bold-font margin-left-20 margin-top-30">
            Avatar
          </h6>
          <div className="change-image margin-top-20 d-flex align-items-center">
            <div className="avatar avatar-big" style={{
              backgroundImage: `url(${defaultAvatar ? defaultAvatar : ImageUrl(form.avatar, DefaultUser)})`
            }}></div>
            <div className="d-flex align-items-center margin-left-30">
              <div className="input-file">
                <input type="file" onChange={(e) => changeAvatar(e)} accept="image/x-png,image/gif,image/jpeg" />
                <StandardButton 
                  text="Aanpassen"
                />
              </div>
              <GreyButton 
                action={() => setDefaultAvatar(null)}
                extraClasses="margin-left-10"
                text="Verwijderen"
              />
            </div>
          </div>
          <h6 className="secundary-font text-size bold-font margin-left-20 margin-top-50">
            Banner
          </h6>
          <div className="change-image margin-top-20">
            <div style={{
              backgroundImage: `url(${defaultBanner ? defaultBanner : ImageUrl(form.avatar, DefaultCover)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              width: '100%',
              height: '200px',
            }}>
            </div>
            <div className="d-flex align-items-center margin-top-20">
              <div className="input-file">
                <input type="file" onChange={(e) => changeBanner(e)} accept="image/x-png,image/gif,image/jpeg" />
                <StandardButton 
                  text="Aanpassen"
                />
              </div>
              <GreyButton 
                action={() => setDefaultBanner(null)}
                extraClasses="margin-left-10"
                text="Verwijderen"
              />
            </div>
          </div>
          <div className="justify-content-end d-flex margin-top-20">
            <StandardButton 
              text="Pas beloning aan"
              action={() => editItem()}
            />
            <GreyButton 
              action={() => cancelEdit()}
              extraClasses="margin-left-10"
              text="Annuleren"
            />
          </div>
        </div>
        ) : (
          createView ? (
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
              <Inputfield 
                name="name"
                id="name"
                placeholder="Naam uitgever"
                label="Uitgever"
                size="large"
                changeInput={(e) => setForm({...form, name: e.target.value})}
              />
              <Inputfield 
                name="needed_amount"
                id="needed_amount"
                placeholder="Nodige punten"
                label="Nodige punten"
                size="large"   
                changeInput={(e) => setForm({...form, needed_amount: e.target.value})}           
              />
              <h6 className="secundary-font text-size bold-font margin-left-20 margin-top-30">
                Avatar
              </h6>
              <div className="change-image margin-top-20 d-flex align-items-center">
                <div className="avatar avatar-big" style={{
                  backgroundImage: `url(${defaultAvatar ? defaultAvatar : ImageUrl(defaultAvatar, DefaultUser)})`
                }}></div>
                <div className="d-flex align-items-center margin-left-30">
                  <div className="input-file">
                    <input type="file" onChange={(e) => changeAvatar(e)} accept="image/x-png,image/gif,image/jpeg" />
                    <StandardButton 
                      text="Aanpassen"
                    />
                  </div>
                  <GreyButton 
                    action={() => setDefaultAvatar(null)}
                    extraClasses="margin-left-10"
                    text="Verwijderen"
                  />
                </div>
              </div>
              <h6 className="secundary-font text-size bold-font margin-left-20 margin-top-50">
                Banner
              </h6>
              <div className="change-image margin-top-20">
                <div style={{
                  backgroundImage: `url(${defaultBanner ? defaultBanner : ImageUrl(defaultBanner, DefaultCover)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  width: '100%',
                  height: '200px',
                }}>
                </div>
                <div className="d-flex align-items-center margin-top-20">
                  <div className="input-file">
                    <input type="file" onChange={(e) => changeBanner(e)} accept="image/x-png,image/gif,image/jpeg" />
                    <StandardButton 
                      text="Aanpassen"
                    />
                  </div>
                  <GreyButton 
                    action={() => setDefaultBanner(null)}
                    extraClasses="margin-left-10"
                    text="Verwijderen"
                  />
                </div>
              </div>
              <div className="justify-content-end d-flex margin-top-20">
                <StandardButton 
                  text="Maak beloning"
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
                text="Maak beloning"
                action={() => setCreateView(true)}
              />
            </div>
          ) 
        )
      }
    </div>
  );
};
