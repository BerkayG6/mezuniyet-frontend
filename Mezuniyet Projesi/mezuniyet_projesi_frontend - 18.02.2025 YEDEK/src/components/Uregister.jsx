import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import { Autocomplete, FormControlLabel, FormGroup, Link } from "@mui/material";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import GoogleIcon from "@mui/icons-material/Google";

const universities = [
  "Çankaya Üniversitesi",
  "Başkent Üniversitesi",
  "Hacettepe Üniversitesi",
];

export default function Uregister() {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Card sx={{ maxWidth: 400, marginTop: "5%" }}>
        <CardMedia
          component="img"
          alt="ai"
          height="200"
          image="/src/assets/university.jpg"
        />
        <CardContent>
          <Typography align="center" gutterBottom variant="h5" component="div">
            Sign Up
          </Typography>
          {/* <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Email
        </Typography> */}
          <Autocomplete
            disablePortal
            options={universities}
            sx={{ width: "100%" }}
            renderInput={(university) => (
              <TextField {...university} label="Select University" />
            )}
          />
          <TextField
            sx={{ width: "100%" }}
            margin="normal"
            id="outlined-basic"
            label="University Email"
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
            href="/university-register"
            size="normal"
            sx={{ width: "100%", backgroundColor: "darkred" }}
            variant="contained"
          >
            Sign Up
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
