import React from "react";
import FirstNavi from "./components/FirstNavi";
import Student from "./components/Student";
import UniversityBody from "./components/UniversityBody";
import Box from "@mui/material/Box";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Datasets from "./pages/Datasets";
import StudentLoginPage from "./pages/StudentLoginPage";
import UniversityLoginPage from "./pages/UniversityLoginPage";
import YokLoginPage from "./pages/YokLoginPage";
import StudentRegister from "./pages/StudentRegister";
import UniversityRegister from "./pages/UniversityRegister";
import PredictStudent from "./pages/PredictStudent";
import PredictUniversity from "./pages/PredictUniversity";
import PredictYok from "./pages/PredictYok";
import Profile from "./pages/Profile";
import AboutUs from "./components/AboutUs";
import CalculateRank from "./pages/CalculateRank";
import Footer from "./components/Footer";
import SQLQueryPage from "./pages/SQLQueryPage";
import StudentProfile from "./pages/StudentProfile";

function App() {
  return (
    <div>
      <BrowserRouter>
        <FirstNavi></FirstNavi>
        <Routes>
          <Route path="/home" element={<Home></Home>}></Route>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/datasets" element={<Datasets></Datasets>}></Route>
          <Route
            path="/student-login"
            element={<StudentLoginPage></StudentLoginPage>}
          ></Route>
          <Route
            path="/university-login"
            element={<UniversityLoginPage></UniversityLoginPage>}
          ></Route>
          <Route
            path="/yok-login"
            element={<YokLoginPage></YokLoginPage>}
          ></Route>
          <Route
            path="/student-register"
            element={<StudentRegister></StudentRegister>}
          ></Route>
          <Route
            path="/university-register"
            element={<UniversityRegister></UniversityRegister>}
          ></Route>
          <Route
            path="/student-predict"
            element={<PredictStudent></PredictStudent>}
          ></Route>
          <Route
            path="/university-predict"
            element={<PredictUniversity></PredictUniversity>}
          ></Route>
          <Route
            path="/yok-predict"
            element={<PredictYok></PredictYok>}
          ></Route>
          <Route path="/student-profile" element={<Profile></Profile>}></Route>
          <Route path="/aboutus" element={<AboutUs></AboutUs>}></Route>
          <Route
            path="/calculaterank"
            element={<CalculateRank></CalculateRank>}
          ></Route>
          <Route
            path="sqlquery"
            element={<SQLQueryPage></SQLQueryPage>}
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
