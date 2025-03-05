// src/components/TableList.js
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import TableItem from "./TableItem";
import Grid from "@mui/material/Grid";
import { isDemoMode, haversineDistance } from "../utils/DemoModeUtils";

// Utility function for shuffling an array
const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const TableList = () => {
  const [tables, setTables] = useState([]);
  const currentUser = auth.currentUser;
  const isStaff = currentUser?.email?.toLowerCase().includes("staff");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "tables"),
      (snapshot) => {
        const tableData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTables(tableData);
        localStorage.setItem("tables", JSON.stringify(tableData));
      },
      (error) => {
        toast.error("Failed to fetch table data.");
        console.error(error);
        const cached = localStorage.getItem("tables");
        if (cached) setTables(JSON.parse(cached));
      }
    );
    return () => unsubscribe();
  }, []);

  const toggleStatus = async (table) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log("Geolocation position received:", position);
          const { latitude, longitude } = position.coords;
          console.log("Simulated coordinates:", latitude, longitude);
          if (!checkIfOnSite(latitude, longitude)) {
            toast.error("You must be on-site to update table status.");
            return;
          }
          await updateTableStatus(table);
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Unable to verify your location.");
        },
        { maximumAge: 0, timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      await updateTableStatus(table);
    }
  };

  const updateTableStatus = async (table) => {
    try {
      const newStatus = table.status === "Available" ? "Occupied" : "Available";
      const timestamp = new Date().toLocaleTimeString();
      const newEntry = `${newStatus} at ${timestamp}`;
      const updatedHistory = table.history ? [...table.history, newEntry] : [newEntry];
      
      await updateDoc(doc(db, "tables", table.id), {
        status: newStatus,
        lastUpdated: new Date().toISOString(),
        history: updatedHistory
      });
      toast.success(`Table ${table.name} is now ${newStatus}`);
    } catch (error) {
      toast.error("Error updating table status.");
      console.error(error);
    }
  };

  const reorderQueue = async (table) => {
    if (!table.queue || table.queue.length < 2) {
      toast.info("Queue does not require reordering.");
      return;
    }
    const newQueue = shuffleArray(table.queue);
    try {
      await updateDoc(doc(db, "tables", table.id), { queue: newQueue });
      toast.success(`Reservation queue for ${table.name} has been reordered.`);
    } catch (error) {
      toast.error("Error reordering queue.");
      console.error(error);
    }
  };

  const updateTableNote = async (table, note) => {
    try {
      await updateDoc(doc(db, "tables", table.id), {
        note,
        lastUpdated: new Date().toISOString(),
      });
      toast.success(`Note updated for ${table.name}`);
    } catch (error) {
      toast.error("Error updating note.");
      console.error(error);
    }
  };

  const checkIfOnSite = (lat, lon) => {
    console.log("Received coordinates in TableList:", lat, lon);
    if (isDemoMode()) {
      console.log("Demo mode active - bypassing geolocation check.");
      return true;
    }
    const brewpubLat = 32.3487522;
    const brewpubLon = -95.3008154;
    const distance = haversineDistance(lat, lon, brewpubLat, brewpubLon);
    console.log("Calculated distance (km) in TableList:", distance);
    return distance <= 2;
  };

  return (
    <Grid container spacing={2}>
      {tables.map((table) => (
        <Grid item xs={12} sm={6} md={4} key={table.id}>
          <TableItem
            table={table}
            onToggle={toggleStatus}
            onReorderQueue={isStaff ? reorderQueue : undefined}
            onAddNote={isStaff ? updateTableNote : undefined}
            isLoading={false}
            isStaff={isStaff}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default TableList;
