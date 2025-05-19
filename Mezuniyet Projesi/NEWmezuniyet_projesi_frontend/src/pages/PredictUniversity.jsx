import { Grid2 } from "@mui/material";
import React from "react";
import Box from "@mui/material/Box";
import DepartmentList from "../components/DepartmentList";
import DepartmentOrder from "../components/DepartmentOrder";

function PredictUniversity() {
  return (
    <div>
      <Box
        sx={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: "12%",
          marginLeft: "5%",
          marginRight: "5%",
        }}
      >
        <Grid2 container spacing={10}>
          <Grid2 size={6}>
            <DepartmentList></DepartmentList>
          </Grid2>
          <Grid2 size={6}>
            <DepartmentOrder></DepartmentOrder>
          </Grid2>
        </Grid2>
      </Box>
    </div>
  );
}

export default PredictUniversity;
