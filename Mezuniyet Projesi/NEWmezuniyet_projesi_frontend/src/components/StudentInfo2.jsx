import React from "react";
import { Box, Stack, Typography, Paper } from "@mui/material";
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

const rows = [
  createData(
    "Yazılım Mühendisliği %50 İndirimli",
    "Çankaya Üniversitesi",
    "SAY",
    35200,
    36200,
    12000
  ),
];

function StudentInfo2() {
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
                      Bölüm İsmi
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
                      Üniversite
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
                      2024 Sıralaması (Son Giren)
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
                      2025 Tahmin Sıralaması (İlk Giren)
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
                      2025 Tahmin Sıralaması (Son Giren)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
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
                        {row.department}
                      </TableCell>
                      <TableCell align="right">{row.university}</TableCell>
                      <TableCell align="right">{row.scoreType}</TableCell>
                      <TableCell align="right">{row.score}</TableCell>
                      <TableCell align="right">{row.rank}</TableCell>
                      <TableCell align="right">{row.probability}</TableCell>
                    </TableRow>
                  ))}
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
