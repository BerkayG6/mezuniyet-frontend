import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
} from '@mui/material';
import axios from 'axios';

function UpdateProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/student-login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const { username, email } = response.data.user;
        setFormData(prev => ({ ...prev, username, email }));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage({ type: 'error', text: 'Failed to load user data' });
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validate passwords if changing
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match' });
        return;
      }
      if (!formData.currentPassword) {
        setMessage({ type: 'error', text: 'Current password is required to set a new password' });
        return;
      }
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/student-login');
      return;
    }

    try {
      const response = await axios.put('http://localhost:5000/update-profile', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      // Optionally redirect back to profile after a delay
      setTimeout(() => navigate('/student-profile'), 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
    }
  };

  if (loading) {
    return <Box sx={{ p: 3 }}>Loading...</Box>;
  }

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#553C9A" }}>
            Güncelle Profil Bilgileri
          </Typography>
          {message.text && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Kullanıcı Adı"
                name="username"
                value={formData.username}
                onChange={handleChange}
                variant="outlined"
                required
              />
              <TextField
                fullWidth
                label="E-posta"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                required
              />
              <TextField
                fullWidth
                label="Mevcut Şifre (Şifre değiştirmek istiyorsanız doldurun)"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Yeni Şifre (Opsiyonel)"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Yeni Şifre (Tekrar)"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                variant="outlined"
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2, bgcolor: "#553C9A", "&:hover": { bgcolor: "#6B46C1" }, textTransform: "none", fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "1rem", py: 1.5 }}
              >
                Güncelle
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/student-profile')}
                sx={{ mt: 1, color: "#553C9A", borderColor: "#553C9A", "&:hover": { borderColor: "#6B46C1", bgcolor: "rgba(107, 70, 193, 0.04)" }, textTransform: "none", fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "1rem", py: 1.5 }}
              >
                 Profil Sayfasına Dön
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default UpdateProfile; 