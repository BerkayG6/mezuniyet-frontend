import {
  AppBar,
  Box,
  Divider,
  Grid2,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import CopyrightIcon from "@mui/icons-material/Copyright";

function Footer() {
  return (
    <AppBar position="static" color="primary">
      <Box sx={{ flexGrow: 1 }}>
        <Grid2 container gap={5}>
          <Grid2 item size={6}>
            <Typography variant="h6" color="inherit">
              <CopyrightIcon></CopyrightIcon> 2025 UAPCPS. All rights reserved.
            </Typography>
          </Grid2>
          <Grid2 item size={6}></Grid2>
        </Grid2>
      </Box>
    </AppBar>
  );
}

export default Footer;
