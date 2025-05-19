import React, { useState, useEffect } from "react";
import {
  ImageList,
  ImageListItem,
  Box,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// Import all images directly
const images = Object.entries(
  import.meta.glob("../assets/UNIVERSITIES/*.png", { eager: true })
);

// Function to normalize Turkish characters
function normalizeText(text) {
  return text
    .replace(/ý/g, "ı")
    .replace(/þ/g, "ş")
    .replace(/ð/g, "ğ")
    .replace(/Ý/g, "İ")
    .replace(/Þ/g, "Ş")
    .replace(/Ð/g, "Ğ")
    .replace(/ý/g, "ı")
    .replace(/Ý/g, "İ")
    .replace(/ü/g, "ü")
    .replace(/Ü/g, "Ü")
    .replace(/ö/g, "ö")
    .replace(/Ö/g, "Ö")
    .replace(/ç/g, "ç")
    .replace(/Ç/g, "Ç")
    .replace(/æ/g, "ş")
    .replace(/Æ/g, "Ş");
}

export default function ImageListDisplay() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadedImages, setLoadedImages] = useState([]);

  useEffect(() => {
    // Filter out any images that failed to load
    const validImages = images.filter(([_, image]) => image && image.default);
    setLoadedImages(validImages);
  }, []);

  // Filter images based on search term
  const filteredImages = loadedImages.filter(([path]) => {
    const imageName = normalizeText(
      path
        .split("/")
        .pop()
        .replace("cluster_", "")
        .replace("_analysis.png", "")
        .toLowerCase()
    );

    const normalizedSearchTerm = normalizeText(searchTerm.toLowerCase());
    return imageName.includes(normalizedSearchTerm);
  });

  // Function to format display name
  const formatDisplayName = (path) => {
    const name = path
      .split("/")
      .pop()
      .replace("cluster_", "")
      .replace("_analysis.png", "");
    return normalizeText(name);
  };

  return (
    <Box
      sx={{
        padding: { xs: "20px", md: "40px" },
        backgroundColor: "#F6F0FE",
        minHeight: "100vh",
        paddingTop: "100px",
        marginTop: "70px",
      }}
    >
      <Box sx={{ maxWidth: "1800px", margin: "0 auto" }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: 4,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            color: "#553C9A",
            letterSpacing: "-0.5px",
          }}
        >
          Bölüm Analizleri
        </Typography>

        {/* Search Bar */}
        <Box
          sx={{
            maxWidth: "600px",
            margin: "0 auto",
            mb: 4,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Üniversite Ara...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              backgroundColor: "white",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(107, 70, 193, 0.2)",
                },
                "&:hover fieldset": {
                  borderColor: "#553C9A",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#553C9A",
                },
              },
              "& .MuiInputBase-input": {
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.95rem",
                padding: "14px",
                color: "#553C9A",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#553C9A" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Results Count */}
        <Typography
          sx={{
            mb: 3,
            textAlign: "center",
            fontFamily: "'Inter', sans-serif",
            color: "#553C9A",
            fontSize: "0.95rem",
          }}
        >
          {filteredImages.length} sonuç bulundu
        </Typography>

        <ImageList
          sx={{
            width: "100%",
            height: "auto",
            gap: "20px !important",
          }}
          cols={{ xs: 1, sm: 2, md: 3 }}
          gap={20}
        >
          {filteredImages.map(([path, image], index) => (
            <ImageListItem
              key={index}
              sx={{
                overflow: "hidden",
                borderRadius: 3,
                boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
                backgroundColor: "white",
                padding: "16px",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 30px -5px rgba(107, 70, 193, 0.3)",
                },
              }}
            >
              <img
                src={image.default}
                alt={formatDisplayName(path)}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <Typography
                sx={{
                  mt: 2,
                  color: "#553C9A",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.95rem",
                  textAlign: "center",
                  fontWeight: 500,
                }}
              >
                {formatDisplayName(path)}
              </Typography>
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </Box>
  );
}
