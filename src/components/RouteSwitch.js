import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React, { useState } from "react";
import Home from "../Home";
import NavBar from "./NavBar";
import Profile from './Profile';

import SignUp from "./SignUp";

const RouteSwitch = () => {
  const [homePageSidebar, setHomePageSidebar] = useState("");

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route
          path="/instagram-clone"
          element={
            <Home
              homePageSidebar={homePageSidebar}
              setHomePageSidebar={setHomePageSidebar}
            />
          }
        />
        <Route
          path="/sign-up"
          element={
            <SignUp
              homePageSidebar={homePageSidebar}
              setHomePageSidebar={setHomePageSidebar}
            />
          }
        />
        <Route path="profile/:id" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteSwitch;
