import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { PieChart } from "@mui/x-charts/PieChart";
import { Chip, Divider } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

function ResultStudent() {
  return (
    <Box>
      <Card sx={{ width: 500, padding: 2, borderRadius: 5, boxShadow: 5 }}>
        <Typography align="center" variant="h4">
          Result
        </Typography>
        <CardMedia sx={{ height: 140 }} image="/src/assets/ai.jpg" title="ai" />
        <CardContent>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10, label: "series A" },
                  { id: 1, value: 15, label: "series B" },
                  { id: 2, value: 20, label: "series C" },
                ],
              },
            ]}
            width={400}
            height={200}
          />
        </CardContent>
        <CardContent>
          <Typography align="center" variant="h5">
            Önerilerimiz
          </Typography>
          <Typography variant="inherit">
            1.Bu bölüme şu oranda yerleşebilirsiniz. 2.Bu bölümle alakalı diğer
            bölümler şunlardır:
          </Typography>
        </CardContent>
        <Divider sx={{ padding: 2 }}>
          <Chip label="Düşüncelerini Bizimle Paylaş"></Chip>
        </Divider>
        <CardActions sx={{ justifyContent: "center" }}>
          <Button
            startIcon={<ThumbUpIcon></ThumbUpIcon>}
            color="success"
            variant="contained"
            size="small"
          >
            Başarılı
          </Button>
          <Button
            startIcon={<ThumbDownIcon></ThumbDownIcon>}
            color="error"
            variant="contained"
            size="small"
          >
            Başarısız
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default ResultStudent;
