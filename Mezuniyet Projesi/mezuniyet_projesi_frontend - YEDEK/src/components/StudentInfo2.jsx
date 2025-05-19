import React from "react";
import { Button, Stack } from "react-bootstrap";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Divider, Typography } from "@mui/material";

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
    425.452,
    35.42,
    "%50"
  ),
  createData(
    "Yazılım Mühendisliği %50 İndirimli",
    "Çankaya Üniversitesi",
    "SAY",
    425.452,
    35.42,
    "%50"
  ),
  createData(
    "Yazılım Mühendisliği %50 İndirimli",
    "Çankaya Üniversitesi",
    "SAY",
    425.452,
    35.42,
    "%50"
  ),
  createData(
    "Yazılım Mühendisliği %50 İndirimli",
    "Çankaya Üniversitesi",
    "SAY",
    425.452,
    35.42,
    "%50"
  ),
  createData(
    "Yazılım Mühendisliği %50 İndirimli",
    "Çankaya Üniversitesi",
    "SAY",
    425.452,
    35.42,
    "%50"
  ),
];

function StudentInfo2() {
  return (
    <div>
      <Stack direction="row" gap={3}>
        <Typography textAlign="center">
          Tahminde Bulunduğum Bölümlerin Verileri
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Bölüm İsmi</TableCell>
                <TableCell align="right">Üniversite</TableCell>
                <TableCell align="right">Puan Türü</TableCell>
                <TableCell align="right">Puan</TableCell>
                <TableCell align="right">Sıralama</TableCell>
                <TableCell align="right">Girme Olasılığı</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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
    </div>
  );
}

export default StudentInfo2;
