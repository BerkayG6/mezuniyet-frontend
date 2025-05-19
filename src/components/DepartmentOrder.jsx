import { Box, Card, CardContent, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import React from "react";

function DepartmentOrder({ selectedDepartments = [], departmentDataMap = {} }) {
  // Prepare data for the chart
  const prepareChartData = () => {
    if (!selectedDepartments || selectedDepartments.length === 0) {
      return {
        departmentNames: [],
        lastRankData: [],
        firstRankData: [],
        enrollmentData: [],
      };
    }

    const departmentNames = selectedDepartments.map(
      (dept) => dept.department_name
    );

    const lastRankData = selectedDepartments.map((dept) => ({
      actual: departmentDataMap[dept.DEPARTMENT_ID]?.LAST_RANK || 0,
      predicted2024:
        departmentDataMap[dept.DEPARTMENT_ID]?.PREDICTED_LAST_RANK || 0,
      predicted2025: dept.PREDICTED_LAST_RANK || 0,
    }));

    const firstRankData = selectedDepartments.map((dept) => ({
      actual: departmentDataMap[dept.DEPARTMENT_ID]?.FIRST_RANK || 0,
      predicted2024:
        departmentDataMap[dept.DEPARTMENT_ID]?.PREDICTED_FIRST_RANK || 0,
      predicted2025: dept.PREDICTED_FIRST_RANK || 0,
    }));

    const enrollmentData = selectedDepartments.map((dept) => ({
      actual: departmentDataMap[dept.DEPARTMENT_ID]?.SUM_ENROLLMENT || 0,
      predicted2024:
        departmentDataMap[dept.DEPARTMENT_ID]?.PREDICTED_SUM_ENROLLMENT || 0,
      predicted2025: dept.PREDICTED_SUM_ENROLLMENT || 0,
    }));

    return {
      departmentNames,
      lastRankData,
      firstRankData,
      enrollmentData,
    };
  };

  const { departmentNames, lastRankData, firstRankData, enrollmentData } =
    prepareChartData();

  if (departmentNames.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        padding: "40px",
        backgroundColor: "#F6F0FE",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          maxWidth: "1400px",
          margin: "0 auto",
          marginTop: "2%",
        }}
      >
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
            backgroundColor: "white",
          }}
        >
          <CardContent sx={{ padding: 4 }}>
            <Typography
              variant="h4"
              align="center"
              sx={{
                mb: 4,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                color: "#553C9A",
                letterSpacing: "-0.5px",
              }}
            >
              Seçilen Bölümlerin Sıralama ve Yerleşme Verileri
            </Typography>

            {/* Son Sıralama Grafiği */}
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontFamily: "'Poppins', sans-serif",
                color: "#553C9A",
              }}
            >
              Son Sıralama Karşılaştırması
            </Typography>
            <BarChart
              series={[
                {
                  data: lastRankData.map((d) => d.actual),
                  label: "2024 Gerçek",
                  color: "#553C9A",
                },
                {
                  data: lastRankData.map((d) => d.predicted2024),
                  label: "2024 Tahmin",
                  color: "#9F7AEA",
                },
                {
                  data: lastRankData.map((d) => d.predicted2025),
                  label: "2025 Tahmin",
                  color: "#B794F4",
                },
              ]}
              height={400}
              xAxis={[
                {
                  data: departmentNames,
                  scaleType: "band",
                  tickLabelStyle: {
                    angle: 45,
                    textAnchor: "start",
                    fontSize: 12,
                    fontFamily: "'Inter', sans-serif",
                  },
                },
              ]}
              yAxis={[
                {
                  tickLabelStyle: {
                    fontSize: 12,
                    fontFamily: "'Inter', sans-serif",
                  },
                },
              ]}
              margin={{ top: 40, bottom: 70, left: 60, right: 20 }}
            />

            {/* İlk Sıralama Grafiği */}
            <Typography
              variant="h6"
              sx={{
                mt: 4,
                mb: 2,
                fontFamily: "'Poppins', sans-serif",
                color: "#553C9A",
              }}
            >
              İlk Sıralama Karşılaştırması
            </Typography>
            <BarChart
              series={[
                {
                  data: firstRankData.map((d) => d.actual),
                  label: "2024 Gerçek",
                  color: "#553C9A",
                },
                {
                  data: firstRankData.map((d) => d.predicted2024),
                  label: "2024 Tahmin",
                  color: "#9F7AEA",
                },
                {
                  data: firstRankData.map((d) => d.predicted2025),
                  label: "2025 Tahmin",
                  color: "#B794F4",
                },
              ]}
              height={400}
              xAxis={[
                {
                  data: departmentNames,
                  scaleType: "band",
                  tickLabelStyle: {
                    angle: 45,
                    textAnchor: "start",
                    fontSize: 12,
                    fontFamily: "'Inter', sans-serif",
                  },
                },
              ]}
              yAxis={[
                {
                  tickLabelStyle: {
                    fontSize: 12,
                    fontFamily: "'Inter', sans-serif",
                  },
                },
              ]}
              margin={{ top: 40, bottom: 70, left: 60, right: 20 }}
            />

            {/* Yerleşen Öğrenci Sayısı Grafiği */}
            <Typography
              variant="h6"
              sx={{
                mt: 4,
                mb: 2,
                fontFamily: "'Poppins', sans-serif",
                color: "#553C9A",
              }}
            >
              Yerleşen Öğrenci Sayısı Karşılaştırması
            </Typography>
            <BarChart
              series={[
                {
                  data: enrollmentData.map((d) => d.actual),
                  label: "2024 Gerçek",
                  color: "#553C9A",
                },
                {
                  data: enrollmentData.map((d) => d.predicted2024),
                  label: "2024 Tahmin",
                  color: "#9F7AEA",
                },
                {
                  data: enrollmentData.map((d) => d.predicted2025),
                  label: "2025 Tahmin",
                  color: "#B794F4",
                },
              ]}
              height={400}
              xAxis={[
                {
                  data: departmentNames,
                  scaleType: "band",
                  tickLabelStyle: {
                    angle: 45,
                    textAnchor: "start",
                    fontSize: 12,
                    fontFamily: "'Inter', sans-serif",
                  },
                },
              ]}
              yAxis={[
                {
                  tickLabelStyle: {
                    fontSize: 12,
                    fontFamily: "'Inter', sans-serif",
                  },
                },
              ]}
              margin={{ top: 40, bottom: 70, left: 60, right: 20 }}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default DepartmentOrder;
