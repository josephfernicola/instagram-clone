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

const CurrentPostComments = (props) => {
  const { currentPostComments } = props;
  const location = useLocation();
  console.log(currentPostComments);
  return (
    <div className="currentPostComments">
      {currentPostComments &&
        currentPostComments.map((comment, index) => {
          return (
            <div key={index} className="individualComment">
              <div>{comment.commenterProfilePic}</div>
              <div>{comment.commenterUsername}</div>
              <div>{comment.commenterComment}</div>
            </div>
          );
        })}
    </div>
  );
};

export default CurrentPostComments;
