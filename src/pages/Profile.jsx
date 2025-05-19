import { Box, Grid2 } from "@mui/material";
import React, { useEffect, useState } from "react";
import StudentInfo from "../components/StudentInfo";
import StudentInfo2 from "../components/StudentInfo2";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/student-login');
        return;
      }

      try {
        // 1. Kullanıcı bilgisini çek
        const response = await axios.get('http://localhost:5000/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const user = response.data.user;

        // 2. Tahminleri çek
        const predictionsRes = await axios.get('http://localhost:5000/student-predictions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const predictions = predictionsRes.data;

        // 3. userData'yı birleştir
        setUserData({ ...user, predictions });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile or predictions:', err);
        setError('Failed to load profile data.');
        setLoading(false);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
             navigate('/student-login');
        }
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return <Box>Loading profile...</Box>;
  }

  if (error) {
    return <Box>Error: {error}</Box>;
  }

  if (!userData) {
      return <Box>No user data found.</Box>;
  }

  return (
    <Box
      sx={{
        display: "grid",
        marginTop: "4%",
        justifyContent: "center",
      }}
    >
      <Grid2 container spacing={0}>
        <Grid2 size={4}>
          <Box sx={{ maxWidth: "400px" }}>
            <StudentInfo userData={userData}></StudentInfo>
          </Box>
        </Grid2>
        <Grid2 size={8}>
          <Box sx={{ ml: -17}}>
            <StudentInfo2 userData={userData}></StudentInfo2>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default Profile;
