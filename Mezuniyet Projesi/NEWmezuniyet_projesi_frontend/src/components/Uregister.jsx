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
  Autocomplete,
} from "@mui/material";
import axios from "axios";

const universities = [
  "Çankaya Üniversitesi",
  "Başkent Üniversitesi",
  "Hacettepe Üniversitesi",
];

export default function Uregister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kurumsal e-posta kontrolü
    if (!email.endsWith("@uni.edu.tr")) {
      alert("Lütfen @uni.edu.tr ile biten kurumsal bir e-posta giriniz.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/register/", {
        username: university || email.split("@")[0],
        email: email,
        password: password,
        role: "university",
      });

      alert("Kayıt başarılı!");
      console.log(response.data);

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("role", "university");

      window.location.href = "/university-home";
    } catch (error) {
      console.error(error.response?.data);
      alert(error.response?.data?.error || "Kayıt başarısız!");
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
      <form onSubmit={handleSubmit}>
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
              Üniversite Kayıt
            </Typography>
            <Autocomplete
              disablePortal
              options={universities}
              fullWidth
              onChange={(event, value) => setUniversity(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Üniversite Seç"
                  sx={textFieldStyle}
                />
              )}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Üniversite Email"
              variant="outlined"
              placeholder="example@uni.edu.tr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={textFieldStyle}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Şifre"
              type="password"
              variant="outlined"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={textFieldStyle}
            />
          </CardContent>
          <CardActions sx={{ px: 4, pb: 4 }}>
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
              Kayıt Ol
            </Button>
          </CardActions>
        </Card>
      </form>
    </Box>
  );
}

const textFieldStyle = {
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
