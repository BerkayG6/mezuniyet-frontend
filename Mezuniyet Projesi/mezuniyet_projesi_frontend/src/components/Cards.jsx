import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Grid2,
  Typography,
  CardActionArea,
  Box,
} from "@mui/material";
import Divider from "@mui/material/Divider";

function Cards() {
  return (
    <Box
      sx={{
        padding: "40px",
        backgroundColor: "#F6F0FE",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
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
          }}
        >
          Kullanıcı Seçenekleri
        </Typography>
        <Grid2
          container
          spacing={4}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          <Grid2 xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 6,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 24px -10px rgba(107, 70, 193, 0.3)",
                },
                backgroundColor: "#FFFFFF",
                overflow: "hidden",
              }}
            >
              <CardActionArea href="/student-predict" sx={{ height: "100%" }}>
                <CardMedia
                  component="img"
                  height="300"
                  image="/src/assets/student.jpeg"
                  alt="Student"
                  sx={{
                    objectFit: "cover",
                  }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    sx={{
                      textAlign: "center",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      color: "#553C9A",
                      mb: 2,
                    }}
                  >
                    Öğrenci
                  </Typography>
                  <Divider
                    sx={{ mb: 2, backgroundColor: "rgba(107, 70, 193, 0.1)" }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: "center",
                      color: "#4A5568",
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: 1.6,
                    }}
                  >
                    Öğrenci iseniz puanınızı ve sıralamınızı girerek istediğiniz
                    bölüme hangi olasılıkla yerleşeceğinizi tahmin
                    edebilirsiniz.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid2>
          <Grid2 xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 6,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 24px -10px rgba(107, 70, 193, 0.3)",
                },
                backgroundColor: "#FFFFFF",
                overflow: "hidden",
              }}
            >
              <CardActionArea
                href="/university-predict"
                sx={{ height: "100%" }}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image="/src/assets/university.jpg"
                  alt="University"
                  sx={{
                    objectFit: "cover",
                  }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    sx={{
                      textAlign: "center",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      color: "#553C9A",
                      mb: 2,
                    }}
                  >
                    Üniversite
                  </Typography>
                  <Divider
                    sx={{ mb: 2, backgroundColor: "rgba(107, 70, 193, 0.1)" }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: "center",
                      color: "#4A5568",
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: 1.6,
                    }}
                  >
                    Üniversiteniz için gelecek yıllarda bölümlerinizin durumunu
                    tahmin ederek kontenjan arttırabilir veya azaltabilirsiniz.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid2>
          <Grid2 xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 6,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 24px -10px rgba(107, 70, 193, 0.3)",
                },
                backgroundColor: "#FFFFFF",
                overflow: "hidden",
              }}
            >
              <CardActionArea href="/yok-predict" sx={{ height: "100%" }}>
                <CardMedia
                  component="img"
                  height="300"
                  image="/src/assets/yok.jpg"
                  alt="YÖK"
                  sx={{
                    objectFit: "cover",
                  }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    sx={{
                      textAlign: "center",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      color: "#553C9A",
                      mb: 2,
                    }}
                  >
                    Yükseköğretim Kurulu
                  </Typography>
                  <Divider
                    sx={{ mb: 2, backgroundColor: "rgba(107, 70, 193, 0.1)" }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: "center",
                      color: "#4A5568",
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: 1.6,
                    }}
                  >
                    Üniversitelerden gelen talepler doğrultusunda yapılan
                    tahminlere göre üniversitelere ait bölümleri kapatabilir
                    veya açabilirsiniz.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
}

export default Cards;
