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
import { useNavigate, Link, Navigate, useLocation } from "react-router-dom";

const ProfilePostContainer = (props) => {
  const { userPosts, setUserPosts } = props;
  const location = useLocation();

  const navigate = useNavigate();

  const switchToPostPage = async (e) => {
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
            userPosts.forEach((image) => {
              if (image.image === e.target.src) {
                navigate(`/post/${user.uid}/${image.postId}`, {
                  state: { image: e.target.src },
                });
              }
            });
          }
        });
      })
      .catch((err) => {
        console.log(err);
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
