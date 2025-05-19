import React from "react";
import { Box, Stack, Typography, Paper, Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import HistoryIcon from "@mui/icons-material/History";

function createData(
  department,
  university,
  scoreType,
  score,
  rank,
  probability
) {
  return { department, university, scoreType, score, rank, probability };
}

//const rows = [
//  createData(
//    "Yazılım Mühendisliği %50 İndirimli",
//    "Çankaya Üniversitesi",
//    "SAY",
//    35200,
//    36200,
//    12000
//  ),
//];

function StudentInfo2({ userData }) {
  console.log("StudentInfo2 - userData:", userData);
  console.log("StudentInfo2 - predictions:", userData?.predictions);
  console.log("StudentInfo2 - predictions length:", userData?.predictions?.length);

  return (
    <Box
      sx={{
        padding: "40px",
        backgroundColor: "#F6F0FE",
        minHeight: "100vh",
        margin: 5,
      }}
    >
      <Box
        sx={{
          maxWidth: "1800px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
          }}
        >
          <Stack spacing={4}>
            <Typography
              variant="h4"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                color: "#553C9A",
                fontSize: "2rem",
              }}
            >
              <HistoryIcon sx={{ fontSize: "2rem", color: "#553C9A" }} />
              Geçmiş Tahminler
            </Typography>

            <TableContainer>
              <Table aria-label="predictions table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: "#553C9A", color: "white", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "1.1rem", py: 2 }}>Bölüm İsmi</TableCell>
                    <TableCell align="right" sx={{ backgroundColor: "#553C9A", color: "white", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "1.1rem", py: 2 }}>Üniversite</TableCell>
                    <TableCell align="right" sx={{ backgroundColor: "#553C9A", color: "white", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "1.1rem", py: 2 }}>Puan Türü</TableCell>
                    <TableCell align="right" sx={{ backgroundColor: "#553C9A", color: "white", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "1.1rem", py: 2 }}>2024 Sıralaması (Son Giren)</TableCell>
                    <TableCell align="right" sx={{ backgroundColor: "#553C9A", color: "white", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "1.1rem", py: 2 }}>2025 Tahmin Sıralaması (İlk Giren)</TableCell>
                    <TableCell align="right" sx={{ backgroundColor: "#553C9A", color: "white", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "1.1rem", py: 2 }}>2025 Tahmin Sıralaması (Son Giren)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userData?.predictions && userData.predictions.length > 0 ? (
                    userData.predictions.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:nth-of-type(odd)": { backgroundColor: "#F8F5FF" },
                          "&:hover": { backgroundColor: "#EDE7F6" },
                          "& .MuiTableCell-root": { fontSize: "1.1rem", py: 2, color: "#4A5568", fontFamily: "'Inter', sans-serif" },
                        }}
                      >
                        <TableCell>{row.department_name}</TableCell>
                        <TableCell align="right">{row.university_name}</TableCell>
                        <TableCell align="right">{row.score_type || ''}</TableCell>
                        <TableCell align="right">{row.student_rank}</TableCell>
                        <TableCell align="right">{row.predicted_first_rank}</TableCell>
                        <TableCell align="right">{row.predicted_last_rank}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 4 }}>
                          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: "1.1rem", color: "#4A5568", mb: 2 }}>
                            Henüz tahmin yapmadınız
                          </Typography>
                          <Button
                            variant="contained"
                            startIcon={<HistoryIcon />}
                            href="/student-predict"
                            sx={{
                              backgroundColor: "#553C9A",
                              "&:hover": { backgroundColor: "#6B46C1" },
                              textTransform: "none",
                              fontFamily: "'Inter', sans-serif",
                              fontSize: "1.1rem",
                              px: 4,
                              py: 1.2,
                            }}
                          >
                            Tahmin Yap
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}

export default StudentInfo2;
