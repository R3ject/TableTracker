// src/components/ReportIssue.js
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { toast } from "react-toastify";

const ReportIssue = () => {
  const [open, setOpen] = useState(false);
  const [issue, setIssue] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "reports"), {
        issue,
        reportedAt: new Date().toISOString(),
      });
      toast.success("Issue reported successfully!");
      setIssue("");
      handleClose();
    } catch (error) {
      toast.error("Error reporting issue.");
      console.error(error);
    }
  };

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={handleOpen}>
        Report Issue
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Report an Issue</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Describe your issue"
            fullWidth
            multiline
            rows={4}
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReportIssue;
