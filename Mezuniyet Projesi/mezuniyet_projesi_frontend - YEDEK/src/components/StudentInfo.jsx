import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Stack } from "react-bootstrap";
import { Divider } from "@mui/material";

export default function StudentInfo() {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt="profile"
        height="300"
        image="/src/assets/profileIcon.png"
      />
      <CardContent>
        <Typography
          textAlign="center"
          gutterBottom
          variant="h4"
          component="div"
        >
          Emircan Güneş
        </Typography>
        <Divider></Divider>
        <Stack>
          <Typography>İstediği Bölüm: Yazılım Mühendisliği</Typography>
          <Typography>Şuanki netleri : Net Toplamı (Yıla Göre)</Typography>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: "center" }}>
        <Button color="success" size="small" variant="contained">
          Bilgilerini Güncelle
        </Button>
        <Button color="error" size="small" variant="contained">
          Çıkış Yap
        </Button>
      </CardActions>
    </Card>
  );
}
