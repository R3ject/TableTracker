import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { db, auth } from "../firebase/firebaseConfig";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

// Simple filters component
const Filters = ({
  filterCapacity,
  setFilterCapacity,
  filterStatus,
  setFilterStatus,
  sortOption,
  setSortOption,
}) => (
  <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
      <InputLabel id="filter-capacity-label">Capacity</InputLabel>
      <Select
        labelId="filter-capacity-label"
        value={filterCapacity}
        label="Capacity"
        onChange={(e) => setFilterCapacity(e.target.value)}
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="4">4</MenuItem>
        <MenuItem value="6">6</MenuItem>
        <MenuItem value="8">8</MenuItem>
        <MenuItem value="10">10</MenuItem>
      </Select>
    </FormControl>
    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
      <InputLabel id="filter-status-label">Status</InputLabel>
      <Select
        labelId="filter-status-label"
        value={filterStatus}
        label="Status"
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="Available">Available</MenuItem>
        <MenuItem value="Claimed">Claimed</MenuItem>
        <MenuItem value="Occupied">Occupied</MenuItem>
      </Select>
    </FormControl>
    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
      <InputLabel id="sort-option-label">Sort by</InputLabel>
      <Select
        labelId="sort-option-label"
        value={sortOption}
        label="Sort by"
        onChange={(e) => setSortOption(e.target.value)}
      >
        <MenuItem value="name">Name</MenuItem>
        <MenuItem value="capacity">Capacity</MenuItem>
        <MenuItem value="waitTime">Wait Time</MenuItem>
      </Select>
    </FormControl>
  </Box>
);

// Demo mode: if URL contains "demo=true", bypass geolocation restrictions.
const isDemoMode = () => {
  return window.location.search.includes("demo=true");
};

