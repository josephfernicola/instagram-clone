import React from "react";
import { useRef, useState, useEffect } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const PopUp = (props) => {
  // function that takes boolean as param to conditionally display popup
  const { setUploadPostModal } = props;
  const [newPostPreview, setNewPostPreview] = useState("");
  const [selectedImageURL, setSelectedImageURL] = useState();
  const [selectedImageObj, setSelectedImageObj] = useState();
  const [newPostCaption, setNewPostCaption] = useState();
  const inputNewPostRef = useRef(null);
  const storage = getStorage();
  const navigate = useNavigate()

  const handleNewPostClick = () => {
    // open file input box on click of other element
    inputNewPostRef.current.click();
  };
  const handleNewPostChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    if (file.type.includes("image")) {
      
      let reader = new FileReader();
      reader.onload = (e) => {
        setNewPostPreview(
          <img
            className="newPostImagePreview"
            src={e.target.result}
            alt="New Post Preview"
          ></img>
        );
        setSelectedImageURL(e.target.result);
        setSelectedImageObj(file)
      };
      reader.readAsDataURL(file);
      event.target.value = null;
    }
  };

  const handleNewPostSubmit = (e) => {
    e.preventDefault();
    console.log("selected image" , selectedImageURL)

    const imageRef = ref(storage, `posts/${getAuth().currentUser.uid}/${e.target.children[3].value}`);
    uploadBytes(imageRef, selectedImageObj).then(() => {
      alert("Image Uploaded!");
      console.log("image ref" , imageRef)

    //   getDownloadURL(imageRef).then((url) => {
    //       console.log("url", url)
         const db = getFirestore();
         const usersRef = collection(db, "users");

        getDocs(usersRef)
          .then((snapshot) => {
            let users = [];
            snapshot.docs.forEach((doc) => {
              users.push({ ...doc.data(), id: doc.id });
            });

            users.forEach((user) => {
              if (user.email === getAuth().currentUser.email) {
                addDoc(db, "users", user.username, {
                  posts: { image: selectedImageURL, caption: e.target.children[3].value },
                });
              }
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    // }).catch((err) => {
    //     console.log(err);
    //   });
    setUploadPostModal(false)
  };

  return (
    <div className="PopUpContainer">
      <div className="PopUp">
        <button className="popup-x" onClick={() => setUploadPostModal(false)}>
          X
        </button>
        <div className="createNewPostTitle">Create New Post</div>
        <form
          className="newPostAndCaptionContainer"
          onSubmit={handleNewPostSubmit}
        >
          <input
            type="file"
            ref={inputNewPostRef}
            onChange={handleNewPostChange}
          ></input>
          <button type="button" onClick={handleNewPostClick}>
            Select Photo To Upload
          </button>
          {newPostPreview}
          <textarea placeholder="Enter Caption..."></textarea>
          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  );
};

export default PopUp;
