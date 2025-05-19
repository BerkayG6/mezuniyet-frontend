import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";

const columns = [
  { field: "id", headerName: "DepartmentId", width: 70 },
  { field: "departmentName", headerName: "Department Name", width: 130 },
  { field: "scoreType", headerName: "Score Type", width: 130 },
  {
    field: "capacity",
    headerName: "Capacity",
    type: "number",
    width: 90,
  },
  {
    field: "enrollment",
    headerName: "Enrollment",
    type: "number",
    width: 110,
  },
  {
    field: "gender",
    headerName: "Gender Enrollment",
    width: 130,
  },
  {
    field: "fieldRate",
    headerName: "Field Rate",
    width: 110,
  },
];

const rows = [
  {
    id: 106564057,
    departmentName: "Bilgisayar Mühendisliği",
    scoreType: "SAY",
    capacity: 60,
    enrollment: 60,
    gender: "Male/Female",
    fieldRate: "%10",
  },
  {
    id: 106522057,
    departmentName: "Bilgisayar Mühendisliği",
    scoreType: "SAY",
    capacity: 60,
    enrollment: 60,
    gender: "Male/Female",
    fieldRate: "%10",
  },
  {
    id: 106533057,
    departmentName: "Bilgisayar Mühendisliği",
    scoreType: "SAY",
    capacity: 60,
    enrollment: 60,
    gender: "Male/Female",
    fieldRate: "%10",
  },
  {
    id: 106516657,
    departmentName: "Bilgisayar Mühendisliği",
    scoreType: "SAY",
    capacity: 60,
    enrollment: 60,
    gender: "Male/Female",
    fieldRate: "%10",
  },
  {
    id: 106544057,
    departmentName: "Bilgisayar Mühendisliği",
    scoreType: "SAY",
    capacity: 60,
    enrollment: 60,
    gender: "Male/Female",
    fieldRate: "%10",
  },
  {
    id: 106599057,
    departmentName: "Bilgisayar Mühendisliği",
    scoreType: "SAY",
    capacity: 60,
    enrollment: 60,
    gender: "Male/Female",
    fieldRate: "%10",
  },
  {
    id: 106598057,
    departmentName: "Bilgisayar Mühendisliği",
    scoreType: "SAY",
    capacity: 60,
    enrollment: 60,
    gender: "Male/Female",
    fieldRate: "%10",
  },
  {
    id: 106870057,
    departmentName: "Bilgisayar Mühendisliği",
    scoreType: "SAY",
    capacity: 60,
    enrollment: 60,
    gender: "Male/Female",
    fieldRate: "%10",
  },
  {
    id: 106555057,
    departmentName: "Bilgisayar Mühendisliği",
    scoreType: "SAY",
    capacity: 60,
    enrollment: 60,
    gender: "Male/Female",
    fieldRate: "%10",
  },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DepartmentList() {
  return (
    <div>
      <Typography align="center">Üniversitenize Ait Bölümler</Typography>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
}
