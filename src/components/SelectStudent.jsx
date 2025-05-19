import { Box, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { getPredictedDepartment, setStudentData } from "../redux/predictSlice";
import Card from "@mui/material/Card";
import SendIcon from "@mui/icons-material/Send";
import ResultStudent from "./ResultStudent";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useNavigate } from "react-router-dom";
import Suggestions from "./Suggestions";
import axios from "axios";

const years = [2024, 2025];
const scoreTypes = ["EA", "SÖZ", "SAY", "DİL"];

function SelectStudent() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [studentRank, setStudentRank] = useState("");
  const [studentScore, setStudentScore] = useState("");
  const [departments, setDepartments] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedScoreType, setSelectedScoreType] = useState("");

  const dispatch = useDispatch();
  const {
    data: predictedData,
    isLoading,
    error,
  } = useSelector((store) => store.predict);

  useEffect(() => {
    dispatch(getPredictedDepartment());
  }, [dispatch]);

  useEffect(() => {
    if (selectedUniversity && predictedData) {
      let filteredDepartments = predictedData.filter(
        (item) => item.university_name === selectedUniversity
      );

      // Eğer puan türü seçilmişse, departmanları puan türüne göre filtrele
      if (selectedScoreType) {
        filteredDepartments = filteredDepartments.filter(
          (item) => item.score_type_name === selectedScoreType
        );
      }

      setDepartments(filteredDepartments);
    } else {
      setDepartments([]);
    }
  }, [selectedUniversity, predictedData, selectedScoreType]);

  const handlePredict = async () => {
    if (!selectedYear) {
      alert("Lütfen bir yıl seçin!");
      return;
    }

    if (Number(selectedYear) === 2024) {
      navigate("/confirm2024");
      return;
    }

    // 2025 için validasyonlar
    if (!selectedUniversity || !selectedDepartment || !studentRank) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }

    // Seçilen bölümün predicted değerlerini bul
    const selectedDepartmentData = predictedData.find(
      (item) =>
        item.university_name === selectedUniversity &&
        item.department_name === selectedDepartment
    );

    if (!selectedDepartmentData) {
      alert("Seçilen bölüm için tahmin verisi bulunamadı!");
      return;
    }

    // Redux store'a öğrenci bilgilerini kaydet
    const studentData = {
      selectedUniversity,
      selectedDepartment,
      studentRank: parseInt(studentRank),
      studentScore: studentScore ? parseFloat(studentScore) : null,
      predictedData: {
        predicted_first_rank: parseFloat(
          selectedDepartmentData.PREDICTED_FIRST_RANK
        ),
        predicted_last_rank: parseFloat(
          selectedDepartmentData.PREDICTED_LAST_RANK
        ),
      },
    };

    // --- Tahmini veritabanına kaydet ---
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/save-prediction",
        {
          university_name: selectedUniversity,
          department_name: selectedDepartment,
          student_rank: parseInt(studentRank),
          student_score: studentScore ? parseFloat(studentScore) : null,
          predicted_first_rank: parseFloat(selectedDepartmentData.PREDICTED_FIRST_RANK),
          predicted_last_rank: parseFloat(selectedDepartmentData.PREDICTED_LAST_RANK),
          score_type: selectedScoreType,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Başarılıysa ekrana mesaj gösterebilirsin (opsiyonel)
    } catch (error) {
      alert("Tahmin kaydedilemedi! " + (error.response?.data?.message || error.message));
      return;
    }
    // --- EKLEME BİTTİ ---

    console.log("Dispatching student data:", studentData);
    dispatch(setStudentData(studentData));
    setShowResult(true);
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      fontFamily: "'Inter', sans-serif",
      "&:hover fieldset": {
        borderColor: "#9F7AEA",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#553C9A",
      },
    },
    "& .MuiInputLabel-root": {
      fontFamily: "'Inter', sans-serif",
      "&.Mui-focused": {
        color: "#553C9A",
      },
    },
  };

  const uniqueUniversities = [
    ...new Set(predictedData?.map((item) => item.university_name) || []),
  ];

  return (
    <Box
      sx={{
        padding: "40px",
        backgroundColor: "#F6F0FE",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          width: "100%",
          maxWidth: "1600px",
          justifyContent: "center",
        }}
      >
        <Card
          sx={{
            width: { xs: "90%", sm: "500px" },
            padding: 4,
            borderRadius: 3,
            boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
            backgroundColor: "white",
            height: "fit-content",
          }}
        >
          <Stack spacing={3}>
            <Typography
              variant="h4"
              align="center"
              sx={{
                mb: 2,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                color: "#553C9A",
                letterSpacing: "-0.5px",
              }}
            >
              Öğrenci Bilgileri
            </Typography>
            <TextField
              select
              label="Yıl"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              SelectProps={{
                native: true,
              }}
              sx={textFieldSx}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </TextField>
            {selectedYear !== 2024 && (
              <>
                <Autocomplete
                  disablePortal
                  options={scoreTypes}
                  value={selectedScoreType}
                  onChange={(event, newValue) => {
                    setSelectedScoreType(newValue);
                    setSelectedDepartment(null);
                  }}
                  sx={{ textFieldSx }}
                  renderInput={(params) => (
                    <TextField {...params} label="Puan Türü" />
                  )}
                />
                <TextField
                  variant="outlined"
                  label="Sıralama"
                  sx={textFieldSx}
                  value={studentRank}
                  onChange={(e) => setStudentRank(e.target.value)}
                  type="number"
                />
              </>
            )}

            <Autocomplete
              value={selectedUniversity}
              onChange={(event, newValue) => {
                setSelectedUniversity(newValue);
                setSelectedDepartment(null);
              }}
              disablePortal
              options={uniqueUniversities}
              renderInput={(params) => (
                <TextField {...params} label="Üniversite" sx={textFieldSx} />
              )}
            />

            <Autocomplete
              value={selectedDepartment}
              onChange={(event, newValue) => {
                setSelectedDepartment(newValue);
              }}
              disablePortal
              options={departments.map((dept) => dept.department_name)}
              renderInput={(params) => (
                <TextField {...params} label="Bölüm" sx={textFieldSx} />
              )}
            />

            <Button
              variant="contained"
              size="large"
              endIcon={<SendIcon />}
              onClick={handlePredict}
              sx={{
                backgroundColor: "#553C9A",
                "&:hover": {
                  backgroundColor: "#4A3294",
                },
                fontFamily: "'Inter', sans-serif",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "1.1rem",
                padding: "12px 24px",
              }}
            >
              Tahmin Et
            </Button>
            <Alert severity="info">
              <AlertTitle>Bilgi</AlertTitle>
              Bu algoritmanın ne kadar güvenilir olduğunu öğrenmek için 2024
              verilerini test ettiğimiz sonuçlara bakabilirsiniz.
            </Alert>
          </Stack>
        </Card>

        {showResult && <ResultStudent />}
        {showResult && <Suggestions />}
      </Box>
    </Box>
  );
}

export default SelectStudent;
