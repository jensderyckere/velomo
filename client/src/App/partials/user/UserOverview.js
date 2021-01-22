import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { StandardButton } from '../../components';
import { ShortUserView } from './ShortUserView';

export const UserOverview = ({ user, cyclists, members, cred, screenSize }) => {
  const history = useHistory();
  
  const [ switchTarget, setSwitchTarget ] = useState(true);
  const [ paginateIndex, setPaginateIndex ] = useState(2);

  const ClubOverview = () => {
    return (
      <div className={`user-overview ${screenSize === 'lg' || screenSize === 'xl' ? '' : 'margin-top-50'}`}>
        <div className="user-overview__top d-flex justify-content-between align-items-center">
          <div className="user-overview__top--left">
            <h2 className="secundary-font title-size bold-font">Verbonden {switchTarget ? 'renners' : 'staff'}</h2>
            <span className="user-overview__top--left--switch d-flex align-items-end user-over">
              <strong className={`secundary-font subtitle-size font-bold ${switchTarget ? 'orange-color': 'darkgrey-color'}`} onClick={() => setSwitchTarget(true)}>
                  Renners
              </strong> 
              <strong className={`${switchTarget ? 'darkgrey-color': 'orange-color'}`} onClick={() => setSwitchTarget(false)}>
                  Staff
              </strong> 
            </span>
          </div>
          <div className="user-overview__top--right d-flex justify-content-end align-items-center">
            <StandardButton 
              text={`${switchTarget ? 'Renner' : 'Staff'} toevoegen`}
            />
          </div>
        </div>
        <div className="user-overview__content">
          {
            switchTarget ? (
              cyclists && cyclists.length !== 0 ? cyclists.map((cyclist, index) => {
                return index > paginateIndex-3 && index <= paginateIndex && (
                  <div key={index} className="user-overview__content--user">
                    <ShortUserView 
                      user={cyclist._userId}
                      cred={true}
                    />
                    <hr className="standard-hr" />
                  </div>
                )
              }) : <p className="none">Er zijn nog geen renners toegevoegd! Je kan renners toevoegen via bovenstaande knop.</p>
            ) : (
              members && members.length !== 0 ? members.map((member, index) => {
                return index > paginateIndex-3 && index <= paginateIndex && (
                  <div key={index} className="user-overview__content--user">
                    <ShortUserView 
                      user={member._userId}
                      cred={true}
                    />
                    <hr className="standard-hr" />
                  </div>
                )
              }) : <p className="none">Er zijn nog geen staffleden toegevoegd! Je kan staffleden toevoegen via bovenstaande knop.</p>
            )
          }
          {
            switchTarget ? cyclists.length > 3 && (
              <div className="d-flex p-relative user-overview__content--paginate-wrapper">
                <>
                  {
                    paginateIndex-3 > -1 && (
                      <span className="user-overview__content--paginate previous-paginate secundary-font bold-font text-size" onClick={() => setPaginateIndex(paginateIndex-3)}>Vorige</span>
                    )
                  }
                </>
                <>
                  {
                    paginateIndex < cyclists.length && (
                      <span className="user-overview__content--paginate next-paginate secundary-font bold-font text-size" onClick={() => setPaginateIndex(paginateIndex+3)}>Volgende</span>
                    )
                  }
                </>
              </div>
            ) : members.length > 3 && (
              <div className="d-flex p-relative user-overview__content--paginate-wrapper">
                <>
                  {
                    paginateIndex-3 > -1 && (
                      <span className="user-overview__content--paginate previous-paginate secundary-font bold-font text-size" onClick={() => setPaginateIndex(paginateIndex-3)}>Vorige</span>
                    )
                  }
                </>
                <>
                  {
                    paginateIndex < cyclists.length && (
                      <span className="user-overview__content--paginate next-paginate secundary-font bold-font text-size" onClick={() => setPaginateIndex(paginateIndex+3)}>Volgende</span>
                    )
                  }
                </>
              </div>
            )
          }
        </div>
      </div>
    );
  };

  const OnlyCyclistsOverview = () => {
    return (
      <div className={`user-overview ${screenSize === 'lg' || screenSize === 'xl' ? '' : 'margin-top-50'}`}>
      <div className="user-overview__top d-flex justify-content-between align-items-center">
        <div className="user-overview__top--left">
          <h2 className="secundary-font title-size bold-font">Verbonden {switchTarget ? 'renners' : 'staff'}</h2>
        </div>
        <div className="user-overview__top--right d-flex justify-content-end align-items-center">
          <StandardButton 
            text={`Renner toevoegen`}
          />
        </div>
      </div>
      <div className="user-overview__content">
        {
          switchTarget && (
            cyclists && cyclists.length !== 0 ? cyclists.map((cyclist, index) => {
              return index > paginateIndex-3 && index <= paginateIndex && (
                <div key={index} className="user-overview__content--user">
                  <ShortUserView 
                    user={cyclist._userId}
                    cred={true}
                  />
                  <hr className="standard-hr" />
                </div>
              )
            }) : <p className="none">Er zijn nog geen renners toegevoegd! Je kan renners toevoegen via bovenstaande knop.</p>
          ) 
        }
        {
          cyclists.length > 3 && (
            <div className="d-flex p-relative user-overview__content--paginate-wrapper">
              <>
                {
                  paginateIndex-3 > -1 && (
                    <span className="user-overview__content--paginate previous-paginate secundary-font bold-font text-size" onClick={() => setPaginateIndex(paginateIndex-3)}>Vorige</span>
                  )
                }
              </>
              <>
                {
                  paginateIndex < cyclists.length && (
                    <span className="user-overview__content--paginate next-paginate secundary-font bold-font text-size" onClick={() => setPaginateIndex(paginateIndex+3)}>Volgende</span>
                  )
                }
              </>
            </div>
          )
        }
      </div>
    </div>
    )
  };

  return (
    <>
    {
      user.role === 'club' && (
        <ClubOverview />
      )
    }
    {
      user.role === 'parent' && (
        <OnlyCyclistsOverview />
      )
    }
    {
      user.role === 'clubmember' && (
        <OnlyCyclistsOverview />
      )
    }
    </>
  );
};
