import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Grid2,
  Typography,
  CardActionArea,
} from "@mui/material";
import Divider from "@mui/material/Divider";

function Cards() {
  return (
    <div>
      <Grid2 container spacing={10}>
        <Grid2 size={4}>
          <Card sx={{ maxWidth: 500 }}>
            <CardActionArea href="/student-predict">
              <CardMedia
                component="img"
                height="400"
                image="/src/assets/student.jpeg"
                alt="green iguana"
              />
              <CardContent>
                <Typography
                  textAlign="center"
                  gutterBottom
                  variant="h4"
                  component="div"
                >
                  Student
                </Typography>
                <Divider></Divider>
                <Typography
                  textAlign="center"
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                >
                  Öğrenci iseniz puanınızı ve sıralamınızı girerek istediğiniz
                  bölüme hangi olasılıkla yerleşeceğinizi tahmin edebilirsiniz.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid2>
        <Grid2 size={4}>
          <Card sx={{ maxWidth: 500 }}>
            <CardActionArea href="/university-predict">
              <CardMedia
                component="img"
                height="400"
                image="/src/assets/university.jpg"
                alt="green iguana"
              />
              <CardContent>
                <Typography
                  textAlign="center"
                  gutterBottom
                  variant="h4"
                  component="div"
                >
                  University
                </Typography>
                <Divider></Divider>
                <Typography
                  textAlign="center"
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                >
                  Üniversiteniz için gelecek yıllarda bölümlerinizin durumunu
                  tahmin ederek kontenjan arttırabilir veya azaltabilirsiniz.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid2>
        <Grid2 size={4}>
          <Card sx={{ maxWidth: 500 }}>
            <CardActionArea href="/yok-predict">
              <CardMedia
                component="img"
                height="400"
                image="/src/assets/yok.jpg"
                alt="green iguana"
              />
              <CardContent>
                <Typography
                  textAlign="center"
                  gutterBottom
                  variant="h4"
                  component="div"
                >
                  Yükseköğretim Kurulu
                </Typography>
                <Divider></Divider>
                <Typography
                  textAlign="center"
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                >
                  Üniversitelerden gelen talepler doğrultusunda yapılan
                  tahminlere göre üniversitelere ait bölümleri kapatabilir veya
                  açabilirsiniz.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid2>
      </Grid2>
    </div>
  );
}

export default Cards;
