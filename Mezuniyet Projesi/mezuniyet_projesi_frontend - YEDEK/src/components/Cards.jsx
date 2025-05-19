import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Grid2,
  Typography,
  CardActionArea,
} from "@mui/material";

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
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Predict your future
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
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Predict your improvement
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
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Predict universities' future
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
