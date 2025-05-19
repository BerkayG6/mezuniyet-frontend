import React, { useEffect, useState } from "react";
import FirstNavi from "./components/FirstNavi";
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
import Chatbot from "./components/Chatbot";
import UniversityInfo from "./components/UniversityInfo";
import { getTasks } from "./JS/api";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks()
      .then(res => setTasks(res.data))
      .catch(err => console.error("API Error:", err));
  }, []);

  return (
    <div>
      <BrowserRouter>
        <FirstNavi />
        <Routes>
          <Route path="/home" element={<Home tasks={tasks} />} />
          <Route path="/" element={<Home tasks={tasks} />} />
          <Route path="/datasets" element={<Datasets />} />
          <Route path="/student-login" element={<StudentLoginPage />} />
          <Route path="/university-login" element={<UniversityLoginPage />} />
          <Route path="/yok-login" element={<YokLoginPage />} />
          <Route path="/student-register" element={<StudentRegister />} />
          <Route path="/university-register" element={<UniversityRegister />} />
          <Route path="/student-predict" element={<PredictStudent />} />
          <Route path="/university-predict" element={<PredictUniversity />} />
          <Route path="/yok-predict" element={<PredictYok />} />
          <Route path="/student-profile" element={<Profile />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/calculaterank" element={<CalculateRank />} />
          <Route path="/sqlquery" element={<SQLQueryPage />} />
          <Route path="/university-profile" element={<UniversityInfo />} />
        </Routes>
        <Chatbot />
      </BrowserRouter>
    </div>
  );
}

export default App;