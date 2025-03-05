import React, { useCallback } from "react";
import { Box, Typography } from "@mui/material";

// Hardcoded SVG markup for the table map
const hardcodedSvg = `
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <!-- Table Rows -->
  <rect x="50" y="50" width="100" height="50" fill="#ccc" stroke="#000" data-table="Table 1"/>
  <rect x="200" y="50" width="100" height="50" fill="#ccc" stroke="#000" data-table="Table 2"/>
  <rect x="350" y="50" width="100" height="50" fill="#ccc" stroke="#000" data-table="Table 3"/>
  <rect x="50" y="150" width="100" height="50" fill="#ccc" stroke="#000" data-table="Table 4"/>
  <rect x="200" y="150" width="100" height="50" fill="#ccc" stroke="#000" data-table="Table 5"/>
  <rect x="350" y="150" width="100" height="50" fill="#ccc" stroke="#000" data-table="Table 6"/>
  
  <!-- Optional: Add table numbers as labels -->
  <text x="100" y="80" text-anchor="middle" font-size="16" fill="#000">1</text>
  <text x="250" y="80" text-anchor="middle" font-size="16" fill="#000">2</text>
  <text x="400" y="80" text-anchor="middle" font-size="16" fill="#000">3</text>
  <text x="100" y="180" text-anchor="middle" font-size="16" fill="#000">4</text>
  <text x="250" y="180" text-anchor="middle" font-size="16" fill="#000">5</text>
  <text x="400" y="180" text-anchor="middle" font-size="16" fill="#000">6</text>
</svg>
`;

const TableMap = () => {
  // Click handler for elements with a "data-table" attribute
  const handleSvgClick = useCallback((e) => {
    const tableName = e.target.getAttribute("data-table");
    if (tableName) {
      alert(`You clicked on table: ${tableName}`);
    }
  }, []);

  // Mouse over handler for simple logging (can be expanded to show tooltips)
  const handleMouseOver = useCallback((e) => {
    const tableName = e.target.getAttribute("data-table");
    if (tableName) {
      console.log(`Hovering over table: ${tableName}`);
    }
  }, []);

  return (
    <Box
      sx={{
        mt: 4,
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
      onClick={handleSvgClick}
      onMouseOver={handleMouseOver}
    >
      <Typography variant="h6" gutterBottom>
        Table Map
      </Typography>
      <Box
        sx={{ width: "100%", height: "auto" }}
        dangerouslySetInnerHTML={{ __html: hardcodedSvg }}
      />
    </Box>
  );
};

export default TableMap;
