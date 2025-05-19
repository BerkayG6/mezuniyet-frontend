import React from "react";
import {
  Box,
  Card,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useSelector } from "react-redux";

function Suggestions() {
  const predictState = useSelector((store) => store.predict);
  const studentData = predictState.studentData;
  const predictedData = predictState.data;

  console.log("Suggestions - predictState:", predictState);
  console.log("Suggestions - studentData:", studentData);
  console.log("Suggestions - predictedData:", predictedData);

  if (!studentData || !predictedData) {
    console.log("Suggestions - Missing data");
    return null;
  }

  const { studentRank, selectedDepartment, selectedUniversity } = studentData;

  // Seçilen bölümün puan türünü bul
  const selectedDeptData = predictedData.find(
    (item) =>
      item.university_name === selectedUniversity &&
      item.department_name === selectedDepartment
  );

  console.log("Suggestions - selectedDeptData:", selectedDeptData);

  if (!selectedDeptData) {
    console.log("Suggestions - No selected department data found");
    return null;
  }

  const scoreType = selectedDeptData.score_type_name;
  const rankRange = 5000; // Önerilen bölümler için sıralama aralığı

  // Aynı puan türüne sahip ve sıralama aralığında olan bölümleri filtrele
  const similarDepartments = predictedData
    .filter(
      (item) =>
        item.score_type_name === scoreType &&
        item !== selectedDeptData && // Seçilen bölümü hariç tut
        Math.abs(item.PREDICTED_LAST_RANK - studentRank) <= rankRange
    )
    .sort(
      (a, b) =>
        Math.abs(a.PREDICTED_LAST_RANK - studentRank) -
        Math.abs(b.PREDICTED_LAST_RANK - studentRank)
    )
    .slice(0, 5); // En yakın 5 bölümü al

  console.log("Suggestions - similarDepartments:", similarDepartments);

  if (similarDepartments.length === 0) {
    console.log("Suggestions - No similar departments found");
    return null;
  }

  return (
    <Box sx={{ mt: 4, width: { xs: "90%", sm: "500px" } }}>
      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 2, color: "#553C9A", fontFamily: "'Poppins', sans-serif" }}
        >
          Sizin İçin Önerilen Bölümler
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, color: "#666" }}>
          Sıralamanıza ve puan türünüze göre önerilen bölümler:
        </Typography>
        <List>
          {similarDepartments.map((dept, index) => (
            <React.Fragment key={dept.department_name}>
              <ListItem>
                <ListItemText
                  primary={`${dept.university_name} - ${dept.department_name}`}
                  secondary={`Tahmini Son Sıralama: ${Math.round(dept.PREDICTED_LAST_RANK)}`}
                />
              </ListItem>
              {index < similarDepartments.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Card>
    </Box>
  );
}

export default Suggestions;
