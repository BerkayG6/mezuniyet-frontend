import { Box } from "@mui/material";
import React from "react";
import HomeBody from "../components/HomeBody";

function Home() {
  return (
    <Box sx={{ flexGrow: 1, marginTop: "2%", padding: "2%" }}>
      <HomeBody></HomeBody>
    </Box>
  );
}

export default Home;
