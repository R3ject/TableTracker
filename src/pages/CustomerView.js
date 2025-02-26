// src/pages/CustomerView.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const CustomerView = () => {
  const [tables, setTables] = useState([]);
  const [filterCapacity, setFilterCapacity] = useState("All");
  const [sortOption, setSortOption] = useState("name");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "tables"),
      (snapshot) => {
        const tableData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTables(tableData);
      },
      (error) => {
        toast.error("Error fetching tables");
        console.error(error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Function to compute the estimated wait time message
  const getEstimatedWait = (table) => {
    const averageOccupancy = 30; // average in minutes
    let startTime;
    if (table.status === "Occupied" && table.occupiedAt) {
      startTime = new Date(table.occupiedAt);
    } else if (table.status === "Claimed" && table.claimedAt) {
      startTime = new Date(table.claimedAt);
    } else {
      return "";
    }
    const now = new Date();
    const elapsedMinutes = (now - startTime) / 60000;
    const estimatedWait = Math.max(averageOccupancy - elapsedMinutes, 0);
    return estimatedWait > 0 ? `Free in ${Math.ceil(estimatedWait)} mins` : "Free now";
  };

  // Helper function to get wait time in minutes (for sorting)
  const getWaitTimeInMinutes = (table) => {
    const averageOccupancy = 30;
    let startTime;
    if (table.status === "Occupied" && table.occupiedAt) {
      startTime = new Date(table.occupiedAt);
    } else if (table.status === "Claimed" && table.claimedAt) {
      startTime = new Date(table.claimedAt);
    } else {
      return 0;
    }
    const now = new Date();
    const elapsedMinutes = (now - startTime) / 60000;
    return Math.max(averageOccupancy - elapsedMinutes, 0);
  };

  // Geolocation check and claim table function (as before)
  const claimTable = async (table) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          if (!checkIfOnSite(latitude, longitude)) {
            toast.error("You must be on-site to claim a table.");
            return;
          }
          try {
            await updateDoc(doc(db, "tables", table.id), {
              status: "Claimed",
              claimedAt: new Date().toISOString()
            });
            toast.success(`You claimed ${table.name}!`);
          } catch (error) {
            toast.error("Error claiming table");
            console.error(error);
          }
        },
        () => {
          toast.error("Unable to retrieve your location");
        }
      );
    } else {
      toast.error("Geolocation not supported by your browser");
    }
  };

  const checkIfOnSite = (lat, lon) => {
    const brewpubLat = 32.3487522;  // Replace with your brewpub's latitude
    const brewpubLon = -95.3008154;  // Replace with your brewpub's longitude
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(brewpubLat - lat);
    const dLon = toRad(brewpubLon - lon);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat)) * Math.cos(toRad(brewpubLat)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    const allowedDistance = 1; // within 1 km
    return distance <= allowedDistance;
  };

  // Filtering: If filterCapacity is "All", show all tables. Otherwise, show only tables with matching capacity.
  const filteredTables = tables.filter(table => {
    if (filterCapacity === "All") return true;
    // Ensure table.capacity is a number; adjust field name if needed.
    return table.capacity === parseInt(filterCapacity, 10);
  });

  // Sorting: Make a copy of filteredTables and sort based on sortOption.
  const sortedTables = [...filteredTables].sort((a, b) => {
    if (sortOption === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "capacity") {
      return a.capacity - b.capacity;
    } else if (sortOption === "waitTime") {
      return getWaitTimeInMinutes(a) - getWaitTimeInMinutes(b);
    } else {
      return 0;
    }
  });

  return (
    <div className="customer-view">
      <h1>Brewpub Table Availability</h1>

      {/* Filtering and Sorting Controls */}
      <div className="controls" style={{ marginBottom: '20px' }}>
        <label>
          Filter by Capacity:{" "}
          <select value={filterCapacity} onChange={(e) => setFilterCapacity(e.target.value)}>
            <option value="All">All</option>
            <option value="4">4</option>
            <option value="6">6</option>
            <option value="8">8</option>
            <option value="10">10</option>
            {/* Add more options as needed */}
          </select>
        </label>
        <label style={{ marginLeft: "20px" }}>
          Sort by:{" "}
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="name">Name</option>
            <option value="capacity">Capacity</option>
            <option value="waitTime">Wait Time</option>
          </select>
        </label>
      </div>

      <div className="table-list">
        {sortedTables.map((table) => (
            <div key={table.id} className="table-item">
  <span>
    {table.name} - Capacity: {table.capacity} - Status: {table.status}
    {(table.status === "Occupied" || table.status === "Claimed") && (
      <span>
        {" - "}
        {table.customWaitMessage ? table.customWaitMessage : getEstimatedWait(table)}
      </span>
    )}
  </span>
  {table.status === "Available" && (
    <button onClick={() => claimTable(table)}>Claim Table</button>
  )}
  {table.status === "Claimed" && (
    <span style={{ marginLeft: '10px' }}>Claimed</span>
  )}
</div>

        ))}
      </div>
    </div>
  );
};

export default CustomerView;
