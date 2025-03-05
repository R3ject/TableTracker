import React, { useState, useEffect } from "react";
import { Button, Box } from "@mui/material";

const DemoModeToggle = () => {
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
    <Box sx={{ mb: 2 }}>
      <Button variant="outlined" onClick={toggleDemoMode}>
        {demoMode ? "Disable Demo Mode" : "Enable Demo Mode"}
      </Button>
    </Box>
  );
};

export default DemoModeToggle;
