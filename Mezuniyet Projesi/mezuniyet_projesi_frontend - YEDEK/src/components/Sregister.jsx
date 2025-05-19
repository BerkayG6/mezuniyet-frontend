import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import { FormControlLabel, FormGroup, Link } from "@mui/material";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import GoogleIcon from "@mui/icons-material/Google";

export default function Sregister() {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Card sx={{ maxWidth: 400, marginTop: "5%" }}>
        <CardMedia
          component="img"
          alt="ai"
          height="200"
          image="/src/assets/student.jpeg"
        />
        <CardContent>
          <Typography align="center" gutterBottom variant="h5" component="div">
            Sign Up
          </Typography>
          {/* <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Email
        </Typography> */}
          <TextField
            sx={{ width: "100%" }}
            margin="normal"
            id="outlined-basic"
            label="Name and Surname"
            variant="outlined"
            placeholder="name-surname"
          ></TextField>
          <TextField
            sx={{ width: "100%" }}
            margin="normal"
            id="outlined-basic"
            label="Email"
            variant="outlined"
            placeholder="your@email.com"
          />
          {/* <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Password
        </Typography> */}
          <TextField
            sx={{ width: "100%" }}
            margin="normal"
            id="outlined-basic"
            label="Password"
            variant="outlined"
            placeholder="...."
          />
        </CardContent>
        <CardActions>
          <Button
            size="normal"
            sx={{ width: "100%", backgroundColor: "purple" }}
            variant="contained"
          >
            Sign Up
          </Button>
        </CardActions>
        <CardContent>
          <Divider>or</Divider>
        </CardContent>
        <CardActions>
          <Button
            size="normal"
            sx={{ width: "100%" }}
            variant="contained"
            startIcon={<GoogleIcon />}
          >
            Sign up with Google
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
