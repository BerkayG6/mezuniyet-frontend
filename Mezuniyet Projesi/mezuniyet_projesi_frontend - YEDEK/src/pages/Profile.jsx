import { Box, Grid2 } from "@mui/material";
import React from "react";
import StudentInfo from "../components/StudentInfo";
import StudentInfo2 from "../components/StudentInfo2";

function Profile() {
  return (
    <Box
      sx={{
        display: "grid",
        marginTop: "12%",
        justifyContent: "center",
      }}
    >
      <Grid2 container spacing={10}>
        <Grid2>
          <StudentInfo></StudentInfo>
        </Grid2>
        <Grid2>
          <StudentInfo2></StudentInfo2>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default Profile;
