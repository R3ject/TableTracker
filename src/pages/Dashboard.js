import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TableList from "../components/TableList";
import TableMap from "../components/TableMap";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import StaffNotifications from "../components/StaffNotifications";
import ReportIssue from "../components/ReportIssue";


const Dashboard = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 4, p: 2, border: "2px dashed", borderColor: "primary.main" }}
    >
      <StaffNotifications />
      <Box
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          boxShadow: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6} md={8}>
            <Typography variant="h4" gutterBottom>
              TableTracker Dashboard
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            md={4}
            sx={{ textAlign: { xs: "left", md: "right" } }}
          >
            <Typography variant="body1">Staff Area</Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4 }}>
          <TableList />
        </Box>
        <Box sx={{ mt: 4 }}>
          <TableMap />
        </Box>
        <Box sx={{ mt: 4 }}>
          <AnalyticsDashboard />
        </Box>
      </Box>
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <ReportIssue />
      </Box>
    </Container>
  );
};

export default Dashboard;
