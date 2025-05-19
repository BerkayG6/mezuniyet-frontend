import React from "react";
import SqlQueries from "../components/sqlQueries";
import { Box } from "@mui/material";

function SQLQueryPage() {
  return (
    <div>
      <Box
        sx={{
          display: "grid",
          marginTop: "12%",
          justifyContent: "center",
        }}
      >
        <SqlQueries></SqlQueries>
      </Box>
    </div>
  );
}

export default SQLQueryPage;
