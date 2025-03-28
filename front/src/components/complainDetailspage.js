import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from '../contexts/AuthContext';
import '../App.css';

const ComplainDetailsPage = () => {
  const { id } = useParams();
  const { authData } = useContext(AuthContext);
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const response = await fetch(`https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/complain/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authData.token}`
          }
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (data) {
          setComplaint(data);
        } else {
          console.error("Unexpected API response format:", data);
          setComplaint(null);
        }
      } catch (error) {
        console.error("Error fetching complaint details:", error);
        setComplaint(null);
      }
    };

    fetchComplaintDetails();
  }, [id, authData]);

  if (!complaint) {
    return <div className="loading">Loading Complaint Details...</div>;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="complaint-details">
      <h2>Complaint Details</h2>

      <div className="details-info">
        <p><strong>User ID:</strong> {complaint.userId}</p>
        <p><strong>Complaint Type:</strong> {complaint.type}</p>
        <p><strong>Complaint Status:</strong> {complaint.status}</p>
        <p><strong>Mobile No:</strong> {complaint.mobile}</p>
        <p><strong>Description:</strong> {complaint.description}</p>
        <p><strong>Location:</strong> {complaint.location}</p>
        <p><strong>Created By:</strong> {complaint.createdBy}</p>
        <p><strong>Created Date:</strong> {formatDate(complaint.createdDate)}</p>
        
        <p><strong>Document:</strong> 
          <a href={complaint.document} target="_blank" rel="noopener noreferrer" className="doc-link">
            Download Document
          </a>
        </p>

        <p><strong>Photo:</strong></p>
        <img src={complaint.photo} alt="Complaint" className="photo" />
      </div>

      <div className="action-buttons">
        <button className="action-btn reply-btn">Reply</button>
        <button className="action-btn close-btn">Close Complaint</button>
        <button className="action-btn back-btn">Back</button>
      </div>
    </div>
  );
};

export default ComplainDetailsPage;