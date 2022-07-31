import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useLocation } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import CurrentPostComments from "./CurrentPostComments";

const Post = (props) => {
  const { currentProfilePicture, setCurrentProfilePicture } = props;
  const [userFullNameOnPost, setUserFullNameOnPost] = useState();
  const [userFullUsernameOnPost, setUserFullUsernameOnPost] = useState();
  const [currentPostComments, setCurrentPostComments] = useState();
  const [currentPostCaption, setCurrentPostCaption] = useState();
  const [currentPostURL, setCurrentPostURL] = useState();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    async function loadUserData() {
      const users = await getFirestore();
      const usersRef = await collection(users, "users");
      getDocs(usersRef)
        .then((snapshot) => {
          let users = [];
          snapshot.docs.forEach((doc) => {
            users.push({ ...doc.data(), id: doc.id });
          });
          users.forEach((user) => {
            if (location.pathname.includes(user.uid)) {
              setLoading(false);
              setUserFullNameOnPost(user.name);
              setUserFullUsernameOnPost(user.username);
              setCurrentProfilePicture(
                <img
                  src={user.photoURL}
                  alt="Default Profile"
                  className="postPageProfilePic"
                ></img>
              );
              user.posts.forEach((post) => {
                if (post.image === location.state.image) {
                  setCurrentPostCaption(post.caption);
                  setCurrentPostComments(post.comments);
                }
              });
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    loadUserData();
  }, []);

  if (!loading) {
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
            <div className="posterNameAndCaption">
              <div className="imageAndName">
                {currentProfilePicture}
                <div className="nameAndUsername">
                  <div className="userFullNameOnPost">{userFullNameOnPost}</div>
                  <div className="userFullUsernameOnPost">
                    @{userFullUsernameOnPost}
                  </div>
                </div>
              </div>
              <div className="currentPostCaption">{currentPostCaption}</div>
            </div>
            <div className="currentPostComments">
              <CurrentPostComments currentPostComments={currentPostComments} />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Post;

//loop through user posts and match the id to the current link to display the photo
