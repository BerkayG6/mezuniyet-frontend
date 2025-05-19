import {
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Stack } from "@mui/material";
import { Grid2 } from "@mui/material";
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
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 20,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
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

function Calculate() {
  return (
    <div>
      <Grid2
        sx={{ display: "flex", marginLeft: "5%", marginRight: "5%" }}
        container
        spacing={10}
      >
        <Grid2 size={6} spacing={10}>
          <Grid2 container spacing={3}>
            <Grid2 size={6}>
              <Typography textAlign="center" variant="h6">
                TYT
              </Typography>
              <Divider></Divider>
              <Stack direction="row" spacing={2}>
                <Divider></Divider>
                {tyt.map((item) => (
                  <Box>
                    <Typography>{item}</Typography>
                    <TextField
                      margin="normal"
                      key="doğru"
                      label="Doğru"
                      variant="outlined"
                      fullWidth
                    ></TextField>
                    <TextField
                      margin="normal"
                      key="Yanlış"
                      label="Yanlış"
                      variant="outlined"
                      fullWidth
                    ></TextField>
                    <TextField
                      margin="normal"
                      key="Net"
                      label="Net"
                      variant="outlined"
                      fullWidth
                    ></TextField>
                  </Box>
                ))}
              </Stack>
            </Grid2>
            <Grid2 size={6}>
              <Typography textAlign="center" variant="h6">
                AYT 1
              </Typography>
              <Divider></Divider>
              <Stack direction="row" spacing={2}>
                <Divider></Divider>
                {ayt1.map((item) => (
                  <Box>
                    <Typography>{item}</Typography>
                    <TextField
                      margin="normal"
                      key="doğru"
                      label="Doğru"
                      variant="outlined"
                      fullWidth
                    ></TextField>
                    <TextField
                      margin="normal"
                      key="Yanlış"
                      label="Yanlış"
                      variant="outlined"
                      fullWidth
                    ></TextField>
                    <TextField
                      margin="normal"
                      key="Net"
                      label="Net"
                      variant="outlined"
                      fullWidth
                    ></TextField>
                  </Box>
                ))}
              </Stack>
            </Grid2>
            <Grid2 size={6}>
              <Typography textAlign="center" variant="h6">
                AYT 2
              </Typography>
              <Divider></Divider>
              <Stack direction="row" spacing={2}>
                <Divider></Divider>
                {ayt2.map((item) => (
                  <Box>
                    <Typography>{item}</Typography>
                    <TextField
                      margin="normal"
                      key="doğru"
                      label="Doğru"
                      variant="outlined"
                      fullWidth
                    ></TextField>
                    <TextField
                      margin="normal"
                      key="Yanlış"
                      label="Yanlış"
                      variant="outlined"
                      fullWidth
                    ></TextField>
                    <TextField
                      margin="normal"
                      key="Net"
                      label="Net"
                      variant="outlined"
                      fullWidth
                    ></TextField>
                  </Box>
                ))}
              </Stack>
            </Grid2>
            <Grid2 size={6}>
              <Typography textAlign="center" variant="h6">
                AYT 3
              </Typography>
              <Divider></Divider>
              <Stack direction="row" spacing={2}>
                <Divider></Divider>
                {ayt3.map((item) => (
                  <Box>
                    <Typography>{item}</Typography>
                    <TextField
                      margin="normal"
                      key="doğru"
                      label="Doğru"
                      variant="outlined"
                      fullWidth
                    ></TextField>
                    <TextField
                      margin="normal"
                      key="Yanlış"
                      label="Yanlış"
                      variant="outlined"
                      fullWidth
                    ></TextField>
                    <TextField
                      margin="normal"
                      key="Net"
                      label="Net"
                      variant="outlined"
                      fullWidth
                    ></TextField>
                  </Box>
                ))}
              </Stack>
            </Grid2>
            <Grid2 size="grow" marginLeft={3}>
              <Stack direction="row" gap={2}>
                <Typography alignContent="center" variant="h6">
                  Okul Puanı:
                </Typography>
                <TextField
                  label="Diploma Notu"
                  margin="normal"
                  variant="outlined"
                >
                  Diploma Notu
                </TextField>
                <Typography alignContent="center">ya da</Typography>
                <TextField
                  margin="normal"
                  variant="outlined"
                  label="Orta Öğretim Başarı Puanı"
                ></TextField>
                <Button
                  sx={{
                    height: "100%",
                    width: "40%",
                    alignSelf: "center",
                  }}
                  variant="contained"
                  size="large"
                >
                  HESAPLA
                </Button>
              </Stack>
            </Grid2>
          </Grid2>
        </Grid2>
        <Grid2 size={5}>
          <Typography textAlign="center" variant="h5">
            Hesaplama Sonucu
          </Typography>
          <Divider></Divider>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 600 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Puan Türü</StyledTableCell>
                  <StyledTableCell align="right">Ham Puan</StyledTableCell>
                  <StyledTableCell align="right">Ham Sıralama</StyledTableCell>
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
        </Grid2>
      </Grid2>
    </div>
  );
}

export default Calculate;
