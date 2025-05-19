import { Box, Grid2 } from "@mui/material";
import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function SqlQueries() {
  return (
    <>
      <Box>
        <Grid2 container gap={2}>
          <Grid2 size={4}>
            <Card sx={{ width: 500 }}>
              <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image="/static/images/cards/contemplative-reptile.jpg"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  SQL Sorgusu
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Bu kısımda sql sorgusularını ve
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid2>
          <Grid2 size={8}></Grid2>
        </Grid2>
      </Box>
    </>
  );
}

export default SqlQueries;
