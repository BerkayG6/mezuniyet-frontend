import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, Select, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getDepartment } from "../redux/departmentSlice";
import { getPredictedDepartment } from "../redux/predictSlice";
import CircularProgress from "@mui/material/CircularProgress";
import DepartmentVisualization from "./DepartmentVisualization";
import { DataGrid } from "@mui/x-data-grid";

export default function YokUniversityList() {
  const dispatch = useDispatch();
  const {
    data: departments,
    isLoading: deptLoading,
    error: deptError,
  } = useSelector((store) => store.department);

  const {
    data: predictedData,
    isLoading: predictLoading,
    error: predictError,
  } = useSelector((store) => store.predict);

  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    dispatch(getDepartment({ filters: null, isUniversityProfile: false }));
    dispatch(getPredictedDepartment());
  }, [dispatch]);

  const handleUniversityChange = (event) => {
    setSelectedUniversity(event.target.value);
    setSelectedFaculty("");
    setSelectedDepartment("");
  };

  const handleFacultyChange = (event) => {
    setSelectedFaculty(event.target.value);
    setSelectedDepartment("");
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  // Get unique universities
  const universities = [
    ...new Set(departments?.map((dept) => dept.UNIVERSITY_NAME) || []),
  ];

  // Get faculties for selected university
  const faculties = selectedUniversity
    ? [
        ...new Set(
          departments
            ?.filter((dept) => dept.UNIVERSITY_NAME === selectedUniversity)
            .map((dept) => dept.FACULTY_NAME) || []
        ),
      ]
    : [];

  // Normalize department name
  const normalizeDepartmentName = (name) => {
    return name
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\(/g, " (")
      .replace(/\)/g, ") ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // Get departments for selected faculty
  const departmentsList = selectedFaculty
    ? [
        ...new Set(
          departments
            ?.filter(
              (dept) =>
                dept.UNIVERSITY_NAME === selectedUniversity &&
                dept.FACULTY_NAME === selectedFaculty
            )
            .map((dept) => normalizeDepartmentName(dept.DEPARTMENT_NAME))
        ),
      ].sort()
    : [];

  // Get selected department data
  const selectedDepartmentData = selectedDepartment
    ? departments?.filter(
        (dept) =>
          dept.UNIVERSITY_NAME === selectedUniversity &&
          dept.FACULTY_NAME === selectedFaculty &&
          normalizeDepartmentName(dept.DEPARTMENT_NAME) === selectedDepartment
      ) || []
    : [];

  // Debug logs
  useEffect(() => {
    if (selectedDepartmentData.length > 0) {
      console.log("Selected Department Data:", selectedDepartmentData);
      console.log("Department ID:", selectedDepartmentData[0].DEPARTMENT_ID);
    }
  }, [selectedDepartmentData]);

  useEffect(() => {
    if (predictedData) {
      console.log("Predicted Data:", predictedData);
      console.log("Predicted Data Length:", predictedData.length);
      console.log("First Prediction:", predictedData[0]);
    }
  }, [predictedData]);

  // Seçilen bölümün 2022-2024 verilerini ve 2025 tahminlerini birleştir
  const getCombinedDepartmentData = () => {
    // Debug için verileri kontrol et
    console.log("Selected Department Data:", selectedDepartmentData);
    console.log("Predicted Data:", predictedData);

    if (!selectedDepartmentData || selectedDepartmentData.length === 0) {
      console.log("No selected department data available");
      return [];
    }

    if (!predictedData || predictedData.length === 0) {
      console.log("No predicted data available");
      return [];
    }

    const departmentId = selectedDepartmentData[0].DEPARTMENT_ID;
    console.log("Department ID to match:", departmentId);

    // 2022-2024 verilerini al (YEAR_ID 22, 23, 24 olanlar)
    const historicalData = selectedDepartmentData
      .map((dept) => {
        console.log("Processing data for year:", dept.YEAR_ID, "Data:", dept);
        // YEAR_ID'yi gerçek yıla çevir (19 -> 2019, 20 -> 2020, vb.)
        const actualYear = 2000 + parseInt(dept.YEAR_ID);
        return {
          id: actualYear,
          year: actualYear.toString(),
          lastRank: dept.LAST_RANK,
          firstRank: dept.FIRST_RANK,
          enrollment: dept.SUM_ENROLLMENT,
          mean: dept.LAST_RANK,
          DEPARTMENT_NAME: dept.DEPARTMENT_NAME,
          UNIVERSITY_NAME: dept.UNIVERSITY_NAME,
          YEAR_ID: actualYear,
          SUM_ENROLLMENT: dept.SUM_ENROLLMENT,
          SUM_CAPACITY: dept.SUM_CAPACITY,
          LAST_SCORE: dept.LAST_SCORE,
          FIRST_SCORE: dept.FIRST_SCORE,
          LAST_RANK: dept.LAST_RANK,
          FIRST_RANK: dept.FIRST_RANK,
        };
      })
      .filter((dept) => dept.YEAR_ID >= 2022 && dept.YEAR_ID <= 2024);

    console.log("Processed historical data:", historicalData);

    // 2025 tahminlerini bul
    const departmentPrediction = predictedData.find(
      (item) => String(item.DEPARTMENT_ID) === String(departmentId)
    );

    if (!departmentPrediction) {
      console.log("No prediction found for department ID:", departmentId);
      return historicalData;
    }

    console.log("Found prediction:", departmentPrediction);

    // 2025 tahminlerini ekle
    const predictionData = {
      id: 2025,
      year: "2025 (Tahmin)",
      lastRank: departmentPrediction.PREDICTED_LAST_RANK,
      firstRank: departmentPrediction.PREDICTED_FIRST_RANK,
      enrollment: departmentPrediction.PREDICTED_SUM_ENROLLMENT,
      mean: departmentPrediction.Mean_Predicted,
      DEPARTMENT_NAME: selectedDepartmentData[0].DEPARTMENT_NAME,
      UNIVERSITY_NAME: selectedDepartmentData[0].UNIVERSITY_NAME,
      YEAR_ID: 2025,
      SUM_ENROLLMENT: departmentPrediction.PREDICTED_SUM_ENROLLMENT,
      SUM_CAPACITY: selectedDepartmentData[0].SUM_CAPACITY,
      LAST_SCORE: departmentPrediction.PREDICTED_LAST_SCORE || 0,
      FIRST_SCORE: departmentPrediction.PREDICTED_FIRST_SCORE || 0,
      LAST_RANK: departmentPrediction.PREDICTED_LAST_RANK,
      FIRST_RANK: departmentPrediction.PREDICTED_FIRST_RANK,
    };

    const combinedData = [...historicalData, predictionData];
    console.log("Final combined data:", combinedData);
    return combinedData;
  };

  const comparisonColumns = [
    {
      field: "year",
      headerName: "Yıl",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lastRank",
      headerName: "Son Sıralama",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "firstRank",
      headerName: "İlk Sıralama",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "enrollment",
      headerName: "Yerleşen Öğrenci Sayısı",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "mean",
      headerName: "Ortalama Sıralama",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
  ];

  if (deptLoading || predictLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress sx={{ color: "#553C9A" }} />
      </Box>
    );
  }

  if (deptError || predictError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Typography variant="h6" sx={{ color: "#553C9A" }}>
          Error: {deptError || predictError}
        </Typography>
      </Box>
    );
  }

  const combinedData = getCombinedDepartmentData();

  return (
    <Box
      sx={{
        padding: "40px",
        backgroundColor: "#F6F0FE",
        minHeight: "100vh",
        borderRadius: 10,
      }}
    >
      <Box sx={{ maxWidth: "1800px", margin: "0 auto", width: "100%" }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: 6,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            color: "#553C9A",
            letterSpacing: "-0.5px",
          }}
        >
          Üniversite Fakülte Bölüm Analizi
        </Typography>

        <Grid container spacing={3}>
          {/* Selection Controls */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
              }}
            >
              <Grid container spacing={2}>
                {/* University Selection */}
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ mb: 1, color: "#553C9A" }}>
                    Üniversite
                  </Typography>
                  <Select
                    value={selectedUniversity}
                    onChange={handleUniversityChange}
                    fullWidth
                    sx={{
                      backgroundColor: "#FFFFFF",
                      "&:hover fieldset": { borderColor: "#6B46C1" },
                      "&.Mui-focused fieldset": { borderColor: "#553C9A" },
                    }}
                  >
                    <MenuItem value="">Üniversite Seçin</MenuItem>
                    {universities.map((university) => (
                      <MenuItem key={university} value={university}>
                        {university}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                {/* Faculty Selection */}
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ mb: 1, color: "#553C9A" }}>
                    Fakülte
                  </Typography>
                  <Select
                    value={selectedFaculty}
                    onChange={handleFacultyChange}
                    fullWidth
                    disabled={!selectedUniversity}
                    sx={{
                      backgroundColor: "#FFFFFF",
                      "&:hover fieldset": { borderColor: "#6B46C1" },
                      "&.Mui-focused fieldset": { borderColor: "#553C9A" },
                    }}
                  >
                    <MenuItem value="">Fakülte Seçin</MenuItem>
                    {faculties.map((faculty) => (
                      <MenuItem key={faculty} value={faculty}>
                        {faculty}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                {/* Department Selection */}
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ mb: 1, color: "#553C9A" }}>
                    Bölüm
                  </Typography>
                  <Select
                    value={selectedDepartment}
                    onChange={handleDepartmentChange}
                    fullWidth
                    disabled={!selectedFaculty}
                    sx={{
                      backgroundColor: "#FFFFFF",
                      "&:hover fieldset": { borderColor: "#6B46C1" },
                      "&.Mui-focused fieldset": { borderColor: "#553C9A" },
                    }}
                  >
                    <MenuItem value="">Bölüm Seçin</MenuItem>
                    {departmentsList.map((department) => (
                      <MenuItem key={department} value={department}>
                        {department}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Mevcut Görselleştirme */}
          {selectedDepartment && selectedDepartmentData.length > 0 && (
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
                  mt: 3,
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: "#553C9A" }}>
                  {selectedDepartment} Bölümü 2022-2025 Analizi
                </Typography>
                <Box sx={{ height: 400, width: "100%", mb: 3 }}>
                  <DataGrid
                    rows={combinedData}
                    columns={comparisonColumns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                    sx={{
                      border: 0,
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#553C9A",
                        color: "black",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                      },
                      "& .MuiDataGrid-cell": {
                        fontFamily: "'Inter', sans-serif",
                      },
                      "& .MuiDataGrid-row:nth-of-type(odd)": {
                        backgroundColor: "#F8F5FF",
                      },
                      "& .MuiDataGrid-row:hover": {
                        backgroundColor: "#EDE7F6",
                      },
                    }}
                  />
                </Box>
                <DepartmentVisualization
                  departments={combinedData}
                  options={{
                    fieldRate: true,
                    lastScore: false,
                    ranks: true,
                    firstScore: false,
                  }}
                />
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}
