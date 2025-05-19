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

function ResultStudent() {
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
                        value: 65,
                        label: "Yerleşme Şansı",
                        color: "#553C9A",
                      },
                      { id: 1, value: 35, label: "Diğer", color: "#E9D8FD" },
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
            Önerilerimiz
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
              1. Bu bölüme %65 oranında yerleşme şansınız bulunmaktadır.
              <br />
              2. Bu bölümle alakalı diğer alternatif bölümler:
              <br />
              • Yazılım Mühendisliği
              <br />• Bilişim Sistemleri Mühendisliği
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
    </Box>
  );
}

export default ResultStudent;
