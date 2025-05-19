import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from "react-redux";
import { getDepartment } from "../redux/departmentSlice";

const columns = [
  { field: "DEPARTMENT_ID", headerName: "DEPARTMENT ID", width: 130 },
  { field: "DEPARTMENT_NAME", headerName: "DEPARTMENT NAME", width: 130 },
  { field: "YEAR_ID", headerName: "YEAR", width: 90, type: "number" },
  {
    field: "UNIVERSITY_NAME",
    headerName: "UNIVERSITY_NAME ID",
    width: 130,
  },
  {
    field: "SUM_CAPACITY",
    headerName: "SUM CAPACITY",
    type: "number",
    width: 130,
  },
  {
    field: "SUM_ENROLLMENT",
    headerName: "SUM ENROLLMENT",
    type: "number",
    width: 130,
  },
  { field: "LAST_RANK", headerName: "LAST RANK", type: "number", width: 130 },
  { field: "LAST_SCORE", headerName: "LAST SCORE", type: "float", width: 130 },
  { field: "FIRST_RANK", headerName: "FIRST RANK", type: "number", width: 130 },

  {
    field: "FIRST_SCORE",
    headerName: "FIRST SCORE",
    width: 130,
  },
];

const paginationModel = { page: 0, pageSize: 5 };

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={departments || []}
        columns={columns}
        getRowId={(row) => `${row.DEPARTMENT_ID}-${row.YEAR_ID}`}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
