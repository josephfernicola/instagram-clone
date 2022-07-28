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
  arrayUnion,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ProfilePostContainer = (props) => {
  const { userPosts, setUserPosts } = props;
  console.log(userPosts)
  return (
    <div className="profilePostContainer">
      {userPosts.map(function(arr, index) {
        return (
          <div key={index} className="individualPost">
              <img className="profilePostImage" src={arr.image} alt="Profile Post"></img>
          </div>
        );
      })}
    </div>
  );
};

export default ProfilePostContainer;
