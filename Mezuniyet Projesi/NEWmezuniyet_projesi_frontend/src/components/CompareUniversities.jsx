import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

function CompareUniversities() {
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
            padding: "24px",
          }}
        >
          <CardContent
            sx={{
              padding: { xs: 2, md: 4 },
              "&:last-child": {
                paddingBottom: { xs: 3, md: 5 },
              },
            }}
          >
            <Typography
              variant="h4"
              align="center"
              sx={{
                mb: 6,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                color: "#553C9A",
                letterSpacing: "-0.5px",
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              Seçilen Üniversitelere Göre Popüler ve Düşüşte Olan Bölümleri ve
              Üniversiteler Ait Arz Talep Oranları
            </Typography>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: "#FFFFFF",
                borderRadius: 2,
              }}
            >
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
                height={450}
                xAxis={[
                  {
                    data: [
                      "Çankaya Üniversitesi",
                      "Başkent Üniversitesi",
                      "Hacettepe Üniversitesi",
                      "ODTÜ",
                    ],
                    scaleType: "band",
                    tickLabelStyle: {
                      angle: 335,
                      textAnchor: "start",
                      fontSize: 13,
                      fontFamily: "'Inter', sans-serif",
                    },
                  },
                ]}
                yAxis={[
                  {
                    tickLabelStyle: {
                      fontSize: 13,
                      fontFamily: "'Inter', sans-serif",
                    },
                    label: "Arz Talep Oranı (%)",
                    labelStyle: {
                      fontSize: 14,
                      fontFamily: "'Inter', sans-serif",
                      fill: "#553C9A",
                    },
                  },
                ]}
                margin={{ top: 50, bottom: 90, left: 70, right: 30 }}
                sx={{
                  "& .MuiChartsLegend-root": {
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                  },
                  "& .MuiChartsLegend-label": {
                    fill: "#553C9A",
                  },
                }}
                legend={{
                  hidden: false,
                  position: { vertical: "top", horizontal: "middle" },
                  padding: 30,
                  itemMarkWidth: 15,
                  itemMarkHeight: 15,
                  markGap: 10,
                  itemGap: 20,
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default CompareUniversities;
