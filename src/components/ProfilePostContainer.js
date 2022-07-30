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
import { useNavigate, Link, Navigate } from "react-router-dom";

const ProfilePostContainer = (props) => {
  const { userPosts, setUserPosts } = props;

  const navigate = useNavigate();

  const switchToPostPage = (e) => {
    userPosts.forEach((image) => {
      if (image.image === e.target.src) {
        navigate(`/post/${getAuth().currentUser.uid}/${image.postId}`, {
          state: { image: e.target.src },
        });
      }
    });
  };
  return (
    <div className="profilePostContainer">
      {userPosts.map(function (arr, index) {
        return (
          <div key={index} className="individualPost">
            <img
              className="profilePostImage"
              src={arr.image}
              alt="Profile Post"
              onClick={switchToPostPage}
            ></img>
          </div>
        );
      })}
    </div>
  );
};

export default ProfilePostContainer;
