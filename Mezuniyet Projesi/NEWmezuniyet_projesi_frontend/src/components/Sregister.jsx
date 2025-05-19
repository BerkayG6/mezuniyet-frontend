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
  Divider,
  Box,
} from "@mui/material";
import axios from "axios";

export default function Sregister() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/register/", {
        username,
        email,
        password,
        role: "student",
      });

      alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
      window.location.href = "/student-login";
    } catch (error) {
      alert(error.response?.data?.error || "Kayıt sırasında hata oluştu.");
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
          alt="Student"
          height="200"
          image="/src/assets/student.jpeg"
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
            Öğrenci Kayıt
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Kullanıcı Adı"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={inputStyle}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            sx={inputStyle}
          />
        </CardContent>
        <CardActions sx={{ px: 4, pb: 2 }}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={handleRegister}
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
            Kayıt Ol
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
            href="/student-login"
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
