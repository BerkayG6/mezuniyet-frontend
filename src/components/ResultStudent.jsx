import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { PieChart } from "@mui/x-charts/PieChart";
import { Chip, Divider } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { useSelector } from "react-redux";

function ResultStudent() {
  const { studentData } = useSelector((store) => store.predict);
  const { selectedUniversity, selectedDepartment, studentRank, predictedData } =
    studentData;

  console.log("ResultStudent received data:", { studentData, predictedData }); // Debug için

  // Yerleşme olasılığını hesapla
  const calculatePlacementProbability = () => {
    if (!predictedData || !studentRank) {
      console.log("Missing data:", { predictedData, studentRank });
      return 0;
    }

    const firstRank = parseInt(predictedData.predicted_first_rank);
    const lastRank = parseInt(predictedData.predicted_last_rank);
    const rank = parseInt(studentRank);

    console.log("Calculation values:", { firstRank, lastRank, rank }); // Debug için

    // Değerlerin sayı olup olmadığını kontrol et
    if (isNaN(firstRank) || isNaN(lastRank) || isNaN(rank)) {
      console.log("Invalid number values:", { firstRank, lastRank, rank });
      return 0;
    }

    // Sıralama predicted_last_rank'ten büyükse yerleşme şansı yok
    if (rank > lastRank) {
      console.log("Rank is higher than last rank");
      return 0;
    }

    // Sıralama predicted_first_rank'ten küçükse kesin yerleşir
    if (rank < firstRank) {
      console.log("Rank is lower than first rank");
      return 100;
    }

    // Arada ise lineer bir hesaplama yap
    const totalRange = lastRank - firstRank;
    const studentPosition = rank - firstRank;
    const probability = 100 - (studentPosition / totalRange) * 100;

    console.log("Calculation results:", {
      totalRange,
      studentPosition,
      probability,
    }); // Debug için

    return Math.round(probability);
  };

  const placementProbability = calculatePlacementProbability();
  const remainingProbability = 100 - placementProbability;

  return (
    <Card
      sx={{
        width: { xs: "90%", sm: "600px" },
        padding: 4,
        borderRadius: 3,
        boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
        backgroundColor: "white",
      }}
    >
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
        Tahmin Sonucu
      </Typography>
      <CardMedia
        sx={{
          height: 200,
          borderRadius: 2,
          mb: 3,
        }}
        image="/src/assets/ai.jpg"
        title="AI Prediction"
      />
      <CardContent sx={{ padding: 0, mb: 4 }}>
        <Box
          sx={{
            backgroundColor: "#F8F5FF",
            borderRadius: 3,
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: "#553C9A",
            }}
          >
            Yerleşme Olasılığı
          </Typography>
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <PieChart
              series={[
                {
                  data: [
                    {
                      id: 0,
                      value: placementProbability,
                      label: "Yerleşme Şansı",
                      color: "#553C9A",
                    },
                    {
                      id: 1,
                      value: remainingProbability,
                      label: "Diğer",
                      color: "#E9D8FD",
                    },
                  ],
                  highlightScope: { faded: "global", highlighted: "item" },
                  faded: { innerRadius: 30, additionalRadius: -30 },
                },
              ]}
              width={400}
              height={250}
              slotProps={{
                legend: {
                  direction: "row",
                  position: { vertical: "bottom", horizontal: "middle" },
                  padding: 10,
                  labelStyle: {
                    fontSize: 14,
                    fontFamily: "'Inter', sans-serif",
                    fill: "#553C9A",
                  },
                },
              }}
            />
          </Box>
        </Box>
      </CardContent>
      <CardContent sx={{ padding: 0, mb: 4 }}>
        <Typography
          variant="h5"
          align="center"
          sx={{
            mb: 3,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            color: "#553C9A",
          }}
        >
          Sonuç
        </Typography>
        <Box
          sx={{
            backgroundColor: "#F8F5FF",
            borderRadius: 3,
            padding: 3,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "#4A5568",
              fontFamily: "'Inter', sans-serif",
              fontSize: "1.1rem",
              lineHeight: 1.8,
              textAlign: "justify",
            }}
          >
            {predictedData && (
              <>
                1. {selectedUniversity} - {selectedDepartment} bölümüne %
                {placementProbability} oranında yerleşme şansınız bulunmaktadır.
                <br />
                2. Tahmin edilen sıralama aralığı:{" "}
                {predictedData.predicted_first_rank} -{" "}
                {predictedData.predicted_last_rank}
                <br />
                3. Sizin sıralamanız: {studentRank}
              </>
            )}
          </Typography>
        </Box>
      </CardContent>
      <Divider
        sx={{
          mb: 3,
          "&::before, &::after": {
            borderColor: "rgba(107, 70, 193, 0.2)",
          },
        }}
      >
        <Chip
          label="Düşüncelerinizi Bizimle Paylaşın"
          sx={{
            backgroundColor: "#F6F0FE",
            color: "#553C9A",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
          }}
        />
      </Divider>
      <CardActions sx={{ justifyContent: "center", gap: 2 }}>
        <Button
          startIcon={<ThumbUpIcon />}
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "#553C9A",
            "&:hover": {
              backgroundColor: "#4A3294",
            },
            fontFamily: "'Inter', sans-serif",
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Başarılı
        </Button>
        <Button
          startIcon={<ThumbDownIcon />}
          variant="outlined"
          size="large"
          sx={{
            borderColor: "#553C9A",
            color: "#553C9A",
            "&:hover": {
              borderColor: "#4A3294",
              backgroundColor: "rgba(74, 50, 148, 0.05)",
            },
            fontFamily: "'Inter', sans-serif",
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Başarısız
        </Button>
      </CardActions>
    </Card>
  );
}

export default ResultStudent;
