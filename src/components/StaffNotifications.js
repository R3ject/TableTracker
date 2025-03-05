// src/components/StaffNotifications.js
import { useEffect, useRef } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../firebase/firebaseConfig";

const StaffNotifications = () => {
  const prevTablesRef = useRef({});
  const chime = useRef(null);
  const initialLoad = useRef(true);

  useEffect(() => {
    chime.current = new Audio(`${process.env.PUBLIC_URL}/chime.mp3`);
    chime.current.volume = 0.5;
    chime.current.load();

    const unsubscribe = onSnapshot(collection(db, "tables"), (snapshot) => {
      snapshot.docs.forEach((doc) => {
        const newData = doc.data();
        const prevData = prevTablesRef.current[doc.id];

        // Trigger chime if not on initial load and if status changed to "Claimed" or "Occupied"
        if (!initialLoad.current) {
          if (
            (newData.status === "Claimed" || newData.status === "Occupied") &&
            (!prevData || prevData.status !== newData.status)
          ) {
            toast.info(`Table ${newData.name} is now ${newData.status}. Please review.`);
            if (chime.current) {
              chime.current.play().catch((err) => console.error("Audio play error:", err));
            }
          }
        }
        prevTablesRef.current[doc.id] = newData;
      });
      if (initialLoad.current) {
        initialLoad.current = false;
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
};

export default StaffNotifications;
