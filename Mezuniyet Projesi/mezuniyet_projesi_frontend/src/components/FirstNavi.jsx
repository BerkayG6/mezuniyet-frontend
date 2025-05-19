import * as React from "react";
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

const pages = ["Home", "Datasets", "AboutUs", "CalculateRank", "SQLQUERY"];
const settings = ["Profile", "Dashboard", "Logout"];

function FirstNavi() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [auth, setAuth] = React.useState(false);

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

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#553C9A",
        boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <SmartToyIcon
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 2,
              color: "#FFFFFF",
            }}
          />
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

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: "#FFFFFF" }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
                "& .MuiPaper-root": {
                  backgroundColor: "#FFFFFF",
                  borderRadius: 2,
                  boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
                },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(107, 70, 193, 0.04)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "#553C9A",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <SmartToyIcon
            sx={{
              display: { xs: "flex", md: "none" },
              mr: 1,
              color: "#FFFFFF",
            }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              letterSpacing: "0.5px",
              color: "#FFFFFF",
              textDecoration: "none",
            }}
          >
            UAPCPS
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                href={`/${page.toLowerCase()}`}
                key={page}
                onClick={handleCloseNavMenu}
                sx={{
                  mx: 1,
                  my: 2,
                  color: "#FFFFFF",
                  display: "block",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {auth ? (
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="User"
                    src="/static/images/avatar/2.jpg"
                    sx={{
                      width: 40,
                      height: 40,
                      border: "2px solid rgba(255, 255, 255, 0.2)",
                    }}
                  />
                </IconButton>
              </Tooltip>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="text"
                  href="/student-login"
                  startIcon={<PersonIcon />}
                  sx={{
                    color: "#FFFFFF",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  Student
                </Button>
                <Button
                  href="/university-login"
                  variant="text"
                  startIcon={<SchoolIcon />}
                  sx={{
                    color: "#FFFFFF",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  University
                </Button>
                <Button
                  href="/yok-login"
                  variant="text"
                  startIcon={<BusinessIcon />}
                  sx={{
                    color: "#FFFFFF",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  YÖK
                </Button>
              </Box>
            )}
            <Menu
              sx={{
                mt: "45px",
                "& .MuiPaper-root": {
                  backgroundColor: "#FFFFFF",
                  borderRadius: 2,
                  boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
                },
              }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={handleCloseUserMenu}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(107, 70, 193, 0.04)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "#553C9A",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default FirstNavi;
