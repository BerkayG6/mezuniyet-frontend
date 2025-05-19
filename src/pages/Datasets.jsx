import * as React from "react";
import { useState } from 'react';
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
// import UniversityList from "../components/UniversityList"; // Assuming UniversityListV2 is used
import FilterData from "../components/FilterData";
import FirstNavi from "../components/FirstNavi";
import UniversityBody from "../components/UniversityBody";

export default function Datasets() {
  const [filters, setFilters] = useState({}); // State to hold filter values

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        marginTop: "10%", // Adjust margin to account for fixed navbar
        marginLeft: "5%",
        marginRight: "5%",
      }}
    >
      {/* Filter Area at the top */}
      <Box sx={{ marginBottom: 4 }}>
        <FilterData onApplyFilters={handleApplyFilters}></FilterData>
      </Box>
      
      {/* Main content area which includes the list */}
      {/* Pass the filters state down */} 
      <UniversityBody filters={filters}></UniversityBody>
      
      {/* Original FirstNavi and UniversityBody are now handled inside the main structure */}
      {/* <FirstNavi></FirstNavi> */}
      {/* <UniversityBody></UniversityBody> */}

    </Box>
  );
}
