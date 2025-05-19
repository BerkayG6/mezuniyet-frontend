import React from "react";
import Sregister from "../components/Sregister";
import Box from "@mui/material/Box";

function StudentRegister() {
  return (
    <div>
      <Box sx={{ flexGrow: 1, margin: "5%" }}>
        <Sregister></Sregister>
      </Box>
    </div>
  );
}

export default StudentRegister;
