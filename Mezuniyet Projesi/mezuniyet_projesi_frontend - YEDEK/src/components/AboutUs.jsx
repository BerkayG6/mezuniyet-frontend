import { Box, Stack } from "@mui/material";
import React from "react";
import Grid2 from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function AboutUs() {
  return (
    <div>
      <Box
        sx={{
          marginLeft: "5%",
          marginRight: "5%",
          marginTop: "10%",
        }}
      >
        <Grid2 container spacing={10} direction="row">
          <Grid2 item size={6}>
            <Card sx={{ maxWidth: 700, borderRadius: 5 }}>
              <CardContent>
                <Typography variant="h4" textAlign="center">
                  About Project
                </Typography>
              </CardContent>
              <CardMedia
                component="img"
                alt="green iguana"
                height="400"
                image="/src/assets/ai.jpg"
              />
              <CardContent>
                <Typography
                  textAlign="center"
                  gutterBottom
                  variant="h5"
                  component="div"
                >
                  UAPCPS
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Proje Hakkında Yazı
                </Typography>
              </CardContent>
            </Card>
          </Grid2>
          <Grid2 item size={6}>
            <Typography variant="h4" textAlign="center">
              About Members
            </Typography>
            <Stack direction="row" spacing={5} marginTop={10}>
              <Card>
                <CardMedia
                  component="img"
                  src="/src/assets/profileIcon.png"
                ></CardMedia>
                <CardContent>
                  <Typography
                    textAlign="center"
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    Emircan Güneş
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Proje Hakkında Yazı
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button variant="contained" size="small">
                    Linkedin
                  </Button>
                  <Button variant="contained" size="small">
                    GitHub
                  </Button>
                </CardActions>
              </Card>
              <Card>
                <CardMedia
                  component="img"
                  src="/src/assets/profileIcon.png"
                ></CardMedia>
                <CardContent>
                  <Typography
                    textAlign="center"
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    Emircan Güneş
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Proje Hakkında Yazı
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button variant="contained" size="small">
                    Linkedin
                  </Button>
                  <Button variant="contained" size="small">
                    GitHub
                  </Button>
                </CardActions>
              </Card>
              <Card>
                <CardMedia
                  component="img"
                  src="/src/assets/profileIcon.png"
                ></CardMedia>
                <CardContent>
                  <Typography
                    textAlign="center"
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    Emircan Güneş
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Proje Hakkında Yazı
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button variant="contained" size="small">
                    Linkedin
                  </Button>
                  <Button variant="contained" size="small">
                    GitHub
                  </Button>
                </CardActions>
              </Card>
            </Stack>
          </Grid2>
        </Grid2>
      </Box>
    </div>
  );
}

export default AboutUs;
