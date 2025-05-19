import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import {
  Box,
  Typography,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { getConfirm } from "../redux/confirmSlice";

const columns = [
  {
    field: "DEPARTMENT_ID",
    headerName: "DEPARTMENT ID",
    flex: 0.8,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "department_name",
    headerName: "DEPARTMENT NAME",
    flex: 0.8,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "university_name",
    headerName: "UNIVERSITY NAME",
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
    field: "PREDICTED_SUM_ENROLLMENT",
    headerName: "PREDICTED SUM ENROLLMENT",
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
    field: "PREDICTED_LAST_RANK",
    headerName: "PREDICTED LAST RANK",
    type: "number",
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
    field: "PREDICTED_FIRST_RANK",
    headerName: "PREDICTED FIRST RANK",
    type: "number",
    flex: 0.8,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "Mean_Actual",
    headerName: "MEAN ACTUAL",
    type: "number",
    flex: 0.8,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "Mean_Predicted",
    headerName: "MEAN PREDICTED",
    type: "number",
    flex: 0.8,
    headerAlign: "center",
    align: "center",
  },
];

const selectedColumns = [
  {
    field: "DEPARTMENT_NAME",
    headerName: "Bölüm Adı",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "UNIVERSITY_NAME",
    headerName: "Üniversite",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "YEAR_ID",
    headerName: "Yıl",
    flex: 0.5,
    headerAlign: "center",
    align: "center",
  },
];

const paginationModel = { page: 0, pageSize: 10 };

export default function Confirm() {
  const dispatch = useDispatch();
  const {
    data24: departments,
    isLoading,
    error,
  } = useSelector((store) => store.confirm);

  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [visualizationOptions, setVisualizationOptions] = useState({
    fieldRate: false,
    lastScore: false,
    firstScore: false,
    ranks: false,
  });

  useEffect(() => {
    dispatch(getConfirm());
  }, [dispatch]);

  const handleSelectionChange = (selection) => {
    const selectedRows = departments.filter((dept) =>
      selection.includes(`${dept.DEPARTMENT_ID}-${dept.YEAR_ID}`)
    );
    setSelectedDepartments(selectedRows);
  };

  const handleCheckboxChange = (option) => {
    setVisualizationOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

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
        borderRadius: 10,
      }}
    >
      <Box
        sx={{
          maxWidth: "1800px",
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
          2024 Test ve Gerçek Veriler
        </Typography>

        <Grid container spacing={3}>
          {/* Main Department Table */}
          <Grid item xs={12}>
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
                onRowSelectionModelChange={handleSelectionChange}
                disableRowSelectionOnClick
                autoHeight={false}
                keepNonExistentRowsSelected
                sx={{
                  border: 0,
                  minHeight: 400,
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
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
