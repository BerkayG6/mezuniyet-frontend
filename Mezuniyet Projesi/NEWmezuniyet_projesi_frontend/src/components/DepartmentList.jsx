import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Box, Typography } from "@mui/material";

const columns = [
  {
    field: "id",
    headerName: "DepartmentId",
    width: 130,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "departmentName",
    headerName: "Department Name",
    width: 250,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "scoreType",
    headerName: "Score Type",
    width: 130,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "capacity",
    headerName: "Capacity",
    type: "number",
    width: 130,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "enrollment",
    headerName: "Enrollment",
    type: "number",
    width: 130,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "fieldRate",
    headerName: "Field Rate",
    width: 130,
    headerAlign: "center",
    align: "center",
  },
];

const rows = [
  {
    id: 106564057,
    departmentName: "Bilgisayar Mühendisliği",
    scoreType: "SAY",
    capacity: 60,
    enrollment: 60,
    fieldRate: "%10",
  },
  {
    id: 106522057,
    departmentName: "Bilgisayar Mühendisliği",
    scoreType: "SAY",
    capacity: 60,
    enrollment: 60,
    fieldRate: "%10",
  },
  {
    id: 106533057,
    departmentName: "Bilgisayar Mühendisliği",
    scoreType: "SAY",
    capacity: 60,
    enrollment: 60,
    fieldRate: "%10",
  },
  {
    id: 106516657,
    departmentName: "Bilgisayar Mühendisliği",
    scoreType: "SAY",
    capacity: 60,
    enrollment: 60,
    fieldRate: "%10",
  },
  {
    id: 106544057,
    departmentName: "Bilgisayar Mühendisliği",
    scoreType: "SAY",
    capacity: 60,
    enrollment: 60,
    fieldRate: "%10",
  },
  {
    id: 106599057,
    departmentName: "Bilgisayar Mühendisliği",
    scoreType: "SAY",
    capacity: 60,
    enrollment: 60,
    fieldRate: "%10",
  },
  {
    id: 106598057,
    departmentName: "Bilgisayar Mühendisliği",
    scoreType: "SAY",
    capacity: 60,
    enrollment: 60,
    fieldRate: "%10",
  },
  {
    id: 106870057,
    departmentName: "Bilgisayar Mühendisliği",
    scoreType: "SAY",
    capacity: 60,
    enrollment: 60,
    fieldRate: "%10",
  },
  {
    id: 106555057,
    departmentName: "Bilgisayar Mühendisliği",
    scoreType: "SAY",
    capacity: 60,
    enrollment: 60,
    fieldRate: "%10",
  },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DepartmentList() {
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
          marginTop: "2%",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: 4,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            color: "#553C9A",
            letterSpacing: "-0.5px",
          }}
        >
          Üniversitenize Ait Bölümler
        </Typography>
        <Paper
          sx={{
            width: "100%",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
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
              "& .MuiCheckbox-root": {
                color: "#553C9A",
              },
              "& .MuiDataGrid-columnSeparator": {
                display: "none",
              },
              "& .MuiDataGrid-menuIcon": {
                color: "white",
              },
              "& .MuiDataGrid-sortIcon": {
                color: "white",
              },
            }}
          />
        </Paper>
      </Box>
    </Box>
  );
}
