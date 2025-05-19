import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import React from "react";
import { Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#553C9A",
    color: "#FFFFFF",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: "0.95rem",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "0.9rem",
    fontFamily: "'Inter', sans-serif",
    color: "#4A5568",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#F8F5FF",
  },
  "&:hover": {
    backgroundColor: "#EDE7F6",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(
  scoreType,
  hamPuan,
  hamSıralama,
  enrollementPuan,
  enrollementSıralama
) {
  return {
    scoreType,
    hamPuan,
    hamSıralama,
    enrollementPuan,
    enrollementSıralama,
  };
}

const rows = [
  createData("TYT", "---", "---", "---", "---"),
  createData("SAY", "---", "---", "---", "---"),
  createData("EA", "---", "---", "---", "---"),
  createData("SÖZ", "---", "---", "---", "---"),
  createData("DİL", "---", "---", "---", "---"),
];

const tyt = ["Türkçe", "Sosyal", "Matematik", "Fen"];
const ayt1 = ["Türk Dili", "Tarih", "Coğrafya"];
const ayt2 = ["Tarih", "Coğrafya", "Felsefe", "Din"];
const ayt3 = ["Matematik", "Fizik", "Kimya", "Biyoloji"];

const CustomTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "#6B46C1",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#553C9A",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#553C9A",
  },
});

function Calculate() {
  return (
    <Box
      sx={{
        padding: "40px",
        backgroundColor: "#F6F0FE",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
        }}
      >
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
          Puan Hesaplama
        </Typography>
        <Grid container spacing={6}>
          <Grid item xs={12} lg={7}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
              }}
            >
              <Grid container spacing={4}>
                {[
                  { title: "TYT", items: tyt },
                  { title: "AYT 1", items: ayt1 },
                  { title: "AYT 2", items: ayt2 },
                  { title: "AYT 3", items: ayt3 },
                ].map((section) => (
                  <Grid key={section.title} item xs={12} md={6}>
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "center",
                        mb: 2,
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        color: "#553C9A",
                      }}
                    >
                      {section.title}
                    </Typography>
                    <Divider
                      sx={{ mb: 3, borderColor: "rgba(107, 70, 193, 0.2)" }}
                    />
                    <Stack spacing={3}>
                      {section.items.map((item) => (
                        <Box key={item}>
                          <Typography
                            sx={{
                              mb: 1,
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 500,
                              color: "#4A5568",
                            }}
                          >
                            {item}
                          </Typography>
                          <Stack direction="row" spacing={2}>
                            <CustomTextField
                              label="Doğru"
                              variant="outlined"
                              size="small"
                              fullWidth
                            />
                            <CustomTextField
                              label="Yanlış"
                              variant="outlined"
                              size="small"
                              fullWidth
                            />
                            <CustomTextField
                              label="Net"
                              variant="outlined"
                              size="small"
                              fullWidth
                            />
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Box sx={{ mt: 3 }}>
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={3}
                      alignItems="center"
                    >
                      <Typography
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          color: "#553C9A",
                        }}
                      >
                        Okul Puanı:
                      </Typography>
                      <CustomTextField
                        label="Diploma Notu"
                        variant="outlined"
                        size="small"
                      />
                      <Typography
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          color: "#4A5568",
                        }}
                      >
                        ya da
                      </Typography>
                      <CustomTextField
                        label="Orta Öğretim Başarı Puanı"
                        variant="outlined"
                        size="small"
                      />
                      <Button
                        variant="contained"
                        size="large"
                        sx={{
                          backgroundColor: "#553C9A",
                          "&:hover": {
                            backgroundColor: "#6B46C1",
                          },
                          textTransform: "none",
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 500,
                          fontSize: "1rem",
                          px: 4,
                          py: 1.5,
                        }}
                      >
                        Hesapla
                      </Button>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={5}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  textAlign: "center",
                  mb: 3,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  color: "#553C9A",
                }}
              >
                Hesaplama Sonucu
              </Typography>
              <Divider sx={{ mb: 3, borderColor: "rgba(107, 70, 193, 0.2)" }} />
              <TableContainer>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Puan Türü</StyledTableCell>
                      <StyledTableCell align="right">Ham Puan</StyledTableCell>
                      <StyledTableCell align="right">
                        Ham Sıralama
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        Yerleştirme Puanı
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        Yerleştirme Sıralama
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <StyledTableRow key={row.scoreType}>
                        <StyledTableCell component="th" scope="row">
                          {row.scoreType}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.hamPuan}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.hamSıralama}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.enrollementPuan}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.enrollementSıralama}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Calculate;