const CustomerView = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCapacity, setFilterCapacity] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOption, setSortOption] = useState("name");

  // Rate limiting constants
  const nowMs = () => new Date().getTime();
  const MAX_ATTEMPTS = 3;
  const TIME_WINDOW = 60 * 60 * 1000; // 1 hour

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "tables"),
      (snapshot) => {
        const tableData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTables(tableData);
        setLoading(false);
      },
      (error) => {
        toast.error("Error fetching tables");
        console.error(error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const getTableStartTime = (table) => {
    if (table.status === "Occupied" && table.occupiedAt) {
      return new Date(table.occupiedAt);
    } else if (table.status === "Claimed" && table.claimedAt) {
      return new Date(table.claimedAt);
    }
    return null;
  };

  const getEstimatedWait = (table) => {
    const historicalAverage = 30;
    const startTime = getTableStartTime(table);
    if (!startTime) return "";
    const now = new Date();
    const elapsedMinutes = (now - startTime) / 60000;
    const remaining = historicalAverage - elapsedMinutes;
    return remaining > 0
      ? `Frees up in ${Math.ceil(remaining)} mins`
      : "Free now";
  };

  const getWaitTimeInMinutes = useCallback((table) => {
    if (table.status === "Available") return -1;
    const averageOccupancy = 30;
    const startTime = getTableStartTime(table);
    if (!startTime) return 0;
    const elapsedMinutes = (new Date() - startTime) / 60000;
    return Math.max(averageOccupancy - elapsedMinutes, 0);
  }, []);

  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      const capacityMatch =
        filterCapacity === "All" ||
        table.capacity === parseInt(filterCapacity, 10);
      const statusMatch =
        filterStatus === "All" || table.status === filterStatus;
      return capacityMatch && statusMatch;
    });
  }, [tables, filterCapacity, filterStatus]);

  const sortedTables = useMemo(() => {
    return [...filteredTables].sort((a, b) => {
      if (sortOption === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "capacity") {
        return a.capacity - b.capacity;
      } else if (sortOption === "waitTime") {
        return getWaitTimeInMinutes(a) - getWaitTimeInMinutes(b);
      }
      return 0;
    });
  }, [filteredTables, sortOption, getWaitTimeInMinutes]);

  const claimTable = async (table) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error("User not authenticated.");
      return;
    }
    const userId = currentUser.uid;

    // Rate limiting: track claim attempts in Firestore
    const attemptsRef = doc(db, "claimAttempts", userId);
    let attemptsData = { attempts: [] };
    const attemptsSnap = await getDoc(attemptsRef);
    if (attemptsSnap.exists()) {
      attemptsData = attemptsSnap.data();
    }
    const currentTime = nowMs();
    attemptsData.attempts = attemptsData.attempts.filter(
      (ts) => currentTime - ts < TIME_WINDOW
    );
    if (attemptsData.attempts.length >= MAX_ATTEMPTS) {
      toast.error(
        "You have reached the maximum number of claim attempts for this hour."
      );
      return;
    }
    attemptsData.attempts.push(currentTime);
    await setDoc(attemptsRef, attemptsData);

    // If table is not available, add user to reservation queue and return.
    if (table.status !== "Available") {
      await updateDoc(doc(db, "tables", table.id), {
        queue: table.queue ? [...table.queue, userId] : [userId],
      });
      toast.info("You've been added to the queue for this table");
      return;
    }

    // Proceed with claim if table is available and user is on-site.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log("Geolocation position received:", position);
          const { latitude, longitude } = position.coords;
          console.log("Simulated coordinates:", latitude, longitude);
          if (!checkIfOnSite(latitude, longitude)) {
            toast.error("You must be on-site to claim a table.");
            return;
          }
          try {
            await updateDoc(doc(db, "tables", table.id), {
              status: "Claimed",
              claimedAt: new Date().toISOString(),
              lastUpdated: new Date().toISOString(),
            });
            toast.success(`You claimed ${table.name}!`);
            // Update user stats: increment claim count in "userStats" collection
            const userStatsRef = doc(db, "userStats", userId);
            const userStatsSnap = await getDoc(userStatsRef);
            let newCount = 1;
            if (userStatsSnap.exists()) {
              const data = userStatsSnap.data();
              newCount = (data.claimCount || 0) + 1;
            }
            await setDoc(userStatsRef, { claimCount: newCount }, { merge: true });
          } catch (error) {
            toast.error("Error claiming table");
            console.error(error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Unable to retrieve your location");
        },
        { maximumAge: 0, timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      toast.error("Geolocation not supported by your browser");
    }
  };

  // Check if user is on-site; logs received coordinates and calculated distance.
  const checkIfOnSite = (lat, lon) => {
    console.log("Received coordinates in checkIfOnSite:", lat, lon);
    if (isDemoMode()) {
      console.log("Demo mode active - bypassing geolocation check.");
      return true;
    }
    const brewpubLat = 32.3487522; // Actual brewery latitude
    const brewpubLon = -95.3008154; // Actual brewery longitude
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(brewpubLat - lat);
    const dLon = toRad(brewpubLon - lon);
    const a =
      Math.sin(dLon / 2) ** 2 +
      Math.cos(toRad(lat)) * Math.cos(toRad(brewpubLat)) *
      Math.sin(dLat / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    console.log("Calculated distance (km) in CustomerView:", distance);
    return distance <= 2;
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 4,
          p: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          boxShadow: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Brewpub Table Availability
        </Typography>
        <Filters
          filterCapacity={filterCapacity}
          setFilterCapacity={setFilterCapacity}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : sortedTables.length > 0 ? (
            sortedTables.map((table) => (
              <Box
                key={table.id}
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  boxShadow: 1,
                  backgroundColor: "background.paper",
                }}
              >
                <Typography variant="h6">
                  {table.name} - Capacity: {table.capacity} - Status: {table.status}
                </Typography>
                {(table.status === "Occupied" || table.status === "Claimed") && (
                  <Typography variant="body2">
                    {table.customWaitMessage ? table.customWaitMessage : getEstimatedWait(table)}
                  </Typography>
                )}
                {table.status === "Available" && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => claimTable(table)}
                  >
                    Claim Table
                  </Button>
                )}
                {table.status === "Claimed" && (
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Claimed
                  </Typography>
                )}
              </Box>
            ))
          ) : (
            <Typography variant="body1" sx={{ mt: 2 }}>
              No tables match your filters.
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default CustomerView;
