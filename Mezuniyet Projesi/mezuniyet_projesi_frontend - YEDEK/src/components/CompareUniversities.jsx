import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

function CompareUniversities() {
  return (
    <Box>
      <Card>
        <CardContent>
          <Typography align="center">
            Seçilen Üniversitelere Göre Popüler ve Düşüşte Olan Bölümleri ve
            Üniversiteler Ait Arz Talep Oranları
          </Typography>
          <BarChart
            series={[
              { data: [35, 44, 24, 34] },
              { data: [51, 6, 49, 30] },
              { data: [15, 25, 30, 50] },
              { data: [60, 50, 15, 25] },
            ]}
            height={290}
            xAxis={[
              {
                data: [
                  "Çankaya Üniversitesi",
                  "Başkent Üniversitesi",
                  "Hacettepe Üniversitesi",
                  "ODTÜ",
                ],
                scaleType: "band",
              },
            ]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
          />
        </CardContent>
      </Card>
    </Box>
  );
}

export default CompareUniversities;
