import { Box, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { getUniversity } from "../redux/universitySlice";
import { getDepartment } from "../redux/departmentSlice";

const scoreType = ["SAY", "SÖZ", "EA", "TYT"];
const years = [2025];

function SelectStudent() {
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [uniqueDepartments, setUniqueDepartments] = useState([]);

  const dispatch = useDispatch();
  const {
    data: universities,
    isLoading,
    error,
  } = useSelector((store) => store.university);
  const { data: allDepartments } = useSelector((store) => store.department);

  useEffect(() => {
    dispatch(getUniversity());
    dispatch(getDepartment());
  }, [dispatch]);

  useEffect(() => {
    if (
      selectedUniversity &&
      universities?.length > 0 &&
      allDepartments?.length > 0
    ) {
      console.log("Seçilen Üniversite:", selectedUniversity);

      const selectedUniversityId = universities.find(
        (university) => university.university_name === selectedUniversity
      )?.university_id;

      if (selectedUniversityId) {
        const filteredDepartments = allDepartments.filter(
          (department) => department.UNIVERSITY_ID === selectedUniversityId
        );

        setDepartments(filteredDepartments);

        const uniqueDeptList = Array.from(
          new Set(filteredDepartments.map((dept) => dept.DEPARTMENT_NAME))
        ).map((name) =>
          filteredDepartments.find((dept) => dept.DEPARTMENT_NAME === name)
        );

        setUniqueDepartments(uniqueDeptList);
      } else {
        setDepartments([]);
        setUniqueDepartments([]);
      }
    }
  }, [selectedUniversity, universities, allDepartments]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Box
        sx={{
          display: "inline-block",
          border: "1px solid #e0e0e0",
          padding: "20px",
          borderRadius: 5,
          boxShadow: 5,
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
            renderInput={(params) => (
              <TextField {...params} label="Puan Türü" />
            )}
          />
          <TextField variant="outlined" label="Puan" />
          <TextField variant="outlined" label="Sıralama" />
          <Autocomplete
            disablePortal
            options={years}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Yıl" />}
          />
          <Autocomplete
            value={selectedUniversity}
            onChange={(event, newValue) => {
              setSelectedUniversity(newValue);
            }}
            disablePortal
            options={(universities || []).map(
              (university) => university.university_name
            )}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Üniversite" />
            )}
          />
          <Autocomplete
            disablePortal
            options={uniqueDepartments.map(
              (department) => department.DEPARTMENT_NAME
            )}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Bölüm" />}
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
