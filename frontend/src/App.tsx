import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPages from "./pages/LoginRegistration";
import Categories from "./pages/Categories";
import CategoryLandingPage from "./pages/CategoryProps";
import JobDescription from "./pages/JobDescription";
import ProfilePage from "./pages/ProflePage";
import TakeJob from "./pages/TakeJob";
import Navbar from "./components/Navbar";
import AboutUs from "./pages/AboutUs";
import TempNavBar from "./pages/TempNavBar";

export default function App() {
  return (
    <Router>
      <TempNavBar></TempNavBar>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPages />} />
        <Route path="/categories" element={<Categories />} />
        <Route
          path="/categories/:categoryId"
          element={<CategoryLandingPage categoryName="exampleCategoryName" />}
        />
        <Route path="/job" element={<JobDescription />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/take-job" element={<TakeJob />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
    </Router>
  );
}
