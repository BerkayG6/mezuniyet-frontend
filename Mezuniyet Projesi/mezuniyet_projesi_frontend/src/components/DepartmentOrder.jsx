import { Box, Card, CardContent, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import React from "react";

function DepartmentOrder() {
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
              Seçtiğiniz Bölümlerin Geçmiş Yıla Göre Gelecekte Yerleşme Oranları
            </Typography>
            <BarChart
              series={[
                {
                  data: [35, 44, 24, 34],
                  label: "2023",
                  color: "#553C9A",
                },
                {
                  data: [51, 6, 49, 30],
                  label: "2024 (Tahmin)",
                  color: "#9F7AEA",
                },
                {
                  data: [15, 25, 30, 50],
                  label: "2025 (Tahmin)",
                  color: "#B794F4",
                },
                {
                  data: [60, 50, 15, 25],
                  label: "2026 (Tahmin)",
                  color: "#D6BCFA",
                },
              ]}
              height={400}
              xAxis={[
                {
                  data: [
                    "Bilgisayar Müh. (%50 İndirimli)",
                    "Hukuk (%100)",
                    "İnşaat Müh. (Burslu)",
                    "Yazılım Müh. (%50 İndirimli)",
                  ],
                  scaleType: "band",
                  tickLabelStyle: {
                    angle: 335,
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
              sx={{
                "& .MuiChartsLegend-root": {
                  fontFamily: "'Inter', sans-serif",
                },
              }}
              legend={{
                hidden: false,
                position: { vertical: "top", horizontal: "middle" },
                padding: 0,
              }}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default DepartmentOrder;
