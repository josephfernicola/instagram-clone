import instagramLogo from "../images/instagram-logo.jpeg";
import { AiFillHome, AiOutlineHeart } from "react-icons/ai";
import { BsChat, BsPlusSquare } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
  Firestore,
  orderBy,
  limit,
  startAt,
  endAt,
  QuerySnapshot,
} from "firebase/firestore";
import CurrentPostComments from "./CurrentPostComments";

function NavBar(props) {
  const {
    setCurrentCoverPhoto,
    setCurrentProfilePicture,
    setUserFullNameOnPost,
    setUserFullUsernameOnPost,
    setCurrentPostCaption,
    setCurrentPostComments,
    currentPostURL,
  } = props;
  const [profileOptionsMenu, setProfileOptionsMenu] = useState("");
  const [toggleProfileOptionsMenu, setToggleProfileOptionsMenu] =
    useState(false);
  const [matchList, setMatchList] = useState([]);

  let location = useLocation();
  const navigate = useNavigate();

  function isUserSignedIn() {
    return !!getAuth().currentUser;
  }

  useEffect(() => {
    if (isUserSignedIn()) {
      if (location.pathname === "/settings") {
        const profilePicture = document.querySelector(".settingsProfilePic")
          .children[0];
        if (profilePicture) {
          profilePicture.className = "settingsProfilePic";
        }
        const coverPhoto = document.querySelector(".settingsCoverPhotoSmall")
          .children[0];
        if (coverPhoto) {
          coverPhoto.className = "settingsCoverPhoto";
        }
        // } else if (location.pathname === "/instagram-clone") {
        // const profilePicture =
        //   document.querySelector(".pictureAndName").children[0];
        //   if (profilePicture) {
        // profilePicture.className = "homepageProfilePic";
        //   }
      }
    }
  }, [location, isUserSignedIn]);

  // Returns true if a user is signed-in.
  function isUserSignedIn() {
    return !!getAuth().currentUser;
  }
  const switchToYourProfile = async () => {
    console.log(getAuth().currentUser.email);
    const users = await getFirestore();
    const usersRef = await collection(users, "users");
    getDocs(usersRef)
      .then((snapshot) => {
        let users = [];
        snapshot.docs.forEach((doc) => {
          users.push({ ...doc.data(), id: doc.id });
        });
        users.forEach((user) => {
          if (user.email === getAuth().currentUser.email) {
            navigate(`/profile/${user.uid}`);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const profileOptions = () => {
    if (!toggleProfileOptionsMenu && isUserSignedIn()) {
      setProfileOptionsMenu(
        <div className="profileOptionsMenu">
          <div className="navBarProfileButton" onClick={switchToYourProfile}>
            Profile
          </div>

          <div className="logOutButton" onClick={logUserOut}>
            Log Out
          </div>
        </div>
      );
      setToggleProfileOptionsMenu(true);
    } else if (!toggleProfileOptionsMenu && isUserSignedIn() === false) {
      setProfileOptionsMenu(
        <div className="profileOptionsMenu">
          <Link to="/sign-up">
            <div className="signUpButtonNavBar">Sign Up</div>
          </Link>
        </div>
      );
      setToggleProfileOptionsMenu(true);
    } else {
      setProfileOptionsMenu("");
      setToggleProfileOptionsMenu(false);
    }
  };

  const logUserOut = () => {
    // Sign out of Firebase.
    signOut(getAuth());
    navigate("/instagram-clone");
  };

  const searchInputChange = async (e) => {
    let searchMatches = [];
    const users = await getFirestore();
    const usersRef = await collection(users, "users");
    const q = await query(usersRef, orderBy("username"), limit(5));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      searchMatches.push({
        username: doc.data().username,
        profilePic: doc.data().photoURL,
        fullName: doc.data().name,
      });
    });
    let usernameMatches = searchMatches.filter((match) => {
      const regex = new RegExp(`^${e.target.value}`, "gi");
      return match.fullName.match(regex);
    });
    setMatchList(
      usernameMatches.map((result, index) => {
        return (
          <div
            key={index}
            className="searchResult"
            onClick={switchToOtherProfile}
          >
            <div className="searchImageAndFullName">
              <img
                src={result.profilePic}
                alt="user profile"
                className="searchPicture"
              ></img>
              <div className="searchFullName">{result.fullName}</div>
            </div>
            <div>{result.username}</div>
          </div>
        );
      })
    );

    if (e.target.value === "") {
      searchMatches = [];
      setMatchList([]);
    }
    if (usernameMatches.length === 0) {
      setMatchList(<div>No Results</div>)
    }
  };
  const switchToOtherProfile = async (e) => {
    const users = await getFirestore();
    const usersRef = await collection(users, "users");
    getDocs(usersRef)
      .then((snapshot) => {
        let users = [];
        snapshot.docs.forEach((doc) => {
          users.push({ ...doc.data(), id: doc.id });
        });
        users.forEach((user) => {
          if (
            user.username ===
            e.target.parentElement.parentElement.children[1].textContent
          ) {
            setMatchList([]);
            navigate(`/profile/${user.uid}`);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <nav className="homeNav">
      <div className="homeNavContainer">
        <Link to="/instagram-clone">
          <div className="logoAndInstagramTitle">
            <img
              className="logo"
              src={instagramLogo}
              alt="Instagram Logo"
            ></img>
            <div className="instagramTitle">Instagram</div>
          </div>
        </Link>
        <div className="searchInputAndResults">
          <label htmlFor="search"></label>
          <input
            type="text"
            name="search"
            className="userSearch"
            placeholder="Search"
            maxLength="30"
            onChange={searchInputChange}
          ></input>
        </div>
        <div className="navBarIcons">
          <Link to="/instagram-clone">
            <div className="homeIcon">{<AiFillHome />}</div>
          </Link>
          <div className="messageIcon">{<BsChat />}</div>
          <div className="addPostIcon">{<BsPlusSquare />}</div>
          <div className="notificationsIcon">{<AiOutlineHeart />}</div>
          <div className="profileIcon" onClick={profileOptions}>
            {<FaRegUserCircle />}
            {profileOptionsMenu}
          </div>
        </div>
      </div>
      <div className="searchMatchListContainer">
        <div className="searchMatchList">{matchList}</div>
      </div>
    </nav>
  );
}

export default NavBar;
