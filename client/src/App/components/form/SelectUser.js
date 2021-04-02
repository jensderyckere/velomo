import React, { useState } from 'react';

// Components
import { ImageUrl } from '../text';

// Images
import DefaultUser from '../../assets/icons/user.svg';

export const SelectUser = ({ users, selectedUser, setSelectedUser }) => {
  // States
  const [ showList, setShowList ] = useState(false);
  const [ usersFiltered, setUsersFiltered ] = useState(users);

  // When typing
  const whenTyping = (e) => {
    if (e.target.value.length === 0) {
      setShowList(false);
    } else {
      setShowList(true);
    };

    let array = [];

    for (let user of users) {
      if (user._userId.firstName.toLowerCase().includes(e.target.value.toLowerCase()) || user._userId.lastName.toLowerCase().includes(e.target.value.toLowerCase())) {
        array.push(user);
      };
    };

    setUsersFiltered(array);
  };

  const selectUser = (e) => {
    setSelectedUser(e);
    setShowList(false);
    document.getElementById('select-user').value = e._userId.firstName + ' ' + e._userId.lastName; 
  };

  return usersFiltered ? (
    <div className="select-user">
      <label htmlFor="select-user">Selecteer een gebruiker</label>
      <div className="select-user__input d-flex align-items-center">
        {
          selectedUser && (
            <div className="avatar avatar-small" style={{
              backgroundImage: `url(${ImageUrl(selectedUser._userId.profile.avatar, DefaultUser)})`
            }}></div>
          )
        }
        <input type="text" defaultValue={selectedUser ? selectedUser._userId.firstName + ' ' + selectedUser._userId.lastName : ''} name="select-user" onChange={(e) => whenTyping(e)} id="select-user" />
      </div>
      {
        showList && (
          <div className="select-user__list">
          {
            usersFiltered.length !== 0 ? usersFiltered.map((user, index) => {
              return (
                <div className="select-user__list--option" onClick={() => selectUser(user)} key={index}>
                  <div className="avatar avatar-small" style={{
                    backgroundImage: `url(${ImageUrl(user._userId.profile.avatar, DefaultUser)})`
                  }}></div>
                  <h6 className="secundary-font text-size bold-font">
                    {user._userId.firstName + ' ' + user._userId.lastName}
                  </h6>
                </div>
              )
            }) : (
              <span className="tertiary-font light-font text-size">
                Er zijn geen gebruikers gevonden.
              </span>
            )
          }
          </div>
        )
      }
    </div>
  ) : '';
};
