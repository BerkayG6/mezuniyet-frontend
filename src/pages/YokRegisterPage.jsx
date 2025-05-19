import React from 'react';
import Yregister from '../components/Yregister';
import { Box } from '@mui/material';

function YokRegisterPage() {
  return (
    <div>
      <Box
        sx={{
          display: "grid",
          marginTop: "12%",
          justifyContent: "center",
        }}
      >
        <Yregister></Yregister>
      </Box>
    </div>
  );
}

export default YokRegisterPage; 