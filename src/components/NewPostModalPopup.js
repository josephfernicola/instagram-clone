import React from "react";
import { useRef } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
    getFirestore,
    collection,
    getDocs,
    setDoc,
    doc,
    updateDoc,
  } from "firebase/firestore";
  import { getAuth } from "firebase/auth";


const PopUp = (props) => {
  // function that takes boolean as param to conditionally display popup
  const { setUploadPostModal } = props;
  const inputNewPostRef = useRef(null);
  const storage = getStorage();

  const handleNewPostClick = () => {
    // open file input box on click of other element
    inputNewPostRef.current.click();
  };
  const handleNewPostChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    if (file.type.includes("image")) {
      //console.log(storage)

      const imageRef = ref(storage, `posts/${getAuth().currentUser.uid}`);
      uploadBytes(imageRef, file).then(() => {
        alert("Image Uploaded!");

        getDownloadURL(imageRef).then((url) => {
          console.log("url", url);

          const db = getFirestore();
          const usersRef = collection(db, "users");

          getDocs(usersRef)
            .then((snapshot) => {
              let users = [];
              snapshot.docs.forEach((doc) => {
                users.push({ ...doc.data(), id: doc.id });
              });
              //console.log(users)
              users.forEach((user) => {
                if (user.email === getAuth().currentUser.email) {
                  updateDoc(doc(db, "users", user.username), {
                    coverPhoto: url,
                  });
                }
              });
            })
            .catch((err) => {
              console.log(err);
            });
        });
      });
    }
    event.target.value = null;
  };

  const handleNewPostSubmit = (e) => {
      e.preventDefault();
  }

  return (
    <div className="PopUpContainer">
      <div className="PopUp">
        <button className="popup-x" onClick={() => setUploadPostModal(false)}>
          X
        </button>
        <div className="createNewPostTitle">Create New Post</div>
        <form className="newPostAndCaptionContainer" onSubmit={handleNewPostSubmit}>
          <input
            type="file"
            ref={inputNewPostRef}
            onChange={handleNewPostChange}
          ></input>
          <button onClick={handleNewPostClick} >Select Photo To Upload</button>
          <div></div>
          <textarea placeholder="Enter Caption..."></textarea>
          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  );
};

export default PopUp;
