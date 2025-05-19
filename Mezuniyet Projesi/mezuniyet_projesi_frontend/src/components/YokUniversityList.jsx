import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Box, Typography } from "@mui/material";

const columns = [
  {
    field: "id",
    headerName: "University ID",
    width: 130,
    headerAlign: "center",
    align: "center",
    flex: 1,
  },
  {
    field: "universityName",
    headerName: "University Name",
    width: 250,
    headerAlign: "center",
    align: "center",
    flex: 1.5,
  },
  {
    field: "capacity",
    headerName: "Capacity",
    type: "number",
    width: 130,
    headerAlign: "center",
    align: "center",
    flex: 1,
  },
  {
    field: "enrollment",
    headerName: "Enrollment",
    type: "number",
    width: 130,
    headerAlign: "center",
    align: "center",
    flex: 1,
  },
  {
    field: "fieldRate",
    headerName: "Field Rate",
    type: "number",
    width: 130,
    headerAlign: "center",
    align: "center",
    flex: 1,
  },
  {
    field: "feature1",
    headerName: "Feature 1",
    width: 130,
    headerAlign: "center",
    align: "center",
    flex: 1,
  },
  {
    field: "feature2",
    headerName: "Feature 2",
    width: 130,
    headerAlign: "center",
    align: "center",
    flex: 1,
  },
  {
    field: "feature3",
    headerName: "Feature 3",
    width: 130,
    headerAlign: "center",
    align: "center",
    flex: 1,
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
          Üniversite Listesi
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
            autoHeight
            sx={{
              border: 0,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#553C9A",
                color: " black",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: "1rem",
                minHeight: "60px !important",
                maxHeight: "60px !important",
              },
              "& .MuiDataGrid-cell": {
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.95rem",
                padding: "16px",
                cursor: "pointer",
              },
              "& .MuiDataGrid-row": {
                minHeight: "60px !important",
                maxHeight: "60px !important",
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
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "#F8F5FF",
                borderTop: "1px solid rgba(107, 70, 193, 0.1)",
                minHeight: "52px",
              },
              "& .MuiTablePagination-root": {
                color: "#553C9A",
                fontFamily: "'Inter', sans-serif",
              },
            }}
          />
        </Paper>
      </Box>
    </Box>
  );
}
