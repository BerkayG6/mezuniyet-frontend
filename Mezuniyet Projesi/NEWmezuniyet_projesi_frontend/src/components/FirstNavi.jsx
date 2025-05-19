import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  SmartToy as SmartToyIcon,
  Home as HomeIcon,
  Storage as DatasetIcon,
  Info as AboutUsIcon,
  Calculate as CalculateRankIcon,
  Code as QueryIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";

const pages = [
  { name: "Home", path: "/", icon: <HomeIcon fontSize="small" /> },
  { name: "Datasets", path: "/datasets", icon: <DatasetIcon fontSize="small" /> },
  { name: "About Us", path: "/about-us", icon: <AboutUsIcon fontSize="small" /> },
  { name: "Calculate Rank", path: "/calculate-rank", icon: <CalculateRankIcon fontSize="small" /> },
  { name: "SQL Query", path: "/sql-query", icon: <QueryIcon fontSize="small" /> },
];

function FirstNavi() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [auth, setAuth] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    setAuth(!!accessToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("role");
    setAuth(false);
    setOpenDialog(false);
    window.location.href = "/";
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const getActiveStyle = (path) => ({
    backgroundColor: window.location.pathname === path ? "rgba(255, 255, 255, 0.2)" : "inherit",
  });

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#553C9A",
          boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <SmartToyIcon sx={{ display: { xs: "none", md: "flex" }, mr: 2, color: "#FFFFFF" }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 4,
                display: { xs: "none", md: "flex" },
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                letterSpacing: "0.5px",
                color: "#FFFFFF",
                textDecoration: "none",
              }}
            >
              UAPCPS
            </Typography>

            {isMobile ? (
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorElNav}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{ display: { xs: "block", md: "none" } }}
                >
                  {pages.map((page) => (
                    <MenuItem
                      key={page.name}
                      onClick={handleCloseNavMenu}
                      component="a"
                      href={page.path}
                      sx={getActiveStyle(page.path)}
                    >
                      {page.icon}
                      <Typography sx={{ ml: 1 }}>{page.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            ) : (
              <Box sx={{ flexGrow: 1, display: "flex" }}>
                {pages.map((page) => (
                  <Button
                    key={page.name}
                    href={page.path}
                    startIcon={page.icon}
                    sx={{
                      mx: 1,
                      my: 2,
                      color: "#FFFFFF",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      fontSize: "0.95rem",
                      textTransform: "none",
                      transition: "background-color 0.3s ease",
                      ...getActiveStyle(page.path),
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    {page.name}
                  </Button>
                ))}
              </Box>
            )}

            <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
              {auth ? (
                <>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "white", mr: 2, display: { xs: "none", sm: "block" } }}
                  >
                    Hoşgeldin, {localStorage.getItem("role")}
                  </Typography>
                  <Button
                    onClick={() => setOpenDialog(true)}
                    variant="outlined"
                    sx={{
                      borderColor: "#FFFFFF",
                      color: "#FFFFFF",
                      ml: 2,
                      fontFamily: "'Inter', sans-serif",
                      textTransform: "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        borderColor: "#FFFFFF",
                      },
                    }}
                  >
                    Çıkış Yap
                  </Button>
                </>
              ) : (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    href="/student-login"
                    startIcon={<PersonIcon />}
                    sx={{
                      color: "#FFFFFF",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      textTransform: "none",
                    }}
                  >
                    Student
                  </Button>
                  <Button
                    href="/university-login"
                    startIcon={<SchoolIcon />}
                    sx={{
                      color: "#FFFFFF",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      textTransform: "none",
                    }}
                  >
                    University
                  </Button>
                  <Button
                    href="/yok-login"
                    startIcon={<BusinessIcon />}
                    sx={{
                      color: "#FFFFFF",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      textTransform: "none",
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Çıkış yapmak istediğinizden emin misiniz?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            İptal Et
          </Button>
          <Button onClick={handleLogout} color="primary" autoFocus>
            Çıkış Yap
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default FirstNavi;