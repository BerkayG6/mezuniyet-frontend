import React, { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  TextField,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import axios from "axios";

export default function University() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
        username: email,
        password: password,
      });

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("role", response.data.role);

      alert("Giriş başarılı!");
      window.location.href = "/university-home";
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Giriş başarısız!");
    }
  };

  return (
    <Box
      sx={{
        padding: "40px",
        backgroundColor: "#F6F0FE",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form onSubmit={handleLogin}>
        <Card
          sx={{
            maxWidth: 400,
            width: "100%",
            borderRadius: 6,
            boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
            backgroundColor: "#FFFFFF",
            overflow: "hidden",
          }}
        >
          <CardMedia
            component="img"
            alt="University"
            height="200"
            image="/src/assets/university.jpg"
            sx={{
              objectFit: "cover",
              borderBottom: "1px solid rgba(107, 70, 193, 0.1)",
            }}
          />
          <CardContent sx={{ px: 4, pt: 3 }}>
            <Typography
              align="center"
              gutterBottom
              variant="h5"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                color: "#553C9A",
                mb: 3,
                letterSpacing: "-0.5px",
              }}
            >
              Üniversite Girişi
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              variant="outlined"
              placeholder="university@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={inputStyle}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Şifre"
              type="password"
              variant="outlined"
              placeholder="········"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={inputStyle}
            />
          </CardContent>
          <CardActions sx={{ px: 4, pb: 2 }}>
            <Button
              fullWidth
              type="submit"
              size="large"
              variant="contained"
              sx={{
                backgroundColor: "#553C9A",
                "&:hover": {
                  backgroundColor: "#6B46C1",
                },
                textTransform: "none",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: "1rem",
                py: 1.5,
              }}
            >
              Giriş Yap
            </Button>
          </CardActions>
          <CardContent sx={{ px: 4, py: 2 }}>
            <Divider
              sx={{
                "&::before, &::after": {
                  borderColor: "rgba(107, 70, 193, 0.2)",
                },
              }}
            >
              <Typography
                sx={{
                  color: "#4A5568",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.9rem",
                }}
              >
                veya
              </Typography>
            </Divider>
          </CardContent>
          <CardActions sx={{ px: 4, pb: 4 }}>
            <Button
              fullWidth
              href="/university-register"
              size="large"
              variant="outlined"
              sx={{
                borderColor: "#553C9A",
                color: "#553C9A",
                "&:hover": {
                  borderColor: "#6B46C1",
                  backgroundColor: "rgba(107, 70, 193, 0.04)",
                },
                textTransform: "none",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: "1rem",
                py: 1.5,
              }}
            >
              Kayıt Ol
            </Button>
          </CardActions>
        </Card>
      </form>
    </Box>
  );
}

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "#6B46C1",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#553C9A",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#553C9A",
  },
};
