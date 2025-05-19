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
import { getDepartment } from "../redux/departmentSlice";
import CircularProgress from "@mui/material/CircularProgress";
import DepartmentVisualization from "./DepartmentVisualization";

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
    field: "FIRST_SCORE",
    headerName: "FIRST SCORE",
    type: "number",
    flex: 0.8,
    headerAlign: "center",
    align: "center",
  },
];

const selectedColumns = [
  {
    field: "department_name",
    headerName: "Bölüm Adı",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "university_name",
    headerName: "Üniversite",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "year_id",
    headerName: "Yıl",
    flex: 0.5,
    headerAlign: "center",
    align: "center",
  },
];

const paginationModel = { page: 0, pageSize: 10 };

// Helper function to convert object keys to lowercase and format numerical data
const convertKeysToLowerCaseAndFormat = (obj) => {
  const newObj = {};
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const lowerCaseKey = key.toLowerCase();
      let value = obj[key];

      // Convert specific numerical fields from string to number, handling comma decimal
      if (['last_score', 'first_score'].includes(lowerCaseKey) && typeof value === 'string') {
        value = parseFloat(value.replace(',', '.'));
        if (isNaN(value)) { // Handle cases where conversion fails
            value = null; // Or 0, or keep original string, depending on desired behavior
        }
      }
      // You might want to do similar checks for other number types like GENERAL_CAPACITY if they can be strings

      newObj[lowerCaseKey] = value;
    }
  }
  return newObj;
};

export default function UniversityListV2({ filters, isUniversityProfile }) {
  const dispatch = useDispatch();
  const {
    data: departments,
    isLoading,
    error,
  } = useSelector((store) => {
    console.log("Raw departments data from Redux store:", store.department.data);
    return store.department;
  });

  // Veriyi dönüştürme işlemini kaldırıyoruz çünkü backend'den gelen formatı kullanacağız
  const processedDepartments = departments ? departments.map(dept => {
    const newDept = { ...dept }; // Mevcut objeyi kopyala
    // LAST_SCORE ve FIRST_SCORE stringlerini sayıya çevir
    if (typeof newDept.LAST_SCORE === 'string') {
      newDept.LAST_SCORE = parseFloat(newDept.LAST_SCORE.replace(',', '.'));
      if (isNaN(newDept.LAST_SCORE)) newDept.LAST_SCORE = null; // Geçersiz dönüşümü null yap
    }
    if (typeof newDept.FIRST_SCORE === 'string') {
      newDept.FIRST_SCORE = parseFloat(newDept.FIRST_SCORE.replace(',', '.'));
      if (isNaN(newDept.FIRST_SCORE)) newDept.FIRST_SCORE = null; // Geçersiz dönüşümü null yap
    }
    // Diğer alanların anahtarlarını büyük harf kalacak
    return newDept;
  }) : [];
  console.log("Processed departments for DataGrid:", processedDepartments);
  console.log("Sample row from processed departments:", processedDepartments?.[0]);
  console.log("LAST_SCORE values:", processedDepartments?.map(d => d.LAST_SCORE).slice(0, 5));
  console.log("FIRST_SCORE values:", processedDepartments?.map(d => d.FIRST_SCORE).slice(0, 5));

  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [visualizationOptions, setVisualizationOptions] = useState({
    fieldRate: false,
    lastScore: false,
    firstScore: false,
    ranks: false,
  });

  // isUniversityProfile'a göre filtreleme yaparken isUniversityProfile parametresini de gönderelim
  useEffect(() => {
    dispatch(getDepartment({ filters, isUniversityProfile }));
  }, [dispatch, filters, isUniversityProfile]);

  // handleSelectionChange fonksiyonunda da gelen verinin anahtarlarını küçük harfe çevirip formatlayalım
  const handleSelectionChange = (selection) => {
    const selectedRows = processedDepartments // Use processedDepartments here
      .filter((dept) =>
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
          Üniversite Bölüm Listesi
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
                rows={processedDepartments || []}
                columns={columns}
                getRowId={(row) => {
                  return `${row.DEPARTMENT_ID}-${row.YEAR_ID}`;
                }}
                onStateChange={(state) => {
                }}
                initialState={{
                  pagination: { paginationModel },
                }}
                pageSizeOptions={[10, 25, 50]}
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

          {/* Selected Departments and Visualization Options */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {/* Selected Departments Table */}
              <Grid item xs={12} md={8}>
                <Paper
                  sx={{
                    width: "100%",
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      p: 2,
                      backgroundColor: "#553C9A",
                      color: "white",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    Seçili Bölümler
                  </Typography>
                  <DataGrid
                    rows={selectedDepartments.map(dept => convertKeysToLowerCaseAndFormat(dept))}
                    columns={selectedColumns.map(col => ({ ...col, field: col.field.toLowerCase() }))}
                    getRowId={(row) => `${row.department_id}-${row.year_id}`}
                    hideFooter
                    autoHeight
                    sx={{
                      border: 0,
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#F8F5FF",
                        color: "#553C9A",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                      },
                      "& .MuiDataGrid-cell": {
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.9rem",
                        color: "#553C9A",
                      },
                    }}
                  />
                </Paper>
              </Grid>

              {/* Visualization Options */}
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      color: "#553C9A",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    Görselleştirme Seçenekleri
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={visualizationOptions.fieldRate}
                          onChange={() => handleCheckboxChange("fieldRate")}
                          sx={{
                            color: "#553C9A",
                            "&.Mui-checked": {
                              color: "#553C9A",
                            },
                          }}
                        />
                      }
                      label="Doluluk Oranı"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={visualizationOptions.lastScore}
                          onChange={() => handleCheckboxChange("lastScore")}
                          sx={{
                            color: "#553C9A",
                            "&.Mui-checked": {
                              color: "#553C9A",
                            },
                          }}
                        />
                      }
                      label="Son Yerleştirme Puanı"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={visualizationOptions.firstScore}
                          onChange={() => handleCheckboxChange("firstScore")}
                          sx={{
                            color: "#553C9A",
                            "&.Mui-checked": {
                              color: "#553C9A",
                            },
                          }}
                        />
                      }
                      label="İlk Yerleştirme Puanı"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={visualizationOptions.ranks}
                          onChange={() => handleCheckboxChange("ranks")}
                          sx={{
                            color: "#553C9A",
                            "&.Mui-checked": {
                              color: "#553C9A",
                            },
                          }}
                        />
                      }
                      label="Sıralama Değişimi"
                    />
                  </FormGroup>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Visualization Component */}
          {selectedDepartments.length > 0 && (
            <Grid item xs={12}>
              <DepartmentVisualization
                departments={selectedDepartments}
                options={visualizationOptions}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}
