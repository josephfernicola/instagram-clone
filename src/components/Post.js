import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useLocation } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import CurrentPostComments from './CurrentPostComments';

const Post = (props) => {
  const { currentProfilePicture} = props;
  const [userFullNameOnPost, setUserFullNameOnPost] = useState();
  const [userFullUsernameOnPost, setUserFullUsernameOnPost] = useState();
  const [currentPostComments, setCurrentPostComments] = useState();
  const [currentPostCaption, setCurrentPostCaption] = useState();
  const [currentPostURL, setCurrentPostURL] = useState();
  const location = useLocation();

  useEffect(() => {
    const users = getFirestore();
    const usersRef = collection(users, "users");
    getDocs(usersRef)
      .then((snapshot) => {
        let users = [];
        snapshot.docs.forEach((doc) => {
          users.push({ ...doc.data(), id: doc.id });
        });
        users.forEach((user) => {
          if (location.pathname.includes(user.uid)) {
              setUserFullNameOnPost(user.name);
              setUserFullUsernameOnPost(user.username);
              console.log(user.posts)
              user.posts.forEach((post) => {
                if (post.image === location.state.image) {
                    setCurrentPostCaption(post.caption)
                    setCurrentPostComments(post.comments)
                }
              })
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [])
 //console.log(currentPostComments)
  return (
    <div className="postPageContainer">
      <div className="individualPostContainer">
        <div className="leftSideImage">
          <img
            src={location.state.image}
            alt="Current Post"
            className="currentPost"
          ></img>
        </div>
        <div className="rightSideComments">
          <div className="userFullNameOnPost">{userFullNameOnPost}</div>
          <div className="userFullUsernameOnPost">{userFullUsernameOnPost}</div>
          <div className="currentPostCaption">{currentPostCaption}</div>
          <div className="currentPostComments"><CurrentPostComments currentPostComments={currentPostComments}/></div>
        </div>
      </div>
    </div>
  );
};

export default Post;

//loop through user posts and match the id to the current link to display the photo
