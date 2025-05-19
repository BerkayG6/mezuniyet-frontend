import React from "react";
import Calculate from "../components/Calculate";
import { Box } from "@mui/material";

function CalculateRank() {
  return (
    <div>
      <Box
        sx={{
          marginTop: "10%",
        }}
      >
        <Calculate></Calculate>
      </Box>
    </div>
  );
}

export default CalculateRank;
