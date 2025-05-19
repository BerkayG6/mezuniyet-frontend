import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getDepartment } from "../redux/departmentSlice";
import CircularProgress from "@mui/material/CircularProgress";

const columns = [
  {
    field: "DEPARTMENT_ID",
    headerName: "DEPARTMENT ID",
    flex: 0.8,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "DEPARTMENT_NAME",
    headerName: "DEPARTMENT NAME",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "YEAR_ID",
    headerName: "YEAR",
    flex: 0.5,
    type: "number",
    headerAlign: "center",
    align: "center",
  },
  {
    field: "UNIVERSITY_NAME",
    headerName: "UNIVERSITY NAME",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "SUM_CAPACITY",
    headerName: "SUM CAPACITY",
    type: "number",
    flex: 0.8,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "SUM_ENROLLMENT",
    headerName: "SUM ENROLLMENT",
    type: "number",
    flex: 0.8,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "LAST_RANK",
    headerName: "LAST RANK",
    type: "number",
    flex: 0.8,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "LAST_SCORE",
    headerName: "LAST SCORE",
    type: "float",
    flex: 0.8,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "FIRST_RANK",
    headerName: "FIRST RANK",
    type: "number",
    flex: 0.8,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "FIRST_SCORE",
    headerName: "FIRST SCORE",
    flex: 0.8,
    headerAlign: "center",
    align: "center",
  },
];

const paginationModel = { page: 0, pageSize: 10 };

export default function UniversityListV2() {
  const dispatch = useDispatch();
  const {
    data: departments,
    isLoading,
    error,
  } = useSelector((store) => store.department);

  useEffect(() => {
    dispatch(getDepartment());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress sx={{ color: "#553C9A" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          color: "#553C9A",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <Typography variant="h6">Error: {error}</Typography>
      </Box>
    );
  }

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
          Üniversite Bölüm Listesi
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
            rows={departments || []}
            columns={columns}
            getRowId={(row) => `${row.DEPARTMENT_ID}-${row.YEAR_ID}`}
            initialState={{
              pagination: { paginationModel },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            pageSize={10}
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight={false}
            sx={{
              border: 0,
              minHeight: 650,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#553C9A",
                color: "black",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: "0.95rem",
                minHeight: "60px !important",
                maxHeight: "60px !important",
              },
              "& .MuiDataGrid-cell": {
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem",
                padding: "12px 16px",
                whiteSpace: "normal",
                lineHeight: "1.2",
              },
              "& .MuiDataGrid-row": {
                minHeight: "52px !important",
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
              "& .MuiDataGrid-virtualScroller": {
                minHeight: "530px",
              },
            }}
          />
        </Paper>
      </Box>
    </Box>
  );
}
