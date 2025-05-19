import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";

export default function DepartmentVisualization({ departments, options }) {
  const [plotData, setPlotData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generateVisualization = async () => {
      if (!departments.length) return;

      setLoading(true);
      setError(null);

      try {
        // Prepare data for visualization
        const visualizationData = {
          departments: departments.map((dept) => ({
            name: dept.DEPARTMENT_NAME,
            university: dept.UNIVERSITY_NAME,
            year: dept.YEAR_ID,
            fieldRate: (dept.SUM_ENROLLMENT / dept.SUM_CAPACITY) * 100,
            lastScore: parseFloat(dept.LAST_SCORE),
            firstScore: parseFloat(dept.FIRST_SCORE),
            lastRank: parseInt(dept.LAST_RANK),
            firstRank: parseInt(dept.FIRST_RANK),
          })),
          options: options,
        };

        console.log("Sending data to backend:", visualizationData); // Debug log

        const response = await fetch("http://localhost:8000/api/visualize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(visualizationData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.detail || "Failed to generate visualization"
          );
        }

        const data = await response.json();
        console.log("Received response from backend"); // Debug log
        setPlotData(data);
      } catch (err) {
        console.error("Visualization error:", err); // Debug log
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    generateVisualization();
  }, [departments, options]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress sx={{ color: "#553C9A" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          color: "#553C9A",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <Typography variant="h6">Error: {error}</Typography>
      </Box>
    );
  }

  if (!plotData) {
    return null;
  }

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          color: "#553C9A",
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 500,
        }}
      >
        {departments[0]?.DEPARTMENT_NAME} Bölümü Yıllara Göre Analizi
      </Typography>
      <Box
        sx={{
          width: "100%",
          height: "800px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={`data:image/png;base64,${plotData.image}`}
          alt="Department Analysis"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            width: "auto",
            height: "auto",
          }}
        />
      </Box>
    </Paper>
  );
}
