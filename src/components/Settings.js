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
import { Link, useNavigate } from "react-router-dom";
import coverPhoto from "../images/default-cover-photo.jpg";
import { FiEdit, FiEdit2 } from 'react-icons/fi';

function Settings(props) {
  const {
    username,
    setUsername,
    bio,
    setBio,
    fullName,
    setFullName,
    currentPhoto,
    setCurrentPhoto,
    currentCoverPhoto,
    setCurrentCoverPhoto,
  } = props;

  const inputRef = useRef(null);

  const handleClick = () => {
    // open file input box on click of other element
    inputRef.current.click();
  };

  const handleFileChange = (event) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }

    console.log("fileObj is", fileObj);

    //  reset file input
    event.target.value = null;

    //  is now empty
    console.log(event.target.files);

    //  can still access file object here
    console.log(fileObj);
    console.log(fileObj.name);
  };

  useEffect(() => {
    setCurrentCoverPhoto(
      <img
        src={coverPhoto}
        alt="Default Cover"
        className="settingsCoverPhoto"
      ></img>
    );
  }, []);

  useEffect(() => {
    const users = getFirestore();
    const usersRef = collection(users, "users");
    getDocs(usersRef)
      .then((snapshot) => {
        let users = [];
        snapshot.docs.forEach((doc) => {
          users.push({ ...doc.data(), id: doc.id });
        });
        //console.log(users)
        users.forEach((user) => {
          if (user.email === getAuth().currentUser.email) {
            setUsername(user.username);
            setBio(user.bio);
            //setCurrentPhoto(user.photoURL);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  async function submitProfileChanges(e) {
    e.preventDefault();
    console.log(e.target.children[0].children[2].value);
    console.log(e.target.children[1].children[2].value);
    const users = getFirestore();
    const usersRef = collection(users, "users");
    getDocs(usersRef)
      .then((snapshot) => {
        let users = [];
        snapshot.docs.forEach((doc) => {
          users.push({ ...doc.data(), id: doc.id });
        });
        //console.log(users);
        users.forEach((user) => {
          if (user.email === getAuth().currentUser.email) {
            const db = getFirestore();
            updateDoc(doc(db, "users", user.id), {
              name: e.target.children[0].children[2].value,
              bio: e.target.children[1].children[2].value,
            });

            console.log(user);
          }
        });
      })
      .catch((err) => {
        alert(err);
      });
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
              ref={inputRef}
              onChange={handleFileChange}
            ></input>
            <div onClick={handleClick}>
 
            {currentCoverPhoto}
           
            </div>
            
          </div>
          <img
            src={currentPhoto}
            referrerPolicy="no-referrer"
            alt="Profile"
            className="profilePic"
            onClick={handleClick}
          ></img>
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
