import * as React from "react";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import UniversityList from "./UniversityList";
import FilterData from "./FilterData";

export default function UniversityBody() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid2 container spacing={2}>
        <Grid2 size={4}>
          <FilterData></FilterData>
        </Grid2>
        <Grid2 size={8}>
          <UniversityList></UniversityList>
        </Grid2>
      </Grid2>
    </Box>
  );
}
