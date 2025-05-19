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

export default function Student() {
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
          alt="Student"
          height="200"
          image="/src/assets/student.jpeg"
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
            Öğrenci Girişi
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            variant="outlined"
            placeholder="your@email.com"
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
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: "#553C9A",
                    "&.Mui-checked": {
                      color: "#553C9A",
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                    color: "#4A5568",
                  }}
                >
                  Beni Hatırla
                </Typography>
              }
            />
          </FormGroup>
        </CardContent>
        <CardActions sx={{ px: 4, pb: 2 }}>
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
            Giriş Yap
          </Button>
        </CardActions>
        <CardActions sx={{ px: 4, justifyContent: "center" }}>
          <Link
            href="#"
            underline="hover"
            sx={{
              color: "#553C9A",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.9rem",
            }}
          >
            Şifremi Unuttum
          </Link>
        </CardActions>
        <CardContent sx={{ px: 4, py: 2 }}>
          <Divider
            sx={{
              "&::before, &::after": {
                borderColor: "rgba(107, 70, 193, 0.2)",
              },
            }}
          >
            <Typography
              sx={{
                color: "#4A5568",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem",
              }}
            >
              veya
            </Typography>
          </Divider>
        </CardContent>
        <CardActions sx={{ px: 4, pb: 4, flexDirection: "column", gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{
              borderColor: "#553C9A",
              color: "#553C9A",
              "&:hover": {
                borderColor: "#6B46C1",
                backgroundColor: "rgba(107, 70, 193, 0.04)",
              },
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: "1rem",
              py: 1.5,
            }}
          >
            Google ile Giriş Yap
          </Button>
          <Typography
            align="center"
            sx={{
              color: "#4A5568",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.9rem",
            }}
          >
            Hesabınız yok mu?{" "}
            <Link
              href="/student-register"
              underline="hover"
              sx={{
                color: "#553C9A",
                fontWeight: 500,
              }}
            >
              Kayıt Ol
            </Link>
          </Typography>
        </CardActions>
      </Card>
    </Box>
  );
}
