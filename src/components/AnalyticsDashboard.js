// src/components/AnalyticsDashboard.js
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";

// Sample chart data (replace with your actual Chart.js data)
const sampleChartData = [
  { label: "Occupied", value: 10 },
  { label: "Available", value: 5 },
  { label: "Claimed", value: 3 },
];

const AnalyticsDashboard = () => {
  const [chartData] = useState(sampleChartData);

  const exportCSV = () => {
    const csvRows = [];
    csvRows.push("Label,Value");
    chartData.forEach((row) => {
      csvRows.push(`${row.label},${row.value}`);
    });
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Typography variant="h5">Analytics Dashboard</Typography>
      {/* Your Chart.js component would be rendered here */}
      <Button variant="outlined" onClick={exportCSV} sx={{ mt: 2 }}>
        Export Analytics as CSV
      </Button>
    </Box>
  );
};

export default AnalyticsDashboard;
