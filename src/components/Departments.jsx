import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, Select, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getDepartment } from "../redux/departmentSlice";
import CircularProgress from "@mui/material/CircularProgress";
import DepartmentVisualization from "./DepartmentVisualization";

export default function Departments() {
  const dispatch = useDispatch();
  const {
    data: departments,
    isLoading,
    error,
  } = useSelector((store) => store.department);

  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    dispatch(getDepartment({ filters: null, isUniversityProfile: false }));
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
      .trim() // Remove leading/trailing spaces
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .replace(/\(/g, " (") // Add space before opening parenthesis
      .replace(/\)/g, ") ") // Add space after closing parenthesis
      .replace(/\s+/g, " ") // Replace multiple spaces with single space again
      .trim(); // Remove any new leading/trailing spaces
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

  // Debug log for departments list
  useEffect(() => {
    if (departmentsList.length > 0) {
      console.log("Departments List:", departmentsList);
      console.log("Number of unique departments:", departmentsList.length);
    }
  }, [departmentsList]);

  // Get selected department data
  const selectedDepartmentData = selectedDepartment
    ? departments?.filter(
        (dept) =>
          dept.UNIVERSITY_NAME === selectedUniversity &&
          dept.FACULTY_NAME === selectedFaculty &&
          normalizeDepartmentName(dept.DEPARTMENT_NAME) === selectedDepartment
      ) || []
    : [];

  // Debug log for selected department data
  useEffect(() => {
    if (selectedDepartmentData.length > 0) {
      console.log("Selected Department:", selectedDepartment);
      console.log(
        "Years:",
        selectedDepartmentData.map((d) => d.YEAR_ID)
      );
      console.log("Data Count:", selectedDepartmentData.length);
      console.log("Full Data:", selectedDepartmentData);
    }
  }, [selectedDepartmentData, selectedDepartment]);

  // Calculate faculty statistics
  const facultyStats = selectedFaculty
    ? departments
        ?.filter(
          (dept) =>
            dept.UNIVERSITY_NAME === selectedUniversity &&
            dept.FACULTY_NAME === selectedFaculty
        )
        .reduce(
          (acc, dept) => {
            // Count unique departments
            if (!acc.departmentSet) {
              acc.departmentSet = new Set();
            }
            acc.departmentSet.add(
              normalizeDepartmentName(dept.DEPARTMENT_NAME)
            );

            acc.totalCapacity += dept.SUM_CAPACITY;
            acc.totalEnrollment += dept.SUM_ENROLLMENT;
            acc.avgLastRank += dept.LAST_RANK;
            acc.avgLastScore += dept.LAST_SCORE;
            acc.avgFirstRank += dept.FIRST_RANK;
            acc.avgFirstScore += dept.FIRST_SCORE;
            return acc;
          },
          {
            departmentSet: new Set(),
            totalCapacity: 0,
            totalEnrollment: 0,
            avgLastRank: 0,
            avgLastScore: 0,
            avgFirstRank: 0,
            avgFirstScore: 0,
          }
        )
    : null;

  if (facultyStats) {
    facultyStats.totalDepartments = facultyStats.departmentSet.size;
    facultyStats.avgLastRank =
      facultyStats.avgLastRank / facultyStats.totalDepartments;
    facultyStats.avgLastScore =
      facultyStats.avgLastScore / facultyStats.totalDepartments;
    facultyStats.avgFirstRank =
      facultyStats.avgFirstRank / facultyStats.totalDepartments;
    facultyStats.avgFirstScore =
      facultyStats.avgFirstScore / facultyStats.totalDepartments;
  }

  if (isLoading) {
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

  if (error) {
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
          Error: {error}
        </Typography>
      </Box>
    );
  }

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

          {/* Faculty Information */}
          {selectedFaculty && facultyStats && (
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: "#553C9A" }}>
                  {selectedFaculty} Fakültesi Bilgileri
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, backgroundColor: "#F8F5FF" }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Toplam Bölüm Sayısı
                      </Typography>
                      <Typography variant="h6" sx={{ color: "#553C9A" }}>
                        {facultyStats.totalDepartments}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, backgroundColor: "#F8F5FF" }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Toplam Kontenjan
                      </Typography>
                      <Typography variant="h6" sx={{ color: "#553C9A" }}>
                        {facultyStats.totalCapacity}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, backgroundColor: "#F8F5FF" }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Ortalama Son Sıralama
                      </Typography>
                      <Typography variant="h6" sx={{ color: "#553C9A" }}>
                        {facultyStats.avgLastRank.toFixed(0)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, backgroundColor: "#F8F5FF" }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Ortalama Son Puan
                      </Typography>
                      <Typography variant="h6" sx={{ color: "#553C9A" }}>
                        {facultyStats.avgLastScore.toFixed(2)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, backgroundColor: "#F8F5FF" }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Ortalama İlk Sıralama
                      </Typography>
                      <Typography variant="h6" sx={{ color: "#553C9A" }}>
                        {facultyStats.avgFirstRank.toFixed(0)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, backgroundColor: "#F8F5FF" }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Ortalama İlk Puan
                      </Typography>
                      <Typography variant="h6" sx={{ color: "#553C9A" }}>
                        {facultyStats.avgFirstScore.toFixed(2)}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}

          {/* Department Visualization */}
          {selectedDepartment && selectedDepartmentData.length > 0 && (
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: "#553C9A" }}>
                  {selectedDepartment} Bölümü Analizi
                </Typography>
                <DepartmentVisualization
                  departments={selectedDepartmentData}
                  options={{
                    fieldRate: true,
                    lastScore: true,
                    ranks: true,
                    firstScore: true,
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
