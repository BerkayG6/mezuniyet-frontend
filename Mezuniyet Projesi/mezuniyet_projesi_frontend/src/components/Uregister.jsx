import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Autocomplete } from "@mui/material";
import Box from "@mui/material/Box";

const universities = [
  "Çankaya Üniversitesi",
  "Başkent Üniversitesi",
  "Hacettepe Üniversitesi",
];

export default function Uregister() {
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
          alt="University"
          height="200"
          image="/src/assets/university.jpg"
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
            Üniversite Kayıt
          </Typography>
          <Autocomplete
            disablePortal
            options={universities}
            fullWidth
            renderInput={(params) => (
              <TextField
                {...params}
                label="Üniversite Seç"
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
            )}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Üniversite Email"
            variant="outlined"
            placeholder="university@email.com"
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
      </Card>
    </Box>
  );
}
