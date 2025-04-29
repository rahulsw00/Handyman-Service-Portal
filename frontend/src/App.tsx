import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Login";
import Categories from "./pages/Categories";
import CategoryLandingPage from "./pages/CategoryProps";
import JobDescription from "./pages/JobDescription";
import ProfilePage from "./pages/ProflePage";
import TakeJob from "./pages/TakeJob";
import Navbar from "./components/Navbar";
import AboutUs from "./pages/AboutUs";
import RegistrationPage from "./pages/Registration";
import PostJobPage from "./pages/PostJob";
import HandymanOffers from "./pages/jobapplications";
import HandymanOffers2 from "./pages/jobapplicationshandyman";
import UpiLink from "./pages/upilink";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/categories" element={<Categories />} />
        <Route
          path="/categories/:categoryId"
          element={<CategoryLandingPage />}
        />
        <Route path="/take-job/:job" element={<JobDescription />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/take-job" element={<TakeJob />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/post-job" element={<PostJobPage />} />
        <Route path="/jobapp" element={<HandymanOffers />} />
        <Route path="/jobapp2/:job" element={<HandymanOffers2 />} />
        <Route path="/upi" element={<UpiLink />} />
      </Routes>
    </Router>
  );
}
