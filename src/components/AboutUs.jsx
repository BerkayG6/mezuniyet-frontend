import { Box, Stack, Divider, IconButton } from "@mui/material";
import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import SchoolIcon from "@mui/icons-material/School";
import CodeIcon from "@mui/icons-material/Code";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";

const members = [
  {
    name: "Emircan Güneş",
    title: "Yazılım Mühendisi",
    description: "Yapay Zeka & Frontend & Veri Bilimi",
    image: "/src/assets/emircan.jpg",
  },
  {
    name: "Mehmet Deniz Kaya",
    title: "Yazılım Mühendisi",
    description: "Yapay Zeka & LLM",
    image: "/src/assets/deniz.jpg",
  },
  {
    name: "Halil Berkay Güngör",
    title: "Yazılım Mühendisi",
    description: "Yapay Zeka & Backend",
    image: "/src/assets/berkay.jpg",
  },
];

function AboutUs() {
  return (
    <Box
      sx={{
        padding: { xs: "20px", md: "40px" },
        backgroundColor: "#F6F0FE",
        minHeight: "100vh",
        marginTop: 10,
      }}
    >
      <Box
        sx={{
          maxWidth: "1500px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              color: "#553C9A",
              mb: 2,
            }}
          >
            Hakkımızda
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Inter', sans-serif",
              color: "#6B46C1",
              maxWidth: "800px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Yapay zeka destekli üniversite tercih ve tahmin sistemi ile
            geleceğinizi şekillendirin
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Project Info Section */}
          <Grid item xs={12} lg={6}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 4,
                backgroundColor: "#FFFFFF",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-8px)",
                },
                boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
              }}
            >
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  alt="AI Project Image"
                  height="400"
                  image="/src/assets/ai.jpg"
                  sx={{
                    objectFit: "cover",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background:
                      "linear-gradient(to top, rgba(85, 60, 154, 0.9), transparent)",
                    padding: "100px 20px 20px",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      color: "white",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    YKS ANALYSIS
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "white",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Üniversite Akıllı Planlama ve Tahmin Sistemi
                  </Typography>
                </Box>
              </Box>
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        color: "#553C9A",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      <AutoGraphIcon sx={{ fontSize: 28 }} /> Proje Amacı
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#4A5568",
                        lineHeight: 1.8,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "1.1rem",
                      }}
                    >
                      Yapay zeka teknolojilerini kullanarak öğrencilerin
                      üniversite tercihlerinde daha doğru kararlar vermelerine
                      yardımcı olmak ve gelecekteki yerleştirme tahminlerini
                      hassas bir şekilde yapabilmek.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        color: "#553C9A",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      <CodeIcon sx={{ fontSize: 28 }} /> Teknolojiler
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={2}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {[
                        "React",
                        "Python",
                        "JavaScript",
                        "Material-UI",
                        "Web Scraping",
                        "Machine Learning",
                        "MySQL Workbench",
                        "LLM",
                      ].map((tech) => (
                        <Box
                          key={tech}
                          sx={{
                            bgcolor: "#F8F5FF",
                            color: "#553C9A",
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            fontSize: "0.9rem",
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 500,
                          }}
                        >
                          {tech}
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Team Members Section */}
          <Grid item xs={12} lg={6}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 4,
                backgroundColor: "#FFFFFF",
                boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
                p: 4,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  color: "#553C9A",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  mb: 4,
                }}
              >
                <SchoolIcon sx={{ fontSize: 32 }} /> Ekip Üyeleri
              </Typography>
              <Grid container spacing={3}>
                {members.map((member, index) => (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": { transform: "translateY(-8px)" },
                        boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardMedia
                        component="img"
                        src={member.image}
                        sx={{
                          height: 200,
                          objectFit: "cover",
                          borderBottom: "1px solid rgba(107, 70, 193, 0.1)",
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "#553C9A",
                            fontFamily: "'Poppins', sans-serif",
                            mb: 1,
                          }}
                        >
                          {member.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#6B46C1",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.9rem",
                            mb: 2,
                          }}
                        >
                          {member.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#4A5568",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.9rem",
                            lineHeight: 1.6,
                          }}
                        >
                          {member.description}
                        </Typography>
                      </CardContent>
                      <Divider
                        sx={{ borderColor: "rgba(107, 70, 193, 0.1)" }}
                      />
                      <CardActions sx={{ justifyContent: "center", p: 2 }}>
                        <IconButton
                          sx={{
                            color: "#553C9A",
                            "&:hover": { color: "#6B46C1" },
                          }}
                        >
                          <LinkedInIcon />
                        </IconButton>
                        <IconButton
                          sx={{
                            color: "#553C9A",
                            "&:hover": { color: "#6B46C1" },
                          }}
                        >
                          <GitHubIcon />
                        </IconButton>
                        <IconButton
                          sx={{
                            color: "#553C9A",
                            "&:hover": { color: "#6B46C1" },
                          }}
                        >
                          <EmailIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default AboutUs;
