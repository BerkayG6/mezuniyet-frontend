import * as React from "react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import GoogleIcon from "@mui/icons-material/Google";
import axios from 'axios';

export default function Sregister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/register', {
        username: name,
        email: email,
        password: password,
        role: 'student'
      });
      setMessage(response.data.message);

      if (response.status === 201) {
        navigate('/student-login');
      }

    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Registration failed');
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
            label="Ad Soyad"
            variant="outlined"
            placeholder="Ad Soyad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
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
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            variant="outlined"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
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
            }}
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
            sx={{
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
            }}
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
        {message && (
            <CardContent sx={{ px: 4, py: 1 }}>
                <Typography variant="body2" color="textSecondary" align="center">
                    {message}
            </Typography>
        </CardContent>
        )}
      </Card>
    </Box>
  );
}
