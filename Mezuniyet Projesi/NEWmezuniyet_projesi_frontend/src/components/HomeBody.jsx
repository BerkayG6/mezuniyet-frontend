import { Box } from "@mui/material";
import React from "react";
import Cards from "./Cards";

function HomeBody({ tasks }) {
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "10%",
          alignItems: "center",
        }}
      >
        <Cards tasks={tasks} />
      </Box>
    </div>
  );
}

export default HomeBody;