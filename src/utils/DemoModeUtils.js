// src/utils/DemoModeUtils.js
export const isDemoMode = () => {
    return (
      window.location.search.includes("demo=true") ||
      localStorage.getItem("demoMode") === "true"
    );
  };
  
  export const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  
  export const checkIfOnSite = (userLat, userLon, siteLat, siteLon, threshold = 2) => {
    if (isDemoMode()) {
      console.log("Demo mode active - bypassing geolocation check.");
      return true;
    }
    const distance = haversineDistance(userLat, userLon, siteLat, siteLon);
    console.log(`Calculated distance: ${distance.toFixed(2)} km`);
    return distance <= threshold;
  };
  