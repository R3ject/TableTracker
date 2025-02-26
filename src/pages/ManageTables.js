// src/pages/ManageTables.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ManageTables = () => {
  const [tables, setTables] = useState([]);
  const [tableName, setTableName] = useState('');
  const [tableCapacity, setTableCapacity] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCapacity, setEditCapacity] = useState('');
  const [editCustomMessage, setEditCustomMessage] = useState('');


  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'tables'),
      (snapshot) => {
        const tableData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setTables(tableData);
      },
      (error) => {
        toast.error('Error fetching tables');
        console.error(error);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleAddTable = async (e) => {
    e.preventDefault();
    if (!tableName || !tableCapacity) {
      toast.error('Please provide both table name and capacity');
      return;
    }
    try {
      await addDoc(collection(db, 'tables'), {
        name: tableName,
        capacity: parseInt(tableCapacity, 10),
        status: 'Available'
      });
      toast.success('Table added successfully!');
      setTableName('');
      setTableCapacity('');
    } catch (error) {
      toast.error('Error adding table');
      console.error(error);
    }
  };

  const handleDeleteTable = async (id) => {
    try {
      await deleteDoc(doc(db, 'tables', id));
      toast.success('Table deleted successfully!');
    } catch (error) {
      toast.error('Error deleting table');
      console.error(error);
    }
  };

  const startEditing = (table) => {
    setEditingId(table.id);
    setEditName(table.name);
    setEditCapacity(table.capacity);
    setEditCustomMessage(table.customWaitMessage || '');
  };
  

const handleUpdateTable = async (id) => {
  const updatedData = {
    name: editName,
    capacity: parseInt(editCapacity, 10),
    customWaitMessage: editCustomMessage,
  };
  console.log("Updating table with data:", updatedData);
  try {
    await updateDoc(doc(db, 'tables', id), updatedData);
    toast.success('Table updated successfully!');
    setEditingId(null);
    setEditName('');
    setEditCapacity('');
    setEditCustomMessage('');
  } catch (error) {
    toast.error('Error updating table');
    console.error("Update error:", error);
  }
};



  return (
    <div className="manage-tables">
      {/* Back to Dashboard Link */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <button>Back to Dashboard</button>
      </Link>

      <h2>Manage Tables</h2>
      <form onSubmit={handleAddTable}>
        <input
          type="text"
          placeholder="Table Name (e.g., Table 1)"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Capacity (e.g., 4)"
          value={tableCapacity}
          onChange={(e) => setTableCapacity(e.target.value)}
          required
        />
        <button type="submit">Add Table</button>
      </form>

      <div className="table-list">
        {tables.map((table) => (
          <div key={table.id} className="table-item">
            {editingId === table.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <input
                  type="number"
                  value={editCapacity}
                  onChange={(e) => setEditCapacity(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Custom wait message (optional)"
                  value={editCustomMessage}
                  onChange={(e) => setEditCustomMessage(e.target.value)}
                />
                <button onClick={() => handleUpdateTable(table.id)}>
                  Save
                </button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              // Display mode UI for the table
              <>
                <span>
                  {table.name} - Capacity: {table.capacity} - Status: {table.status}
                  {table.customWaitMessage && (
                    <span> - {table.customWaitMessage}</span>
                  )}
                </span>
                <button onClick={() => startEditing(table)}>Edit</button>
                <button onClick={() => handleDeleteTable(table.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageTables;
