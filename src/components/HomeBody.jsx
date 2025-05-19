import { Box } from "@mui/material";
import React from "react";
import Cards from "./Cards";

function HomeBody() {
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "5%",
          alignItems: "center",
        }}
      >
        <Cards></Cards>
      </Box>
    </div>
  );
}

export default HomeBody;
