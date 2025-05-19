import * as React from "react";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
// import UniversityList from "./UniversityList"; // Assuming UniversityListV2 is used
import FilterData from "./FilterData";
import UniversityListV2 from "./UniversityListV2";

// Accept filters prop
export default function UniversityBody({ filters }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid2 container spacing={2}>
        {/* <Grid2 size={4}>
          <FilterData></FilterData>
        </Grid2> */}
        {/* Pass filters to UniversityListV2 */}
        <Grid2 size={12}>
          <UniversityListV2 filters={filters} isUniversityProfile={false}></UniversityListV2>
        </Grid2>
      </Grid2>
    </Box>
  );
}
