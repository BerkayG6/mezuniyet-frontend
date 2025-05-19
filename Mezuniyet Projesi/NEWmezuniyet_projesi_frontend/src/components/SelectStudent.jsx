import { Box, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { getUniversity } from "../redux/universitySlice";
import { getDepartment } from "../redux/departmentSlice";
import Card from "@mui/material/Card";
import SendIcon from "@mui/icons-material/Send";

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

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      fontFamily: "'Inter', sans-serif",
      "&:hover fieldset": {
        borderColor: "#9F7AEA",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#553C9A",
      },
    },
    "& .MuiInputLabel-root": {
      fontFamily: "'Inter', sans-serif",
      "&.Mui-focused": {
        color: "#553C9A",
      },
    },
  };

  return (
    <Box
      sx={{
        padding: "40px",
        backgroundColor: "#F6F0FE",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
      }}
    >
      <Card
        sx={{
          width: { xs: "90%", sm: "500px" },
          padding: 4,
          borderRadius: 3,
          boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
          backgroundColor: "white",
        }}
      >
        <Stack spacing={3}>
          <Typography
            variant="h4"
            align="center"
            sx={{
              mb: 2,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: "#553C9A",
              letterSpacing: "-0.5px",
            }}
          >
            Öğrenci Bilgileri
          </Typography>
          <Autocomplete
            disablePortal
            options={scoreType}
            renderInput={(params) => (
              <TextField {...params} label="Puan Türü" sx={textFieldSx} />
            )}
          />
          <TextField variant="outlined" label="Puan" sx={textFieldSx} />
          <TextField variant="outlined" label="Sıralama" sx={textFieldSx} />
          <Autocomplete
            disablePortal
            options={years}
            renderInput={(params) => (
              <TextField {...params} label="Yıl" sx={textFieldSx} />
            )}
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
            renderInput={(params) => (
              <TextField {...params} label="Üniversite" sx={textFieldSx} />
            )}
          />
          <Autocomplete
            disablePortal
            options={uniqueDepartments.map(
              (department) => department.DEPARTMENT_NAME
            )}
            renderInput={(params) => (
              <TextField {...params} label="Bölüm" sx={textFieldSx} />
            )}
          />
          <Button
            variant="contained"
            size="large"
            endIcon={<SendIcon />}
            sx={{
              backgroundColor: "#553C9A",
              "&:hover": {
                backgroundColor: "#4A3294",
              },
              fontFamily: "'Inter', sans-serif",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "1.1rem",
              padding: "12px 24px",
            }}
          >
            Tahmin Et
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}

export default SelectStudent;
