import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../contexts/AuthContext';
import '../App.css';

const ComplainDetails = () => {
  const { authData } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [startDate, setStartDate] = useState("2024-01-01T06:26:42.714Z");
  const [endDate, setEndDate] = useState("2025-03-18T06:26:42.714Z");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Open");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [mobileNumber, setMobileNumber] = useState(authData?.user?.mobileNumber || "");

  useEffect(() => {
    if (!authData?.user?.mobileNumber || !authData?.user?.username) {
      console.error("User data missing:", authData);
      return;
    }

    console.log("authData:", authData);
    console.log("authData.user.mobileNumber:", authData.user.mobileNumber);
    console.log("authData.user.username:", authData.user.username);

    const fetchComplaints = async () => {
      try {
        const requestBody = {
          startDate,
          endDate,
          mobileNumber: authData.user.isAdmin ? "" : authData.user.mobileNumber,
          createdBy: authData.user.username,
          isAdmin: authData.user.isAdmin,
          complaintType: selectedType,
          complaintStatus: selectedStatus,
          zone: selectedZone,
          locality: selectedLocality,
        };

        console.log("Sending request with:", requestBody);

        const response = await fetch("https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/complain", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authData.token}`
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (Array.isArray(data)) {
          setComplaints(data);
          console.log("Complaints set:", data);
        } else {
          console.error("Unexpected API response format:", data);
          setComplaints([]);
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
        setComplaints([]);
      }
    };

    fetchComplaints();
  }, [startDate, endDate, selectedType, selectedStatus, selectedZone, selectedLocality, authData]);

  const filteredComplaints = complaints.filter((complaint) => {
    const complaintDate = new Date(complaint.CreatedDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return (
      complaintDate >= start &&
      complaintDate <= end &&
      (selectedType ? complaint.ComplaintsType === selectedType : true) &&
      (selectedStatus ? complaint.ComplaintsStatus === selectedStatus : true) &&
      (selectedZone ? complaint.zone === selectedZone : true) &&
      (selectedLocality ? complaint.locality === selectedLocality : true) &&
      (authData.user.isAdmin || mobileNumber ? complaint.MobileNo.includes(mobileNumber) : true)
    );
  });

  console.log("Filtered Complaints:", filteredComplaints);

  return (
    <div className="complaints-list">
      <h2>Complaint Details</h2>

      <div className="row">
        <div>
          <label className="text-label">Start Date:</label>
          <input type="date" value={startDate.split('T')[0]} onChange={(e) => setStartDate(e.target.value + "T06:26:42.714Z")} className="date-input" />
        </div>
        <div>
          <label className="text-label">End Date:</label>
          <input type="date" value={endDate.split('T')[0]} onChange={(e) => setEndDate(e.target.value + "T06:26:42.714Z")} className="date-input" />
        </div>
      </div>

      <div className="row">
        <div>
          <label className="text-label">Complaint Type:</label>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="select-box">
            <option value="">All</option>          
            <option value="electricity">Electricity</option>
            <option value="water">Water</option>
            <option value="road">Road</option>
            <option value="waste">Waste</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="text-label">Complaint Status:</label>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="select-box">
            <option value="">All</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="row">
        <div>
          <label className="text-label">Filter by Zone:</label>
          <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)} className="select-box">
            <option value="">All</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
          </select>
        </div>
        <div>
          <label className="text-label">Filter by Locality:</label>
          <select value={selectedLocality} onChange={(e) => setSelectedLocality(e.target.value)} className="select-box">
            <option value="">All</option>
            {Array.from({ length: 16 }, (_, i) => (
              <option key={i + 1} value={`Locality Ward ${i + 1}`}>{`Locality Ward ${i + 1}`}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-label">Filter by Mobile Number:</label>
        <input type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="text-input" />
      </div>

      <div>
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint) => (
            <div key={complaint.ComplaintID} className="complaint-card">
              <p><strong>Complaint ID:</strong> <a href={`/complainDetailspage`} className="text-blue-500">{complaint.ComplaintID}</a></p>
              <p><strong>Type:</strong> {complaint.ComplaintsType}</p>
              <p><strong>Status:</strong> {complaint.ComplaintsStatus}</p>
              <p><strong>Mobile No:</strong> {complaint.MobileNo}</p>
              <p><strong>Location:</strong> {complaint.Location}</p>
              <p><strong>Zone:</strong> {complaint.zone}</p>
              <p><strong>Locality:</strong> {complaint.locality}</p>
            </div>
          ))
        ) : (
          <p>No complaints found for the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default ComplainDetails;