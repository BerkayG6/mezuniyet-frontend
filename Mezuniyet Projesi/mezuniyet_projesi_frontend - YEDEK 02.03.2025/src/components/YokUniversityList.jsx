import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const columns = [
  { field: "id", headerName: "University Id", width: 70 },
  { field: "universityName", headerName: "University Name", width: 130 },
  { field: "capacity", headerName: "Capacity", type: "number", width: 130 },
  {
    field: "enrollment",
    headerName: "Enrollment",
    type: "number",
    width: 90,
  },
  {
    field: "fieldRate",
    headerName: "Field Rate",
    type: "number",
    width: 90,
  },
  {
    field: "feature1",
    headerName: "Feature1",
    width: 90,
  },
  {
    field: "feature2",
    headerName: "Feature2",
    width: 90,
  },
  {
    field: "feature3",
    headerName: "Feature3",
    width: 90,
  },
];

const rows = [
  {
    id: 1020,
    universityName: "Çankaya",
    capacity: 1000,
    enrollment: 1000,
    fieldRate: 100,
    feature1: "Feature1",
    feature2: "Feature2",
    feature3: "Feature3",
  },
  {
    id: 1045,
    universityName: "Başkent",
    capacity: 220,
    enrollment: 110,
    fieldRate: 50,
    feature1: "Feature1",
    feature2: "Feature2",
    feature3: "Feature3",
  },
  {
    id: 1032,
    universityName: "Hacettepe",
    capacity: 2000,
    enrollment: 2000,
    fieldRate: 100,
    feature1: "Feature1",
    feature2: "Feature2",
    feature3: "Feature3",
  },
  {
    id: 1452,
    universityName: "ODTÜ",
    capacity: 3000,
    enrollment: 2900,
    fieldRate: 98,
    feature1: "Feature1",
    feature2: "Feature2",
    feature3: "Feature3",
  },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function YokUniversityList() {
  return (
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
  );
}
