import * as React from "react";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import axios from 'axios';

const pages = ["Ana Sayfa", "Veri Setleri", "Universiteler", "Bolumler", "Hakkimizda"];
const settings = ["Profil", "Kontrol Paneli", "Çıkış Yap"];

// Menüleri kullanıcı türüne göre ayır
const studentPages = [
  { label: "Ana Sayfa", path: "/", icon: <HomeIcon sx={{mr:1}}/> },
  { label: "Tercihlerim", path: "/student-preferences" },
  { label: "Hakkimizda", path: "/hakkimizda", icon: <InfoIcon sx={{mr:1}}/> }
];
const universityPages = [
  { label: "Ana Sayfa", path: "/", icon: <HomeIcon sx={{mr:1}}/> },
  { label: "Bölümlerim", path: "/university-departments" },
  { label: "Hakkimizda", path: "/hakkimizda", icon: <InfoIcon sx={{mr:1}}/> }
];
const yokPages = [
  { label: "Ana Sayfa", path: "/", icon: <HomeIcon sx={{mr:1}}/> },
  { label: "Yönetim Paneli", path: "/yok-dashboard" },
  { label: "Hakkimizda", path: "/hakkimizda", icon: <InfoIcon sx={{mr:1}}/> }
];
const guestPages = [
  { label: "Ana Sayfa", path: "/", icon: <HomeIcon sx={{mr:1}}/> },
  { label: "Veri Setleri", path: "/veri-setleri" },
  { label: "Universiteler", path: "/universiteler" },
  { label: "Bolumler", path: "/bolumler" },
  { label: "Hakkimizda", path: "/hakkimizda", icon: <InfoIcon sx={{mr:1}}/> }
];

