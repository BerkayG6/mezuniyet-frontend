import * as React from "react";
import { useState, useEffect } from 'react';
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Stack, Box, Paper, Grid } from "@mui/material";
import { Divider } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import PublicIcon from "@mui/icons-material/Public";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UniversityInfo() {
  const [universityDepartments, setUniversityDepartments] = useState([]);
  const [universityDetails, setUniversityDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUniversityData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/university-login');
        return;
      }

      try {
        // Decode token to get university_ref_id
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const universityId = tokenData.university_ref_id;

        if (!universityId) {
          setError('University ID not found in token');
          setLoading(false);
          return;
        }

        // Fetch university details
        const detailsResponse = await axios.get(`http://localhost:5000/university-details/${universityId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUniversityDetails(detailsResponse.data);

        // Fetch university departments (existing code)
        const departmentsResponse = await axios.get('http://localhost:5000/university-departments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (Array.isArray(departmentsResponse.data)) {
          const formattedDepartments = departmentsResponse.data.map(dept => ({
            id: `${dept.DEPARTMENT_ID}-${dept.YEAR_ID}`,
            name: dept.DEPARTMENT_NAME,
            type: dept.SCORE_TYPE_ID,
            quota: dept.SUM_CAPACITY,
            lastYearRank: dept.LAST_RANK,
            lastYearScore: dept.LAST_SCORE,
            scholarship: dept.SCHOLARSHIP_TYPE_ID
          }));
          setUniversityDepartments(formattedDepartments);
        } else {
          setUniversityDepartments([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching university data:', err);
        setError('Failed to load university data');
        setLoading(false);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate('/university-login');
        }
      }
    };

    fetchUniversityData();
  }, [navigate]);

  // Determine university type based on scholarship values
  let dynamicType = '';
  if (universityDepartments.length > 0) {
    const allZero = universityDepartments.every(dep => Number(dep.scholarship) === 0);
    dynamicType = allZero ? 'Devlet' : 'Vakıf';
  }

  if (loading) {
    return <Box>Loading university data...</Box>;
  }

  if (error) {
    return <Box>Error: {error}</Box>;
  }

  if (!universityDetails) {
    return <Box>University details not found</Box>;
  }

  return (
    <Box
      sx={{
        padding: "40px",
        backgroundColor: "#F6F0FE",
        minHeight: "100vh",
        margin: 10,
      }}
    >
      <Box
        sx={{
          maxWidth: "1800px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Stack spacing={4}>
          {/* University Profile Card */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
              backgroundColor: "white",
            }}
          >
            <Box sx={{ display: "flex", p: 4 }}>
              {/* Left side - University Image */}
              <Box sx={{ width: "30%", pr: 4 }}>
                <CardMedia
                  component="img"
                  alt="university"
                  image="/src/assets/university.jpg"
                  sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: 2,
                  }}
                />
              </Box>

              {/* Right side - University Information */}
              <Box sx={{ width: "70%" }}>
                <Typography
                  gutterBottom
                  variant="h4"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    color: "#553C9A",
                    mb: 3,
                  }}
                >
                  Üniversite Bilgileri
                </Typography>
                <Divider
                  sx={{ mb: 3, borderColor: "rgba(107, 70, 193, 0.2)" }}
                />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <SchoolIcon
                        sx={{ color: "#553C9A", fontSize: "1.5rem" }}
                      />
                      <Typography
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "1.1rem",
                          color: "#4A5568",
                        }}
                      >
                        Üniversite Adı: {universityDetails.name}
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <LocationOnIcon
                        sx={{ color: "#553C9A", fontSize: "1.5rem" }}
                      />
                      <Typography
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "1.1rem",
                          color: "#4A5568",
                        }}
                      >
                        Konum: {universityDetails.city}
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <PublicIcon
                        sx={{ color: "#553C9A", fontSize: "1.5rem" }}
                      />
                      <Typography
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "1.1rem",
                          color: "#4A5568",
                        }}
                      >
                        Tür: {dynamicType || universityDetails.type || '-'}
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <CalendarTodayIcon
                        sx={{ color: "#553C9A", fontSize: "1.5rem" }}
                      />
                      <Typography
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "1.1rem",
                          color: "#4A5568",
                        }}
                      >
                        Kuruluş: {universityDetails.foundationYear}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4 }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="flex-start"
                  >
                    <Button
                      size="large"
                      variant="outlined"
                      href={universityDetails.website}
                      target="_blank"
                      sx={{
                        color: "#553C9A",
                        borderColor: "#553C9A",
                        "&:hover": {
                          borderColor: "#6B46C1",
                          backgroundColor: "rgba(107, 70, 193, 0.04)",
                        },
                        px: 3,
                        py: 1,
                        textTransform: "none",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "1rem",
                      }}
                    >
                      Web Sitesi
                    </Button>
                    <Button
                      size="large"
                      variant="contained"
                      sx={{
                        backgroundColor: "#553C9A",
                        "&:hover": {
                          backgroundColor: "#6B46C1",
                        },
                        px: 3,
                        py: 1,
                        textTransform: "none",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "1rem",
                      }}
                    >
                      İletişim
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Card>

          {/* Departments Table */}
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 4,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                color: "#553C9A",
                fontSize: "2rem",
              }}
            >
              Bölümler
            </Typography>

            <TableContainer>
              <Table aria-label="departments table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        backgroundColor: "#553C9A",
                        color: "white",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        py: 2,
                      }}
                    >
                      Bölüm Adı
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        backgroundColor: "#553C9A",
                        color: "white",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        py: 2,
                      }}
                    >
                      Puan Türü
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        backgroundColor: "#553C9A",
                        color: "white",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        py: 2,
                      }}
                    >
                      Kontenjan
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        backgroundColor: "#553C9A",
                        color: "white",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        py: 2,
                      }}
                    >
                      Son Yıl Sıralama
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        backgroundColor: "#553C9A",
                        color: "white",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        py: 2,
                      }}
                    >
                      Son Yıl Puan
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        backgroundColor: "#553C9A",
                        color: "white",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        py: 2,
                      }}
                    >
                      Burs/İndirim
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {universityDepartments.map((department, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "#F8F5FF",
                        },
                        "&:hover": {
                          backgroundColor: "#EDE7F6",
                        },
                        "& .MuiTableCell-root": {
                          fontSize: "1.1rem",
                          py: 2,
                          color: "#4A5568",
                          fontFamily: "'Inter', sans-serif",
                        },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {department.name}
                      </TableCell>
                      <TableCell align="right">{department.type}</TableCell>
                      <TableCell align="right">{department.quota}</TableCell>
                      <TableCell align="right">{department.lastYearRank}</TableCell>
                      <TableCell align="right">{department.lastYearScore}</TableCell>
                      <TableCell align="right">{department.scholarship}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
}
