import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

// Services
import { useApi, useAuth } from '../../services';

// Images
import DefaultUser from '../../assets/icons/user.svg';

// Components
import { DateText, EditSVG, GreyButton, ImageUrl, Message, SlugText, StandardButton, TimeText, TrashSVG } from '../../components';

// Routes
import * as Routes from '../../routes';

export const Comments = ({ event, user }) => {
  // Routing
  const history = useHistory();

  // States
  const [ comments, setComments ] = useState([]);
  const [ newComment, setNewComment ] = useState('');
  const [ error, setError ] = useState(false);

  // Services
  const { getComments, createComment, editComment, deleteComment } = useApi();
  const { currentUser } = useAuth();

  // Fetch comments
  const fetchData = useCallback(async () => {
    const commentsData = await getComments(currentUser, event._id);
    setComments(commentsData);
  }, [getComments, currentUser, event]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh states
  const refreshComments = async () => {
    const commentsData = await getComments(currentUser, event._id);
    setComments(commentsData);
  };

  // Place comment
  const placeNewComment = async () => {
    if (newComment.length === 0) {
      setError(true);
      return;
    };

    setError(false);
    await createComment(currentUser, event._id, {text: newComment});
    document.getElementById("reaction").value = '';
    refreshComments();
  };

  const Comment = ({ content }) => {
    // States
    const [ edit, setEdit ] = useState(false);
    const [ editText, setEditText ] = useState(content.text);

    const deleteYourComment = async () => {
      await deleteComment(currentUser, content._id);
      refreshComments();
    };

    const editYourComment = async () => {
      await editComment(currentUser, content._id, {text: editText});
      setEdit(false);
      setEditText('');
      refreshComments();
    };

    return (
      <div className="comments__item">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div className="avatar avatar-standard margin-right-20 pointer" onClick={() => history.push(Routes.PROFILE.replace(':name', SlugText(content.commenterId.firstName + ' ' + content.commenterId.lastName)).replace(':id', content.commenterId._id))} style={{
              backgroundImage: `url(${ImageUrl(content.commenterId.profile.avatar, DefaultUser)})`
            }}></div>
            <div className="flex-1">
              <h6 className="secundary-font text-size bold-font margin-0">{content.commenterId.firstName + ' ' + content.commenterId.lastName}</h6>
              {
                edit ? (
                  <div className="d-flex align-items-center justify-content-between comments__edit margin-top-10">
                    <input type="text" id="edit_reaction" defaultValue={editText} onChange={(e) => setEditText(e.target.value)} className="comments__field" />
                    <StandardButton text="Bewerk" extraClasses="margin-right-10" action={editYourComment} />
                    <GreyButton text="Annuleer" action={() => setEdit(false)} />
                  </div>
                ) : (
                  <p className="tertiary-font text-size light-font margin-0">{content.text}</p>
                )
              }
            </div>
          </div>
          {
            !edit && user._id === content.commenterId._id && (
              <div className="d-flex align-items-center justify-content-between comments__item--actions">
                <span onClick={() => setEdit(true)}>
                  <EditSVG />
                </span>
                <span onClick={() => deleteYourComment()}>
                  <TrashSVG />
                </span>
              </div>
            )
          }
        </div>
        <div className="d-flex justify-content-end">
          <span className="smallest-size light-font">
            Geplaatst op {DateText(content.createdAt)} om {TimeText(content.createdAt)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="row margin-top-50">
      <div className="col-lg-8 col-12">
        <h2 className="secundary-font subtitle-size bold-font">
          Reactie's op dit evenement
        </h2>
        <div className="comments">
          {
            comments.length !== 0 ? comments.map((item, index) => {
              return <Comment content={item} key={index} />
            }) : (
              <span className="secundary-font light-font text-size">
                Er zijn nog geen reactie's geplaatst.
              </span>
            )
          }
          <div className="comments__place d-flex justify-content-between align-items-center margin-top-30">
            <div className="avatar avatar-small margin-right-20" style={{
              backgroundImage: `url(${ImageUrl(user.profile.avatar, DefaultUser)})`
            }}></div>
            <input type="text" id="reaction" onChange={(e) => setNewComment(e.target.value)} className="comments__field" />
            <StandardButton text="Plaats reactie" action={placeNewComment} />
          </div>
          <div className="margin-top-20">
            {
              error && (
                <Message error={true} message="Deze reactie kon niet worden geplaatst. Probeer het opnieuw." />
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
};
