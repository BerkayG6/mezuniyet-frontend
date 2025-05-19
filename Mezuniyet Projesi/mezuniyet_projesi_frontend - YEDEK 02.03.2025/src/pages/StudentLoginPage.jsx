import { Box } from "@mui/material";
import React from "react";
import FirstNavi from "../components/FirstNavi";
import Student from "../components/Student";

function StudentLoginPage() {
  return (
    <div>
      <Box sx={{ flexGrow: 1, margin: "5%" }}>
        <Student></Student>
      </Box>
    </div>
  );
}

export default StudentLoginPage;
