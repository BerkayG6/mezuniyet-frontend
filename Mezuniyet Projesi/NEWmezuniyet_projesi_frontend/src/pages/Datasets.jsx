import * as React from "react";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import UniversityList from "../components/UniversityList";
import FilterData from "../components/FilterData";
import FirstNavi from "../components/FirstNavi";
import UniversityBody from "../components/UniversityBody";

export default function Datasets() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        marginTop: "10%",
        marginLeft: "5%",
        marginRight: "5%",
      }}
    >
      <FirstNavi></FirstNavi>
      <UniversityBody></UniversityBody>
    </Box>
  );
}
