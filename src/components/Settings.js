import { getAuth } from "firebase/auth";
import { useEffect, useRef } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Settings(props) {
  const {
    username,
    setUsername,
    bio,
    setBio,
    fullName,
    setFullName,
    currentProfilePicture,
    setCurrentProfilePicture,
    currentCoverPhoto,
    setCurrentCoverPhoto,
    currentCoverPhotoURL,
    setCurrentCoverPhotoURL,
    currentProfilePicURL,
    setCurrentProfilePicURL,
  } = props;

  const inputProfilePicRef = useRef(null);
  const inputCoverPhotoRef = useRef(null);
  // Create a root reference
  const storage = getStorage();

  useEffect(() => {
    console.log(currentProfilePicture);
  }, []);

  const handleCoverPhotoClick = () => {
    // open file input box on click of other element
    inputCoverPhotoRef.current.click();
  };
  const handleProfilePicClick = () => {
    // open file input box on click of other element
    inputProfilePicRef.current.click();
  };
  const handleCoverPhotoChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    if (file.type.includes("image")) {
      //console.log(storage)

      const imageRef = ref(storage, `coverPhotos/${getAuth().currentUser.uid}`);
      uploadBytes(imageRef, file).then(() => {
        alert("Image Uploaded!");

        getDownloadURL(imageRef).then((url) => {
          setCurrentCoverPhotoURL(url);

          setCurrentCoverPhoto(
            <img
              src={url}
              alt="Default Cover"
              className="settingsCoverPhoto"
            ></img>
          );
          const db = getFirestore();
          const usersRef = collection(db, "users");

          updateDoc(doc(db, "users", getAuth().currentUser.email), {
            coverPhoto: url,
          });
        });
      });
    }
    event.target.value = null;
  };
  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    if (file.type.includes("image")) {
      //console.log(storage)

      const imageRef = ref(
        storage,
        `profilePictures/${getAuth().currentUser.uid}`
      );
      uploadBytes(imageRef, file).then(() => {
        alert("Image Uploaded!");

        getDownloadURL(imageRef).then((url) => {
          console.log("url", url);
          setCurrentProfilePicURL(url);
          setCurrentProfilePicture(
            <img
              src={url}
              alt="Default Profile"
              className="settingsProfilePic"
            ></img>
          );
          const db = getFirestore();
          const usersRef = collection(db, "users");

          updateDoc(doc(db, "users", getAuth().currentUser.email), {
            photoURL: url,
          });
        });
      });
    }
    event.target.value = null;
  };
  async function submitProfileChanges(e) {
    e.preventDefault();

    const db = getFirestore();
    updateDoc(doc(db, "users", getAuth().currentUser.email), {
      name: e.target.children[0].children[2].value,
      bio: e.target.children[1].children[2].value,
    });

    setBio(e.target.children[1].children[2].value);
    setFullName(e.target.children[0].children[2].value);
  }

  return (
    <div className="settingsPage">
      <div className="settingsContainer">
        <div className="settingsHeader">
          <h1>Edit Profile</h1>
        </div>
        <div className="changeSettingsContainer">
          <div className="settingsCoverPhoto">
            <input
              type="file"
              ref={inputCoverPhotoRef}
              onChange={handleCoverPhotoChange}
            ></input>
            <div
              onClick={handleCoverPhotoClick}
              className="settingsCoverPhotoSmall"
            >
              {currentCoverPhoto}
            </div>
          </div>
          <div className="settingsProfilePicContainer">
            <input
              type="file"
              ref={inputProfilePicRef}
              onChange={handleProfilePicChange}
            ></input>
            <div onClick={handleProfilePicClick} className="settingsProfilePic">
              {currentProfilePicture}
            </div>
          </div>
          <form className="editProfileForm" onSubmit={submitProfileChanges}>
            <div>
              <div>Display Name:</div>
              <label htmlFor="displayName"></label>
              <input
                type="text"
                name="displayName"
                minLength="3"
                maxLength="20"
                defaultValue={`${fullName}`}
              ></input>
            </div>
            <div>
              <div>Bio:</div>
              <label htmlFor="bio"></label>
              <textarea
                type="text"
                name="bio"
                defaultValue={`${bio}`}
              ></textarea>
            </div>
            <button className="saveProfileEdits" type="submit">
              Save
            </button>
          </form>
          <Link to={`/profile/${getAuth().currentUser.uid}`}>
            <button className="returnToProfile">View Profile</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Settings;
