// src/populateTables.js
import { db } from './firebase/firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const populateTables = async () => {
  const tableCollectionRef = collection(db, 'tables');
  const snapshot = await getDocs(tableCollectionRef);

  // If the collection is not empty, exit early
  if (!snapshot.empty) {
    console.log("Tables already populated.");
    return;
  }

  const tableData = [
    { name: 'Table 1', status: 'Available' },
    { name: 'Table 2', status: 'Available' },
    { name: 'Table 3', status: 'Occupied' },
  ];

  for (const table of tableData) {
    try {
      await addDoc(tableCollectionRef, table);
      console.log(`Added ${table.name}`);
    } catch (error) {
      console.error("Error adding table: ", error);
    }
  }
};

export default populateTables;
