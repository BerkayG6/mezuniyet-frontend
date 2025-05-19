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
  Checkbox,
  FormControlLabel,
  FormGroup,
  Link,
  Divider,
  Box,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import axios from "axios";

export default function Student() {
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
      window.location.href = "/student-profile";
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
            Öğrenci Girişi
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            variant="outlined"
            placeholder="your@email.com"
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
            placeholder="········"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={inputStyle}
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: "#553C9A",
                    "&.Mui-checked": {
                      color: "#553C9A",
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                    color: "#4A5568",
                  }}
                >
                  Beni Hatırla
                </Typography>
              }
            />
          </FormGroup>
        </CardContent>
        <CardActions sx={{ px: 4, pb: 2 }}>
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
        <CardActions sx={{ px: 4, justifyContent: "center" }}>
          <Link
            href="#"
            underline="hover"
            sx={{
              color: "#553C9A",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.9rem",
            }}
          >
            Şifremi Unuttum
          </Link>
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
        <CardActions sx={{ px: 4, pb: 4, flexDirection: "column", gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
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
            Google ile Giriş Yap
          </Button>
          <Typography
            align="center"
            sx={{
              color: "#4A5568",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.9rem",
            }}
          >
            Hesabınız yok mu?{" "}
            <Link
              href="/student-register"
              underline="hover"
              sx={{
                color: "#553C9A",
                fontWeight: 500,
              }}
            >
              Kayıt Ol
            </Link>
          </Typography>
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
