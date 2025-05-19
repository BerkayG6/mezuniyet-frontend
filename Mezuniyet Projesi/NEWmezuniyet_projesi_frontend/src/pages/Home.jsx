import { Box } from "@mui/material";
import React from "react";
import HomeBody from "../components/HomeBody";

function Home({ tasks }) {
  return (
    <Box sx={{ flexGrow: 1, marginTop: "1%", padding: "2%" }}>
      <HomeBody tasks={tasks} />
    </Box>
  );
}

export default Home;