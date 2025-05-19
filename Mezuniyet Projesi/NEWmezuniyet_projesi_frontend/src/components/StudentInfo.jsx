import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Stack, Box } from "@mui/material";
import { Divider } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

export default function StudentInfo() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#F6F0FE",
        padding: 4,
        margin: 5,
      }}
    >
      <Card
        sx={{
          width: 400,
          borderRadius: 3,
          boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
          backgroundColor: "white",
        }}
      >
        <CardMedia
          component="img"
          alt="profile"
          height="300"
          image="/src/assets/profileIcon.png"
          sx={{
            p: 4,
            objectFit: "contain",
          }}
        />
        <CardContent>
          <Typography
            textAlign="center"
            gutterBottom
            variant="h4"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: "#553C9A",
              mb: 3,
            }}
          >
            Kişisel Bilgiler
          </Typography>
          <Divider sx={{ mb: 3, borderColor: "rgba(107, 70, 193, 0.2)" }} />
          <Stack spacing={2.5}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <PersonIcon sx={{ color: "#553C9A", fontSize: "1.5rem" }} />
              <Typography
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "1.1rem",
                  color: "#4A5568",
                }}
              >
                Ad/Soyad: Emircan Güneş
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
              <EmailIcon sx={{ color: "#553C9A", fontSize: "1.5rem" }} />
              <Typography
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "1.1rem",
                  color: "#4A5568",
                }}
              >
                Email: emircansoftware@gmail.com
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
              <EmojiEventsIcon sx={{ color: "#553C9A", fontSize: "1.5rem" }} />
              <Typography
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "1.1rem",
                  color: "#4A5568",
                }}
              >
                Puanım: 437,1245
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
              <LeaderboardIcon sx={{ color: "#553C9A", fontSize: "1.5rem" }} />
              <Typography
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "1.1rem",
                  color: "#4A5568",
                }}
              >
                Sıralamam: 25145
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: "center", p: 3, gap: 2 }}>
          <Button
            size="large"
            variant="outlined"
            sx={{
              color: "#553C9A",
              borderColor: "#553C9A",
              "&:hover": {
                borderColor: "#6B46C1",
                backgroundColor: "rgba(107, 70, 193, 0.04)",
              },
              px: 3,
              py: 1,
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
              fontSize: "1rem",
            }}
          >
            Bilgilerini Güncelle
          </Button>
          <Button
            size="large"
            variant="contained"
            sx={{
              backgroundColor: "#DC2626",
              "&:hover": {
                backgroundColor: "#B91C1C",
              },
              px: 3,
              py: 1,
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
              fontSize: "1rem",
            }}
          >
            Çıkış Yap
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
