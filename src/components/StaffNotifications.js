// src/components/StaffNotifications.js
import { useEffect, useRef } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../firebase/firebaseConfig";

const StaffNotifications = () => {
  // Use a ref to store previous table data
  const prevTablesRef = useRef({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tables"), (snapshot) => {
      snapshot.docs.forEach((doc) => {
        const newData = doc.data();
        const prevData = prevTablesRef.current[doc.id];

        // If the new status is "Claimed" and the previous status existed and was not "Claimed"
        if (newData.status === "Claimed" && prevData && prevData.status !== "Claimed") {
          toast.info(`Table ${newData.name} was claimed. Please review.`);
        }

        // Update the stored data for this table
        prevTablesRef.current[doc.id] = newData;
      });
    });

    return () => unsubscribe();
  }, []);

  return null; // This component doesn't render anything visible
};

export default StaffNotifications;
