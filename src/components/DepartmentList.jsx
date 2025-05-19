import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Box, Typography, Collapse, IconButton, Alert } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { getPredictedDepartment } from "../redux/predictSlice";
import { getConfirm } from "../redux/confirmSlice";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DepartmentOrder from "./DepartmentOrder";

const columns = [
  {
    field: "department_name",
    headerName: "Bölüm İsmi",
    width: 200,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "PREDICTED_LAST_RANK",
    headerName: "2025 Tahmin Edilen Son Sıralama",
    width: 200,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "PREDICTED_FIRST_RANK",
    headerName: "2025 Tahmin Edilen İlk Sıralama",
    width: 200,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "PREDICTED_SUM_ENROLLMENT",
    headerName: "2025 Tahmin Edilen Yerleşen Öğrenci Sayısı",
    width: 250,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "Mean_Predicted",
    headerName: "2025 Tahmin Edilen Ortalama",
    width: 200,
    headerAlign: "center",
    align: "center",
  },
];

const columns2024 = [
  {
    field: "LAST_RANK",
    headerName: "2024 Son Sıralama",
    width: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "PREDICTED_LAST_RANK",
    headerName: "2024 Tahmin Edilen Son Sıralama",
    width: 200,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "FIRST_RANK",
    headerName: "2024 İlk Sıralama",
    width: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "PREDICTED_FIRST_RANK",
    headerName: "2024 Tahmin Edilen İlk Sıralama",
    width: 200,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "SUM_ENROLLMENT",
    headerName: "2024 Yerleşen Öğrenci Sayısı",
    width: 200,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "PREDICTED_SUM_ENROLLMENT",
    headerName: "2024 Tahmin Edilen Yerleşen Öğrenci Sayısı",
    width: 250,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "Mean_Actual",
    headerName: "2024 Gerçek Ortalama",
    width: 170,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "Mean_Predicted",
    headerName: "2024 Tahmin Edilen Ortalama",
    width: 200,
    headerAlign: "center",
    align: "center",
  },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DepartmentList() {
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector((store) => store.predict);
  const { data24, isLoading24 } = useSelector((store) => store.confirm);
  const [expandedRows, setExpandedRows] = React.useState({});
  const [selectedDepartments, setSelectedDepartments] = React.useState([]);

  React.useEffect(() => {
    console.log("Fetching data...");
    dispatch(getPredictedDepartment());
    dispatch(getConfirm());
  }, [dispatch]);

  const handleExpandClick = (rowId) => {
    console.log("Expanding row:", rowId);
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const handleSelectionChange = (selection) => {
    console.log("Selection changed:", selection);
    const selectedRows = filteredData.filter((row) =>
      selection.includes(row.DEPARTMENT_ID)
    );
    console.log("Selected departments:", selectedRows);
    setSelectedDepartments(selectedRows);
  };

  // Debug logs for raw data
  console.log("Raw 2025 data:", data);
  console.log("Raw 2024 data:", data24);

  // Filter data for university ID 2011
  const filteredData = React.useMemo(() => {
    const result = data?.filter((item) => item.UNIVERSITY_ID === 2011) || [];
    console.log("Filtered 2025 data:", result);
    return result;
  }, [data]);

  const filteredData24 = React.useMemo(() => {
    const result = data24?.filter((item) => item.university_id === 2011) || [];
    console.log("Filtered 2024 data:", result);
    return result;
  }, [data24]);

  // Create a mapping of department IDs to their 2024 data
  const departmentDataMap = React.useMemo(() => {
    const map = {};
    filteredData24.forEach((item) => {
      map[item.DEPARTMENT_ID] = item;
    });
    console.log("Department data map:", map);
    return map;
  }, [filteredData24]);

  console.log("Expanded Rows:", expandedRows);
  console.log("Selected Departments:", selectedDepartments);

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
          Üniversitenize Ait Bölümler (2025 Verileri)
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
            rows={filteredData}
            columns={[
              ...columns,
              {
                field: "actions",
                headerName: "2024 Verileri",
                width: 150,
                sortable: false,
                renderCell: (params) => {
                  const has2024Data =
                    departmentDataMap[params.row.DEPARTMENT_ID];
                  return (
                    <IconButton
                      onClick={() =>
                        handleExpandClick(params.row.DEPARTMENT_ID)
                      }
                      size="small"
                      disabled={!has2024Data}
                    >
                      {expandedRows[params.row.DEPARTMENT_ID] ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  );
                },
              },
            ]}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            onRowSelectionModelChange={handleSelectionChange}
            loading={isLoading}
            getRowId={(row) => row.DEPARTMENT_ID}
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
                color: "black",
              },
              "& .MuiDataGrid-sortIcon": {
                color: "black",
              },
            }}
          />
          {filteredData.map((row) => {
            const department2024Data = departmentDataMap[row.DEPARTMENT_ID];
            if (!department2024Data) return null;

            return (
              <Collapse
                key={row.DEPARTMENT_ID}
                in={expandedRows[row.DEPARTMENT_ID]}
                timeout="auto"
                unmountOnExit
              >
                <Box sx={{ p: 2, backgroundColor: "#F8F5FF" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontFamily: "'Poppins', sans-serif",
                      color: "#553C9A",
                    }}
                  >
                    2024 Verileri - {department2024Data.department_name}
                  </Typography>
                  <DataGrid
                    rows={[department2024Data]}
                    columns={columns2024}
                    hideFooter
                    getRowId={(row) => row.DEPARTMENT_ID}
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
                    }}
                  />
                </Box>
              </Collapse>
            );
          })}
        </Paper>
        {selectedDepartments.length > 0 && (
          <DepartmentOrder
            selectedDepartments={selectedDepartments}
            departmentDataMap={departmentDataMap}
          />
        )}
      </Box>
    </Box>
  );
}
