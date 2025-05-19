import { Box } from "@mui/material";
import React from "react";
import FirstNavi from "../components/FirstNavi";
import University from "../components/University";

function UniversityLoginPage() {
  return (
    <div>
      <Box sx={{ flexGrow: 1, margin: "5%" }}>
        <University></University>
      </Box>
    </div>
  );
}

export default UniversityLoginPage;
