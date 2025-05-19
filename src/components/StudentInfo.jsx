import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Typography, Paper, Grid, Card, CardContent, Divider, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import HistoryIcon from "@mui/icons-material/History";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";

export default function StudentInfo({ userData }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/student-login');
  };

  const handleUpdateProfile = () => {
    navigate('/update-profile');
  };

  const handleNewPrediction = () => {
    navigate('/student-predict');
  };

  return (
    <Box
      sx={{
        padding: { xs: 1, md: 2 },
        backgroundColor: "#F6F0FE",
        minHeight: "100vh",
        maxWidth: "400px",
        width: "100%",
      }}
    >
      <Grid container spacing={2} maxWidth="400px" margin="0 auto" direction={{ xs: "column", md: "row" }}>
        {/* Sol Taraf - Kişisel Bilgiler */}
        <Grid item xs={12} md={11}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "1 4px 20px -5px rgba(107, 70, 193, 0.2)",
              backgroundColor: "white",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                component="img"
                src="/src/assets/profileIcon.png"
                alt="profile"
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid #F6F0FE",
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  color: "#553C9A",
                  textAlign: "center",
                }}
              >
                {userData?.username}
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "rgba(107, 70, 193, 0.2)" }} />

            <CardContent sx={{ flexGrow: 1 }}>
              <Stack spacing={3}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <PersonIcon sx={{ color: "#553C9A", fontSize: "1.5rem" }} />
                  <Typography
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "1.1rem",
                      color: "#4A5568",
                    }}
                  >
                    {userData?.username}
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
                    {userData?.email}
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
                    Puanım: {userData?.score}
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
                    Sıralamam: {userData?.rank}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>

            <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleNewPrediction}
                sx={{
                  backgroundColor: "#553C9A",
                  "&:hover": {
                    backgroundColor: "#6B46C1",
                  },
                  textTransform: "none",
                  fontFamily: "'Inter', sans-serif",
                  py: 1.5,
                }}
              >
                Yeni Tahmin Yap
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleUpdateProfile}
                sx={{
                  color: "#553C9A",
                  borderColor: "#553C9A",
                  "&:hover": {
                    borderColor: "#6B46C1",
                    backgroundColor: "rgba(107, 70, 193, 0.04)",
                  },
                  textTransform: "none",
                  fontFamily: "'Inter', sans-serif",
                  py: 1.5,
                }}
              >
                Bilgilerini Güncelle
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  color: "#DC2626",
                  borderColor: "#DC2626",
                  "&:hover": {
                    borderColor: "#B91C1C",
                    backgroundColor: "rgba(220, 38, 38, 0.04)",
                  },
                  textTransform: "none",
                  fontFamily: "'Inter', sans-serif",
                  py: 1.5,
                }}
              >
                Çıkış Yap
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
