import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  deleteUser,
} from "firebase/auth";





function Profile () {

      // Returns the signed-in user's profile Pic URL.
  function getProfilePicUrl() {
    return getAuth().currentUser.photoURL || "/images/profile_placeholder.png";
  }
    return (
    <img src={getProfilePicUrl()} alt="profile picture" className="profilePicture"></img>
    )
}

export default Profile;