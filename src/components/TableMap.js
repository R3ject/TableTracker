// src/components/TableMap.js
import React, { useCallback } from "react";
import { Box, Typography } from "@mui/material";

const hardcodedSvg = `
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Brewpub Table Map">
  <title>Brewpub Table Map</title>
  <g aria-label="Table 1, Capacity 8, Status Available">
    <rect x="50" y="50" width="80" height="80" fill="#ccc" stroke="#000" data-table="Table 1"/>
    <text x="90" y="90" text-anchor="middle" font-size="14" fill="#000">Table 1</text>
  </g>
  <g aria-label="Table 2, Capacity 16, Status Available">
    <rect x="150" y="30" width="100" height="100" fill="#ccc" stroke="#000" data-table="Table 2"/>
    <text x="200" y="80" text-anchor="middle" font-size="14" fill="#000">Table 2</text>
  </g>
  <g aria-label="Bar, Capacity 10, Status Available">
    <rect x="300" y="50" width="60" height="40" fill="#ccc" stroke="#000" data-table="bar"/>
    <text x="330" y="75" text-anchor="middle" font-size="12" fill="#000">Bar</text>
  </g>
  <g aria-label="Table 3, Capacity 4, Status Available">
    <rect x="50" y="200" width="60" height="60" fill="#ccc" stroke="#000" data-table="Table 3"/>
    <text x="80" y="230" text-anchor="middle" font-size="12" fill="#000">Table 3</text>
  </g>
  <g aria-label="Picnic Table 1, Capacity 16, Status Available">
    <rect x="150" y="200" width="160" height="60" fill="#ccc" stroke="#000" data-table="picnic table 1"/>
    <text x="230" y="230" text-anchor="middle" font-size="12" fill="#000">Picnic Table 1</text>
  </g>
  <g aria-label="Table 4, Capacity 4, Status Available">
    <rect x="50" y="300" width="60" height="60" fill="#ccc" stroke="#000" data-table="Table 4"/>
    <text x="80" y="330" text-anchor="middle" font-size="12" fill="#000">Table 4</text>
  </g>
  <g aria-label="Lower Bar, Capacity 6, Status Available">
    <rect x="150" y="300" width="80" height="40" fill="#ccc" stroke="#000" data-table="lower bar"/>
    <text x="190" y="325" text-anchor="middle" font-size="12" fill="#000">Lower Bar</text>
  </g>
</svg>
`;

const TableMap = () => {
  const handleSvgClick = useCallback((e) => {
    const tableName = e.target.getAttribute("data-table");
    if (tableName) {
      alert(`You clicked on ${tableName}`);
    }
  }, []);

  const handleMouseOver = useCallback((e) => {
    const tableName = e.target.getAttribute("data-table");
    if (tableName) {
      console.log(`Hovering over ${tableName}`);
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
