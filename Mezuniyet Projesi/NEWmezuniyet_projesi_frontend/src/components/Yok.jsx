import * as React from "react";
import { useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  TextField,
  Box,
} from "@mui/material";
import axios from "axios";

export default function Yok() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
        username: email,
        password: password,
      });

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("role", response.data.role);

      alert("Giriş başarılı!");
      window.location.href = "/yok-dashboard";
    } catch (error) {
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
          alt="YÖK"
          height="200"
          image="/src/assets/yok.jpg"
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
            YÖK Girişi
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Kurumsal E-posta"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="kullanici@yok.gov.tr"
            sx={inputStyle}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Şifre"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="········"
            sx={inputStyle}
          />
        </CardContent>
        <CardActions sx={{ px: 4, pb: 4 }}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={handleLogin}
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
      </Card>
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
