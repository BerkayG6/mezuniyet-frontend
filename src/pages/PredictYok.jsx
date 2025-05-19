import React from "react";
import YokUniversityList from "../components/YokUniversityList";
import CompareUniversities from "../components/CompareUniversities";
import { Box } from "@mui/system";
import Grid2 from "@mui/material/Grid2";

function PredictYok() {
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
          <Grid2 size={12}>
            <YokUniversityList></YokUniversityList>
          </Grid2>
        </Grid2>
      </Box>
    </div>
  );
}

export default PredictYok;
