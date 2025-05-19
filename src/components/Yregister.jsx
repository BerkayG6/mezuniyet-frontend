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
import Box from "@mui/material/Box";
import axios from 'axios';

export default function Yregister() {
  const [username, setUsername] = useState(''); // Changed from name to username for clarity
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleRegister = async () => {
    // Basic validation
    if (!username || !email || !password) {
        setMessage('All fields are required');
        return;
    }

    try {
      const response = await axios.post('http://localhost:5000/register', {
        username: username,
        email: email,
        password: password,
        role: 'yok' // Fixed role for YÖK registration
      });
      setMessage(response.data.message); // Show success message from backend

      // If registration is successful, navigate to login page
      if (response.status === 201) { // Assuming 201 status indicates successful creation
          // Optionally, you might want a small delay before navigating
          // setTimeout(() => navigate('/yok-login'), 1000);
          navigate('/yok-login');
      }

    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Registration failed'); // Show error message
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
          image="/src/assets/yok.jpg" // Assuming you have a yok.jpg image
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
            YÖK Yetkilisi Kayıt
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Kullanıcı Adı"
            variant="outlined"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            placeholder="yok@email.com"
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
        <CardActions sx={{ px: 4, pb: 4 }}>
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