function FirstNavi() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [auth, setAuth] = React.useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('useEffect in FirstNavi: Token', token);
    if (token) {
      const fetchUser = async () => {
        try {
          console.log('Fetching user profile...');
          const response = await axios.get('http://localhost:5000/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          console.log('User profile fetched:', response.data.user);
          setUser(response.data.user);
          setAuth(true);
        } catch (err) {
          console.error('Error fetching user profile:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          setUser(null);
          setAuth(false);
        }
        setLoading(false);
        console.log('User fetch completed. Auth:', auth, 'User:', user);
      };
      fetchUser();
    } else {
      console.log('No token found. Setting auth to false.');
      setUser(null);
      setAuth(false);
      setLoading(false);
    }
  }, [auth]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setAuth(false);
    setUser(null);
    navigate('/student-login');
  };

  // Get current path for active menu highlight
  const currentPath = window.location.pathname;

  // Kullanıcıya göre menü seç (her zaman guestPages göster)
  let pagesToShow = guestPages;

  // Profil menüsü seçenekleri
  let profileMenu = [];
  if (auth && user) {
    if (user.role === 'student') {
      profileMenu = [
        { label: 'Profilim', action: () => navigate('/student-profile') },
        { label: 'Çıkış Yap', action: handleLogout, color: '#C53030' }
      ];
    } else if (user.role === 'university') {
      profileMenu = [
        { label: 'Profilim', action: () => navigate('/university-profile') },
        { label: 'Bölümlerim', action: () => navigate('/university-departments') },
        { label: 'Çıkış Yap', action: handleLogout, color: '#C53030' }
      ];
    } else if (user.role === 'yok') {
      profileMenu = [
        { label: 'Profilim', action: () => navigate('/yok-profile') },
        { label: 'Yönetim Paneli', action: () => navigate('/yok-dashboard') },
        { label: 'Çıkış Yap', action: handleLogout, color: '#C53030' }
      ];
    }
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        background: "linear-gradient(90deg, #553C9A 0%, #6B46C1 100%)",
        boxShadow: "0 6px 32px -8px rgba(85,60,154,0.18)",
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        zIndex: 1201,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 54, px: { xs: 1, md: 2 }, justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SmartToyIcon
              sx={{
                display: { xs: "none", md: "flex" },
                mr: 1.2,
                color: "#FFD700",
                fontSize: 28,
                filter: "drop-shadow(0 2px 8px #FFD70033)",
              }}
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                letterSpacing: "0.5px",
                color: "#FFFFFF",
                textDecoration: "none",
                fontSize: 22,
                textShadow: "0 2px 8px #553C9A44",
                whiteSpace: "nowrap",
                overflow: "visible",
              }}
            >
              YKS ANALYSIS
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: "#FFD700", transition: "0.2s", '&:hover': { color: '#FFFFFF', background: 'rgba(255,215,0,0.08)' } }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
                '& .MuiPaper-root': {
                  background: "linear-gradient(90deg, #FFFFFF 0%, #F6F0FE 100%)",
                  borderRadius: 3,
                  boxShadow: "0 8px 32px -8px #6B46C133",
                  animation: 'fadeInDown 0.3s',
                },
                '@keyframes fadeInDown': {
                  from: { opacity: 0, transform: 'translateY(-20px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              {pagesToShow.map((page) => (
                <MenuItem
                  key={page.label}
                  onClick={() => { handleCloseNavMenu(); navigate(page.path); }}
                  selected={currentPath === page.path}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: "rgba(85,60,154,0.10)",
                      color: "#553C9A",
                    },
                    '&:hover': {
                      backgroundColor: "rgba(107, 70, 193, 0.08)",
                      color: "#6B46C1",
                    },
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 18,
                    transition: "all 0.2s",
                  }}
                >
                  {page.icon}
                  <Typography sx={{ ml: 1 }}>{page.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <SmartToyIcon
            sx={{
              display: { xs: "flex", md: "none" },
              mr: 1,
              color: "#FFD700",
              fontSize: 32,
              filter: "drop-shadow(0 2px 8px #FFD70033)",
            }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 1,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              letterSpacing: "0.5px",
              color: "#FFFFFF",
              textDecoration: "none",
              fontSize: 16,
              textShadow: "0 2px 8px #553C9A44",
              whiteSpace: "nowrap",
              overflow: "visible",
            }}
          >
            YKS ANALYSIS
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 1 }}>
            {pagesToShow.map((page) => (
              <Button
                key={page.label}
                href={page.path}
                startIcon={page.icon}
                sx={{
                  mx: 0.5,
                  my: 1,
                  color: currentPath === page.path ? "#FFD700" : "#FFFFFF",
                  backgroundColor: currentPath === page.path ? "rgba(255,215,0,0.10)" : "transparent",
                  borderBottom: currentPath === page.path ? "2px solid #FFD700" : "2px solid transparent",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.98rem",
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.7,
                  textTransform: "none",
                  transition: "all 0.2s cubic-bezier(.4,2,.6,1)",
                  boxShadow: currentPath === page.path ? "0 2px 8px #FFD70022" : "none",
                  '&:hover': {
                    backgroundColor: "rgba(255,255,255,0.13)",
                    color: "#FFD700",
                    boxShadow: "0 2px 12px #FFD70033",
                  },
                }}
              >
                {page.label}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0, ml: "auto", mr: 1 }}>
            {loading ? (
              <Typography sx={{ color: "#FFFFFF", fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 14 }}>Loading...</Typography>
            ) : auth && user ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                <Tooltip title="Profil Menüsü">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar sx={{ bgcolor: "#FFD700", color: "#553C9A", fontWeight: 700, border: '2px solid #FFFFFF', boxShadow: '0 2px 8px #FFD70055', width: 34, height: 34, fontSize: 18 }}>
                      {user.username ? user.username[0].toUpperCase() : 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px', '& .MuiPaper-root': { borderRadius: 3, minWidth: 180, boxShadow: '0 8px 32px -8px #6B46C133', animation: 'fadeInDown 0.3s' } }}
                  id="menu-appbar-user"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem disabled>
                    <Typography textAlign="center" sx={{ fontWeight: 700, color: '#553C9A', fontSize: 18 }}>{user.username}</Typography>
                  </MenuItem>
                  {profileMenu.map((item, idx) => (
                    <MenuItem key={item.label} onClick={() => { item.action(); handleCloseUserMenu(); }} sx={item.color ? { color: item.color, fontWeight: 700 } : { fontWeight: 600 }}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: "flex", gap: 1.2, justifyContent: "flex-end" }}>
                <Button
                  variant="text"
                  href="/student-login"
                  startIcon={<PersonIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    color: "#FFD700",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "0.98rem",
                    px: 1.5,
                    borderRadius: 2,
                    minWidth: 0,
                    transition: "all 0.2s",
                    '&:hover': {
                      backgroundColor: "rgba(255, 255, 255, 0.13)",
                      color: "#FFFFFF",
                    },
                  }}
                >
                  Öğrenci
                </Button>
                <Button
                  href="/university-login"
                  variant="text"
                  startIcon={<SchoolIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    color: "#FFD700",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "0.98rem",
                    px: 1.5,
                    borderRadius: 2,
                    minWidth: 0,
                    transition: "all 0.2s",
                    '&:hover': {
                      backgroundColor: "rgba(255, 255, 255, 0.13)",
                      color: "#FFFFFF",
                    },
                  }}
                >
                  Üniversite
                </Button>
                <Button
                  href="/yok-login"
                  variant="text"
                  startIcon={<BusinessIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    color: "#FFD700",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "0.98rem",
                    px: 1.5,
                    borderRadius: 2,
                    minWidth: 0,
                    transition: "all 0.2s",
                    '&:hover': {
                      backgroundColor: "rgba(255, 255, 255, 0.13)",
                      color: "#FFFFFF",
                    },
                  }}
                >
                  YÖK
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default FirstNavi;
