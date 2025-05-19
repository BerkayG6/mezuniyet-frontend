import { Grid2 } from "@mui/material";
import React from "react";
import SelectStudent from "../components/SelectStudent";
import Box from "@mui/material/Box";
import ResultStudent from "../components/ResultStudent";

function PredictStudent() {
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "12%",
        }}
      >
        <Grid2 container spacing={10}>
          <Grid2 size={6}>
            <SelectStudent></SelectStudent>
          </Grid2>
          <Grid2 size={6}>
            <ResultStudent></ResultStudent>
          </Grid2>
        </Grid2>
      </Box>
    </div>
  );
}

export default PredictStudent;
