import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import TableItem from "./TableItem";
import Grid from "@mui/material/Grid";

// Utility function for shuffling an array
const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Utility function for calculating distance using Haversine formula
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Demo mode function: returns true if URL includes "demo=true"
const isDemoMode = () => {
  return window.location.search.includes("demo=true");
};

const TableList = () => {
  const [tables, setTables] = useState([]);

  // Check if the current user is staff. For demo, we check if the email includes "staff"
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
        // Cache data in localStorage
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
      await updateDoc(doc(db, "tables", table.id), { status: newStatus });
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
    const brewpubLat = 32.3487522; // Actual brewery latitude
    const brewpubLon = -95.3008154; // Actual brewery longitude
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
