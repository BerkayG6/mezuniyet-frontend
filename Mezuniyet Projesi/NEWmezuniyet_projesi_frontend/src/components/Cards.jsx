import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Box,
  Divider,
  Grid,
} from "@mui/material";

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
      <Box sx={{ maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
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

        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          {/* Öğrenci */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 6, height: "100%" }}>
              <CardActionArea href="/student-predict">
                <CardMedia
                  component="img"
                  height="300"
                  image="/src/assets/student.jpeg"
                  alt="Öğrenci"
                />
                <CardContent>
                  <Typography variant="h5" align="center" gutterBottom>
                    Öğrenci
                  </Typography>
                  <Divider />
                  <Typography variant="body1" align="center">
                    Öğrenci iseniz puanınızı ve sıralamanızı girerek istediğiniz bölüme yerleşme olasılığınızı tahmin edebilirsiniz.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          {/* Üniversite */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 6, height: "100%" }}>
              <CardActionArea href="/university-predict">
                <CardMedia
                  component="img"
                  height="300"
                  image="/src/assets/university.jpg"
                  alt="Üniversite"
                />
                <CardContent>
                  <Typography variant="h5" align="center" gutterBottom>
                    Üniversite
                  </Typography>
                  <Divider />
                  <Typography variant="body1" align="center">
                    Üniversiteniz için gelecek yıllarda bölümlerinizin durumunu tahmin ederek kontenjan arttırabilir veya azaltabilirsiniz.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          {/* YÖK */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 6, height: "100%" }}>
              <CardActionArea href="/yok-predict">
                <CardMedia
                  component="img"
                  height="300"
                  image="/src/assets/yok.jpg"
                  alt="YÖK"
                />
                <CardContent>
                  <Typography variant="h5" align="center" gutterBottom>
                    Yükseköğretim Kurulu
                  </Typography>
                  <Divider />
                  <Typography variant="body1" align="center">
                    Üniversitelerden gelen talepler doğrultusunda yapılan tahminlere göre üniversitelere ait bölümleri kapatabilir veya açabilirsiniz.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Cards;
