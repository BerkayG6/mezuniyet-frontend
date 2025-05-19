import React from "react";
import Box from "@mui/material/Box";
import { Button, Divider, Stack, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const universities = [
  "Çankaya Üniversitesi",
  "Başkent Üniversitesi",
  "Hacettepe Üniversitesi",
];
const departments = [
  "Yazılım Mühendisliği",
  "Hukuk",
  "Aşcılık",
  "Bilgisayar Mühendisliği",
];
const cities = ["Ankara", "İstanbul", "İzmir", "Eskişehir"];

function FilterData() {
  return (
    <div>
      <Box
        sx={{
          display: "inline-block",
          border: "1px solid #e0e0e0",
          padding: "10px",
          borderRadius: "10px",
        }}
      >
        <Stack spacing={2}>
          <Typography>895 tane bölüm listeleniyor</Typography>
          <Typography>Genel Bölümler</Typography>
          <Autocomplete
            disablePortal
            options={departments}
            sx={{ width: "100%" }}
            renderInput={(department) => (
              <TextField {...department} label="Filter" />
            )}
          />
          <Divider></Divider>
          <Typography>Üniversite İsmi</Typography>
          <Autocomplete
            disablePortal
            options={universities}
            sx={{ width: "100%" }}
            renderInput={(university) => (
              <TextField {...university} label="Filter" />
            )}
          />
          <Divider></Divider>
          <Typography>Üniversite Türü</Typography>
          <FormGroup
            sx={{ display: "flex", flexDirection: "row", gap: "10px" }}
          >
            <FormControlLabel control={<Checkbox />} label="Devlet" />
            <FormControlLabel control={<Checkbox />} label="Vakıf" />
            <FormControlLabel control={<Checkbox />} label="KKTC" />
          </FormGroup>
          <Divider></Divider>
          <Typography>Puan Türü</Typography>
          <FormGroup
            sx={{ display: "flex", flexDirection: "row", gap: "10px" }}
          >
            <FormControlLabel control={<Checkbox />} label="SAY" />
            <FormControlLabel control={<Checkbox />} label="SÖZ" />
            <FormControlLabel control={<Checkbox />} label="EA" />
            <FormControlLabel control={<Checkbox />} label="TYT" />
          </FormGroup>
          <Divider></Divider>
          <Typography>Sıralama Aralığı</Typography>
          <TextField id="outlined-basic" label="En Az" variant="outlined" />
          <TextField id="outlined-basic" label="En Çok" variant="outlined" />
          <Button variant="contained">Sırala</Button>
          <Divider></Divider>
          <Typography>Bulunduğu Şehir</Typography>
          <Autocomplete
            disablePortal
            options={cities}
            sx={{ width: "100%" }}
            renderInput={(city) => <TextField {...city} label="Filter" />}
          />
          <Divider></Divider>
          <Button variant="contained" color="success">
            Filtrele
          </Button>
        </Stack>
      </Box>
    </div>
  );
}

export default FilterData;
