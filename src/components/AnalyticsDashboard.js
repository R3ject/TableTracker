// src/components/AnalyticsDashboard.js
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

// Import and register Chart.js modules
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsDashboard = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "tables"));
      let totalOccupiedTime = 0;
      let count = 0;

      snapshot.forEach((doc) => {
        const table = doc.data();
        if (table.occupiedAt) {
          const occupiedTime = (new Date() - new Date(table.occupiedAt)) / 60000;
          totalOccupiedTime += occupiedTime;
          count++;
        }
      });

      const averageOccupancy = count ? totalOccupiedTime / count : 0;
      setChartData({
        labels: ["Avg Occupancy (mins)"],
        datasets: [
          {
            label: "Average Occupancy Time",
            data: [Math.ceil(averageOccupancy)],
            backgroundColor: "rgba(255, 191, 0, 0.6)", // amber tone
          },
        ],
      });
    };

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "background.paper",
        borderRadius: 2,
        boxShadow: 2,
        mt: 4,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Analytics Dashboard
      </Typography>
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Average Occupancy Time" },
            },
          }}
        />
      ) : (
        <Typography>Loading analytics...</Typography>
      )}
    </Box>
  );
};

export default AnalyticsDashboard;
