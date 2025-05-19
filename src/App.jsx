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
import Chatbot from "./components/Chatbot";
import UniversityInfo from "./components/UniversityInfo";
import ImageList from "./pages/ImageList";
import Faculties from "./components/Faculties";
import Departments from "./components/Departments";
import Confirm from "./pages/Confirm";
import YokRegisterPage from "./pages/YokRegisterPage";
import UpdateProfile from './pages/UpdateProfile';

function App() {
  return (
    <div>
      <BrowserRouter>
        <FirstNavi></FirstNavi>
        <Routes>
          <Route path="/home" element={<Home></Home>}></Route>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/veri-setleri" element={<Datasets></Datasets>}></Route>
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
            path="/yok-register"
            element={<YokRegisterPage></YokRegisterPage>}
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
          <Route path="/hakkimizda" element={<AboutUs></AboutUs>}></Route>
          <Route
            path="/calculaterank"
            element={<CalculateRank></CalculateRank>}
          ></Route>
          <Route
            path="/sqlquery"
            element={<SQLQueryPage></SQLQueryPage>}
          ></Route>
          <Route
            path="/university-profile"
            element={<UniversityInfo></UniversityInfo>}
          ></Route>
          <Route path="/universiteler" element={<ImageList></ImageList>}></Route>
          <Route
            path="/bolumler"
            element={
              <Box
                sx={{
                  flexGrow: 1,
                  marginTop: "10%",
                  marginLeft: "5%",
                  marginRight: "5%",
                }}
              >
                <Departments></Departments>
              </Box>
            }
          ></Route>
          <Route
            path="/confirm2024"
            element={
              <Box
                sx={{
                  flexGrow: 1,
                  marginTop: "10%",
                  marginLeft: "5%",
                  marginRight: "5%",
                }}
              >
                <Confirm></Confirm>
              </Box>
            }
          ></Route>
          <Route path="/update-profile" element={<UpdateProfile />} />
        </Routes>
        <Chatbot />
      </BrowserRouter>
    </div>
  );
}

export default App;
