// src/components/TableItem.js
import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import ChairIcon from "@mui/icons-material/Chair";
import Chip from "@mui/material/Chip";
import Fade from "@mui/material/Fade";
import Collapse from "@mui/material/Collapse";

const TableItem = ({
  table,
  onToggle,
  onReorderQueue,
  onAddNote,
  isLoading,
  isStaff,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const lastUpdated = table.lastUpdated
    ? new Date(table.lastUpdated).toLocaleTimeString()
    : null;

  return (
    <Card
      sx={{
        width: "100%",
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.02)" },
        p: 1,
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
          <TableRestaurantIcon sx={{ mr: 1 }} />
          {table.name}
        </Typography>
        <Fade in timeout={300}>
          <Typography color="text.secondary" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <ChairIcon sx={{ mr: 0.5 }} />
            {table.status}
          </Typography>
        </Fade>
        <Chip
          label={table.status}
          color={table.status === "Available" ? "success" : "warning"}
          size="small"
          sx={{ mt: 1 }}
        />
        {lastUpdated && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            Last Updated: {lastUpdated}
          </Typography>
        )}
        {table.note && (
          <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
            Note: {table.note}
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Button onClick={() => onToggle(table)} size="small" disabled={isLoading}>
          {isLoading ? (
            <CircularProgress size={20} />
          ) : table.status === "Available" ? (
            "Claim Table"
          ) : (
            "Claimed"
          )}
        </Button>
        {isStaff && (
          <>
            {onReorderQueue && table.queue && table.queue.length > 1 && (
              <Button onClick={() => onReorderQueue(table)} size="small" color="secondary">
                Reorder Queue
              </Button>
            )}
            {onAddNote && (
              <Button
                onClick={() => {
                  const note = prompt("Enter note for table:", table.note || "");
                  if (note !== null) {
                    onAddNote(table, note);
                  }
                }}
                size="small"
                color="info"
              >
                {table.note ? "Edit Note" : "Add Note"}
              </Button>
            )}
            <Button
              onClick={() => setShowHistory((prev) => !prev)}
              size="small"
              color="inherit"
            >
              {showHistory ? "Hide History" : "Show History"}
            </Button>
          </>
        )}
      </CardActions>
      <Collapse in={showHistory}>
        <CardContent>
          {table.history && table.history.length > 0 ? (
            table.history.map((entry, index) => (
              <Typography key={index} variant="body2">
                {entry}
              </Typography>
            ))
          ) : (
            <Typography variant="body2">No history available.</Typography>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default TableItem;
