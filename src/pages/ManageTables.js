// src/pages/ManageTables.js
import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Stack } from '@mui/material';
import { db } from '../firebase/firebaseConfig';
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';

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
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 4,
          p: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          boxShadow: 2,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Tables
        </Typography>

        <Box component="form" onSubmit={handleAddTable} sx={{ mb: 4 }}>
          <Stack spacing={2}>
            <TextField
              label="Table Name (e.g., Table 1)"
              variant="outlined"
              fullWidth
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              required
            />
            <TextField
              label="Capacity (e.g., 4)"
              variant="outlined"
              type="number"
              fullWidth
              value={tableCapacity}
              onChange={(e) => setTableCapacity(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" color="primary">
              Add Table
            </Button>
          </Stack>
        </Box>

        <Box>
          {tables.map((table) => (
            <Box
              key={table.id}
              sx={{
                mb: 2,
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                boxShadow: 1,
                backgroundColor: 'background.paper'
              }}
            >
              {editingId === table.id ? (
                <Stack spacing={2}>
                  <TextField
                    label="Table Name"
                    variant="outlined"
                    fullWidth
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <TextField
                    label="Capacity"
                    variant="outlined"
                    type="number"
                    fullWidth
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(e.target.value)}
                  />
                  <TextField
                    label="Custom Wait Message (optional)"
                    variant="outlined"
                    fullWidth
                    value={editCustomMessage}
                    onChange={(e) => setEditCustomMessage(e.target.value)}
                  />
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdateTable(table.id)}
                    >
                      Save
                    </Button>
                    <Button variant="outlined" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Stack spacing={1}>
                  <Typography variant="h6">
                    {table.name} - Capacity: {table.capacity} - Status: {table.status}
                  </Typography>
                  {table.customWaitMessage && (
                    <Typography variant="body2">
                      Custom Message: {table.customWaitMessage}
                    </Typography>
                  )}
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => startEditing(table)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteTable(table.id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default ManageTables;
