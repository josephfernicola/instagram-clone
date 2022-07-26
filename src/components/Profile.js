import { useLocation } from "react-router-dom";

function Profile(props) {
  const {
    bio,
    setBio,
    currentProfilePicture,
    setCurrentProfilePicture,
    setCurrentProfilePicURL,
    currentCoverPhoto,
    setCurrentCoverPhoto,
    currentCoverPhotoURL,
    setCurrentCoverPhotoURL,
    setUsername,
    setFollowing,
    setFollowers,
    postNumber,
    followers,
    following,
    setFullName,
    setPostNumber,
    fullName,
    username,
    profileButtons,
    setProfileButtons,
  } = props;
  const location = useLocation();



  return (
    <div className="profileContainer">
      <div className="upperContainer">
        <div className="profileCoverPhotoContainer">{currentCoverPhoto}</div>
        <div className="userInfoAndPostContainer">
          <div className="profileInfoLeft">
            {currentProfilePicture}
            <div className="name">
              <div className="fullName">{fullName}</div>
              <div className="username">@{username}</div>
            </div>
            <div>{postNumber} posts</div>
            <div className="followersAndFollowingContainter">
              <div className="followingOnProfile">{following} Following</div>
              <div className="followersOnProfile">{followers} Followers</div>
            </div>
            <div className="bioContainer">
              <div className="bioTitle">Bio</div>
              <div className="bioDescription">{bio}</div>
            </div>
          </div>
          <div className="profilePostContainer"></div>
        </div>
      </div>
      <div className="profileButtons">{profileButtons}</div>
    </div>
  );
}

export default Profile;
