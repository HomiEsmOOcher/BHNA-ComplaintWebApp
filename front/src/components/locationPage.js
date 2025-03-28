import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const LocationPage = () => {
  const [ipAddress, setIpAddress] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchIpAddress = async () => {
    try {
      console.log("Fetching IP address...");
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      console.log("IP address fetched:", data.ip);
      setIpAddress(data.ip);
    } catch (error) {
      console.error("Error fetching IP address:", error);
    }
  };

  const fetchLocation = () => {
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Location fetched:", position.coords);
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        console.error("Error fetching location:", error);
        setError(error.message);
      },
      { enableHighAccuracy: true, timeout: 50000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (!ipAddress) fetchIpAddress();
    if (!location) fetchLocation();
  }, [ipAddress, location]);

  const handleNavigate = () => {
    navigate("/complainSubmit");
  };

  return (
    <div className="location-box">
      <h1>Location Page</h1>
      {ipAddress && <p>IP Address: {ipAddress}</p>}
      {location ? (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <p>Accuracy: {location.accuracy} meters</p>
        </div>
      ) : (
        <p>Fetching location...</p>
      )}
      {error && (
        <div>
          <p style={{ color: "red" }}>Error: {error}</p>
          <button onClick={fetchLocation}>Retry</button>
        </div>
      )}
      <button id="refresh-btn" onClick={fetchLocation}>Refresh Location</button>
      <button onClick={handleNavigate}>Submit Location</button>
    </div>
  );
};

export default LocationPage;