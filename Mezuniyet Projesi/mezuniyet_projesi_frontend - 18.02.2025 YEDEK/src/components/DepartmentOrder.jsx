import { Box, Card, CardContent, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import React from "react";

function DepartmentOrder() {
  return (
    <Box>
      <Card>
        <CardContent>
          <Typography align="center">
            Seçtiğiniz Bölümlerin Gelecek Yıl Kotenjan Yerleşme Kız ve Erkek
            Oranları
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
                  "Bilgisayar Müh. (%50 İndirimli)",
                  "Hukuk (%100)",
                  "İnşaat Müh. (Burslu)",
                  "Yazılım Müh. (%50 İndirimli)",
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

export default DepartmentOrder;
