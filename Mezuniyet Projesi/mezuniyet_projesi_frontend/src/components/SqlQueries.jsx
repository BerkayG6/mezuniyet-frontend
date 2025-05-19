import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CodeIcon from "@mui/icons-material/Code";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save";

const CustomTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#FFFFFF",
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
});

// Sample data for demonstration
const sampleData = [
  { id: 1, name: "Sample Row 1", value: "Value 1" },
  { id: 2, name: "Sample Row 2", value: "Value 2" },
  { id: 3, name: "Sample Row 3", value: "Value 3" },
];

function SqlQueries() {
  return (
    <Box
      sx={{
        width: "1200px",
        padding: "40px",
        backgroundColor: "#F6F0FE",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          maxWidth: "1800px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: 8,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            color: "#553C9A",
            letterSpacing: "-0.5px",
            fontSize: "2.5rem",
          }}
        >
          SQL Sorgu Arayüzü
        </Typography>

        <Grid container spacing={6}>
          {/* Query Editor Section */}
          <Grid item xs={12} lg={6}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
                height: "100%",
                minHeight: "600px",
              }}
            >
              <Stack spacing={4}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    color: "#553C9A",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: "1.5rem",
                  }}
                >
                  <CodeIcon sx={{ fontSize: "1.8rem" }} />
                  SQL Sorgusu
                </Typography>

                <CustomTextField
                  multiline
                  rows={15}
                  placeholder="SELECT * FROM table_name WHERE condition;"
                  fullWidth
                  sx={{
                    fontFamily: "monospace",
                    "& .MuiOutlinedInput-root": {
                      fontFamily: "monospace",
                      fontSize: "1.1rem",
                    },
                  }}
                />

                <Stack direction="row" spacing={3} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<SaveIcon />}
                    sx={{
                      color: "#553C9A",
                      borderColor: "#553C9A",
                      "&:hover": {
                        borderColor: "#6B46C1",
                        backgroundColor: "rgba(107, 70, 193, 0.04)",
                      },
                      px: 4,
                    }}
                  >
                    Kaydet
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayArrowIcon />}
                    sx={{
                      backgroundColor: "#553C9A",
                      "&:hover": {
                        backgroundColor: "#6B46C1",
                      },
                      px: 4,
                    }}
                  >
                    Çalıştır
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          {/* Results Section */}
          <Grid item xs={12} lg={6}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: "0 4px 20px -5px rgba(107, 70, 193, 0.2)",
                minHeight: "600px",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  color: "#553C9A",
                  fontSize: "1.5rem",
                }}
              >
                Sorgu Sonuçları
              </Typography>

              <TableContainer sx={{ minHeight: "500px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          backgroundColor: "#553C9A",
                          color: "white",
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          fontSize: "1.1rem",
                          py: 2,
                        }}
                      >
                        ID
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: "#553C9A",
                          color: "white",
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          fontSize: "1.1rem",
                          py: 2,
                        }}
                      >
                        Name
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: "#553C9A",
                          color: "white",
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          fontSize: "1.1rem",
                          py: 2,
                        }}
                      >
                        Value
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sampleData.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:nth-of-type(odd)": {
                            backgroundColor: "#F8F5FF",
                          },
                          "&:hover": {
                            backgroundColor: "#EDE7F6",
                          },
                          "& .MuiTableCell-root": {
                            fontSize: "1.1rem",
                            py: 2,
                          },
                        }}
                      >
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default SqlQueries;
