import React from 'react';
import { 
  useHistory 
} from 'react-router';

// Components
import { 
  DateText,
  ImageUrl, 
  SlugText 
} from '../../components';

// Images
import DefaultUser from '../../assets/icons/user.svg';

// Routes
import * as Routes from '../../routes';

export const NotificationsOverview = ({ 
  notifications 
}) => {
  // Routing
  const history = useHistory();

  const Notification = ({ 
    content 
  }) => {
    return (
      <div className={`notifications__item${content.viewed ? '-seen' : '-unseen'} d-flex align-items-center margin-bottom-10`}>
        <div className="avatar avatar-big pointer" onClick={() => history.push(Routes.PROFILE.replace(':name', SlugText(content._senderId.firstName + ' '+ content._senderId.lastName)).replace(':id', content._senderId._id))} style={{
          backgroundImage: `url(${ImageUrl(content._senderId.profile.avatar, DefaultUser)})`
        }}></div>
        <div className="margin-left-20">
          <span className="bold-font text-size secundary-font hover-text pointer">
            {
              content._senderId.role === 'club' ? (
                content._senderId.club.name
              ) : (
                content._senderId.firstName + ' '+ content._senderId.lastName
              )
            }
          </span>
          <span className="text-size tertiary-font light-font hover-text pointer" onClick={() => history.push(content.path)}>
            {content.text}
          </span>
          <div className="margin-top-20">
            {DateText(content._createdAt)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="notifications">
      <h3 className="secundary-font title-size bold-font">
        Meldingen
      </h3>
      <div className="margin-top-30">
        {
          notifications.length !== 0 ? notifications.map((notification, index) => {
            return <Notification 
              key={index} 
              content={notification} 
            />
          }) : (
            <span className="tertiary-font light-font text-size">Er zijn nog geen meldingen voor jou.</span>
          )
        }
      </div>
    </div>
  );
};