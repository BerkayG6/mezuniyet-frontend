import { Box, TextField, Typography } from "@mui/material";
import React from "react";
import { Stack } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";

const scoreType = ["SAY", "SÖZ", "EA", "TYT"];
const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027];
const universities = ["ODTÜ", "Boğaziçi", "İTÜ", "Hacettepe", "Ankara"];
const departments = [
  "Bilgisayar Mühendisliği",
  "Makine Mühendisliği",
  "İnşaat Mühendisliği",
  "Elektrik Mühendisliği",
  "Kimya Mühendisliği",
];

function SelectStudent() {
  return (
    <div>
      <Box
        sx={{
          display: "inline-block",
          border: "1px solid #e0e0e0",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h5" align="center">
            Student Information Section
          </Typography>
          <Autocomplete
            disablePortal
            options={scoreType}
            sx={{ width: 300 }}
            renderInput={(score) => <TextField {...score} label="Puan Türü" />}
          />
          <TextField
            id="outlined-basic"
            variant="outlined"
            label="Puan"
          ></TextField>
          <TextField
            id="outlined-basic"
            variant="outlined"
            label="Sıralama"
          ></TextField>
          <Autocomplete
            disablePortal
            options={years}
            sx={{ width: 300 }}
            renderInput={(year) => <TextField {...year} label="Yıl" />}
          />
          <Autocomplete
            disablePortal
            options={universities}
            sx={{ width: 300 }}
            renderInput={(university) => (
              <TextField {...university} label="Üniversite" />
            )}
          />
          <Autocomplete
            disablePortal
            options={departments}
            sx={{ width: 300 }}
            renderInput={(department) => (
              <TextField {...department} label="Bölüm" />
            )}
          />
          <Button color="error" variant="contained">
            Predict
          </Button>
        </Stack>
      </Box>
    </div>
  );
}

export default SelectStudent;
