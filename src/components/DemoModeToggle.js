// src/components/DemoModeToggle.js
import React, { useState, useEffect } from "react";
import { Button, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const DemoModeToggle = () => {
  const theme = useTheme();
  const [demoMode, setDemoMode] = useState(
    localStorage.getItem("demoMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("demoMode", demoMode);
  }, [demoMode]);

  const toggleDemoMode = () => {
    setDemoMode((prev) => !prev);
  };

  return (
    <Box sx={{ m: 1 }}>
      <Button
        variant="outlined"
        onClick={toggleDemoMode}
        sx={{
          color: theme.palette.mode === "light" ? "black" : "yellow",
          borderColor: theme.palette.mode === "light" ? "black" : "yellow",
          "&:hover": {
            borderColor: theme.palette.mode === "light" ? "black" : "yellow",
            backgroundColor:
              theme.palette.mode === "light"
                ? "rgba(0,0,0,0.04)"
                : "rgba(255,255,0,0.08)",
          },
        }}
      >
        {demoMode ? "Disable Demo Mode" : "Enable Demo Mode"}
      </Button>
    </Box>
  );
};

export default DemoModeToggle;
