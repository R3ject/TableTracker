// src/components/TableList.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import TableItem from './TableItem';

const TableList = () => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tables"), (snapshot) => {
      const tableData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTables(tableData);
    }, error => {
      toast.error("Failed to fetch table data.");
    });
    return () => unsubscribe();
  }, []);

  const toggleStatus = async (table) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const onSite = checkIfOnSite(latitude, longitude);
        if (!onSite) {
          toast.error("You must be on-site to update table status.");
          return;
        }
        await updateTableStatus(table);
      }, () => {
        toast.error("Unable to verify your location.");
      });
    } else {
      await updateTableStatus(table);
    }
  };

  const updateTableStatus = async (table) => {
    try {
      const newStatus = table.status === 'Available' ? 'Occupied' : 'Available';
      await updateDoc(doc(db, "tables", table.id), { status: newStatus });
      toast.success(`Table ${table.name} is now ${newStatus}`);
    } catch (error) {
      toast.error("Error updating table status.");
    }
  };

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
  
  const checkIfOnSite = (lat, lon) => {
    const brewpubLat = 32.3487522;  // Replace with your brewpub's latitude
    const brewpubLon = -95.3008154; // Replace with your brewpub's longitude
    const distance = haversineDistance(lat, lon, brewpubLat, brewpubLon);
    const allowedDistance = 2; // Allow within 1 km
    return distance <= allowedDistance;
  };
  
  return (
    <div className="table-list">
      {tables.map(table => (
        <TableItem key={table.id} table={table} onToggle={toggleStatus} />
      ))}
    </div>
  );
};

export default TableList;
