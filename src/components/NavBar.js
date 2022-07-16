import instagramLogo from "../images/instagram-logo.jpeg";
import { AiFillHome, AiOutlineHeart } from "react-icons/ai";
import { BsChat, BsPlusSquare } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";

function NavBar(props) {
  const [profileOptionsMenu, setProfileOptionsMenu] = useState("");
  const [toggleProfileOptionsMenu, setToggleProfileOptionsMenu] =
    useState(false);
  // Returns true if a user is signed-in.
  function isUserSignedIn() {
    return !!getAuth().currentUser;
  }

  const profileOptions = () => {
    if (!toggleProfileOptionsMenu && isUserSignedIn()) {
      setProfileOptionsMenu(
        <div className="profileOptionsMenu">
          <div className="profileButton">Profile</div>
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
        <label htmlFor="search"></label>
        <input
          type="text"
          name="search"
          placeholder="Search"
          maxLength="30"
        ></input>
        <div className="navBarIcons">
          <div className="homeIcon">{<AiFillHome />}</div>
          <div className="messageIcon">{<BsChat />}</div>
          <div className="addPostIcon">{<BsPlusSquare />}</div>
          <div className="notificationsIcon">{<AiOutlineHeart />}</div>
          <div className="profileIcon" onClick={profileOptions}>
            {<FaRegUserCircle />}
            {profileOptionsMenu}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
