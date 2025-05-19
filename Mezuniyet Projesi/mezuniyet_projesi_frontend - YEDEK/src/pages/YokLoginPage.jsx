import { Box } from "@mui/material";
import React from "react";
import FirstNavi from "../components/FirstNavi";
import Yok from "../components/Yok";

function YokLoginPage() {
  return (
    <div>
      <Box sx={{ flexGrow: 1, margin: "5%" }}>
        <Yok></Yok>
      </Box>
    </div>
  );
}

export default YokLoginPage;
