import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { Button, Divider, Stack, Typography, FormControlLabel } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";

// These lists should ideally come from the backend or a central place
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

function FilterData({ onApplyFilters }) {
  const [universities, setUniversities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filterValues, setFilterValues] = useState({
    universityName: '',
    departmentName: '',
    universityType: [],
    scoreType: [],
    minimumRankMin: '',
    minimumRankMax: '',
    city: '',
  });

  // Fetch universities and departments on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [universitiesRes, departmentsRes] = await Promise.all([
          axios.get('http://localhost:5000/universities-list'),
          axios.get('http://localhost:5000/departments-list')
        ]);
        setUniversities(universitiesRes.data);
        setDepartments(departmentsRes.data);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (name, value) => {
    setFilterValues(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, value) => (event) => {
    setFilterValues(prev => {
      const list = prev[name];
      if (event.target.checked) {
        return { ...prev, [name]: [...list, value] };
      } else {
        return { ...prev, [name]: list.filter(item => item !== value) };
      }
    });
  };

  const handleFilterButtonClick = () => {
    onApplyFilters(filterValues);
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
        {/* University Autocomplete */}
        <Autocomplete
          freeSolo
          options={universities}
          value={filterValues.universityName}
          onInputChange={(event, newValue) => handleInputChange('universityName', newValue)}
          onChange={(event, newValue) => handleInputChange('universityName', newValue || '')}
          sx={{ width: 200 }}
          renderInput={(params) => (
            <TextField {...params} label="Üniversite Adı" />
          )}
        />

        {/* Department Autocomplete */}
          <Autocomplete
          freeSolo
            options={departments}
          value={filterValues.departmentName}
          onInputChange={(event, newValue) => handleInputChange('departmentName', newValue)}
          onChange={(event, newValue) => handleInputChange('departmentName', newValue || '')}
          sx={{ width: 200 }}
          renderInput={(params) => (
            <TextField {...params} label="Bölüm Adı" />
            )}
          />

        {/* University Type Checkboxes */}
        <FormGroup row>
          <FormControlLabel
            control={<Checkbox checked={filterValues.universityType.includes('Devlet')} onChange={handleCheckboxChange('universityType', 'Devlet')}/>}
            label="Devlet"
          />
          <FormControlLabel
            control={<Checkbox checked={filterValues.universityType.includes('Vakıf')} onChange={handleCheckboxChange('universityType', 'Vakıf')}/>}
            label="Vakıf"
          />
          <FormControlLabel
            control={<Checkbox checked={filterValues.universityType.includes('KKTC')} onChange={handleCheckboxChange('universityType', 'KKTC')}/>}
            label="KKTC"
          />
          </FormGroup>

        {/* Score Type Checkboxes */}
        <FormGroup row>
          <FormControlLabel
            control={<Checkbox checked={filterValues.scoreType.includes('SAY')} onChange={handleCheckboxChange('scoreType', 'SAY')}/>}
            label="SAY"
          />
          <FormControlLabel
            control={<Checkbox checked={filterValues.scoreType.includes('SÖZ')} onChange={handleCheckboxChange('scoreType', 'SÖZ')}/>}
            label="SÖZ"
          />
          <FormControlLabel
            control={<Checkbox checked={filterValues.scoreType.includes('EA')} onChange={handleCheckboxChange('scoreType', 'EA')}/>}
            label="EA"
          />
          <FormControlLabel
            control={<Checkbox checked={filterValues.scoreType.includes('TYT')} onChange={handleCheckboxChange('scoreType', 'TYT')}/>}
            label="TYT"
          />
          </FormGroup>

        {/* Rank Range */}
        <TextField
          name="minimumRankMin"
          label="Min Sıralama"
          type="number"
          value={filterValues.minimumRankMin}
          onChange={(e) => handleInputChange('minimumRankMin', e.target.value)}
          sx={{ width: 120 }}
        />
        <TextField
          name="minimumRankMax"
          label="Max Sıralama"
          type="number"
          value={filterValues.minimumRankMax}
          onChange={(e) => handleInputChange('minimumRankMax', e.target.value)}
          sx={{ width: 120 }}
        />

        {/* Filter Button */}
        <Button variant="contained" color="success" onClick={handleFilterButtonClick}>
            Filtrele
          </Button>
        </Stack>
      </Box>
  );
}

export default FilterData;
