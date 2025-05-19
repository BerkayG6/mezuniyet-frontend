import React from "react";
import { Box, Card, CardContent, Typography, Grid, Paper } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

function CompareUniversities({ departmentData = null }) {
  // If no department data is provided, return null or a placeholder
  if (!departmentData) {
    return null;
  }

  // Generate historical data based on current department data
  const generateHistoricalData = (currentData) => {
    const baseValue = currentData.fieldRate || 0;
    return {
      historical: [baseValue - 5, baseValue - 2, baseValue, baseValue + 3],
      years: ["2023", "2024", "2025", "2026"],
    };
  };

  const historicalData = generateHistoricalData(departmentData);

  return (
    <Box>
      {/* Department Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: "#F8F5FF",
              boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <PeopleIcon sx={{ color: "#553C9A", fontSize: 28 }} />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  color: "#553C9A",
                }}
              >
                Doluluk Oranı
              </Typography>
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                color: "#553C9A",
              }}
            >
              %{departmentData.fieldRate || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: "#F8F5FF",
              boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <EmojiEventsIcon sx={{ color: "#553C9A", fontSize: 28 }} />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  color: "#553C9A",
                }}
              >
                Popülerlik
              </Typography>
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                color: "#553C9A",
              }}
            >
              %{departmentData.popularity || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: "#F8F5FF",
              boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <TrendingUpIcon sx={{ color: "#553C9A", fontSize: 28 }} />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  color: "#553C9A",
                }}
              >
                Kayıt Değişimi
              </Typography>
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                color: "#553C9A",
              }}
            >
              %{departmentData.enrollmentChange || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: "#F8F5FF",
              boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <TrendingDownIcon sx={{ color: "#553C9A", fontSize: 28 }} />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  color: "#553C9A",
                }}
              >
                Sıralama Değişimi
              </Typography>
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                color: "#553C9A",
              }}
            >
              {departmentData.rankChange > 0 ? "+" : ""}
              {departmentData.rankChange || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Historical Data Chart */}
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
            {departmentData.departmentName || "Bölüm"} - Doluluk Oranı Değişimi
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
                  data: historicalData.historical,
                  label: "Doluluk Oranı (%)",
                  color: "#553C9A",
                },
              ]}
              height={450}
              xAxis={[
                {
                  data: historicalData.years,
                  scaleType: "band",
                  tickLabelStyle: {
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
                  label: "Doluluk Oranı (%)",
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
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CompareUniversities;
