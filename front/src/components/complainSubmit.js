import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../App.css';

const ComplainSubmit = () => {
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    complaintType: '',
    description: '',
    userId: authData?.user?.userID || '',
    mobile: authData?.user?.mobileNumber || '',
    email: authData?.user?.emailID || '',
    geoLocation: authData?.user?.geoLocation || '',
    document: null,
    photo: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [complaintRegistrationNo, setComplaintRegistrationNo] = useState('');

  useEffect(() => {
    if (authData) {
      setFormData((prevData) => ({
        ...prevData,
        userId: authData.user.userID || '',
        mobile: authData.user.mobileNumber || '',
        email: authData.user.emailID || '',
        geoLocation: authData.user.geoLocation || '',
      }));
    }
  }, [authData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setComplaintRegistrationNo('');

    // Validation
    if (!formData.complaintType || !formData.description) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!authData?.user?.userID) {
      setError('User authentication is required.');
      return;
    }

    setLoading(true);

    try {
      // Safely convert locality to string and remove spaces
      const localityRaw = authData.user.locality ?? ''; // Use nullish coalescing
      const localityValue = String(localityRaw).replace(/\s+/g, '');
      
      if (!localityValue) {
        setError('Locality is required.');
        setLoading(false);
        return;
      }

      const submitComplaint = {
        colony: authData.user.colony || '',
        complaintStatus: 'Open',
        complaintType: formData.complaintType,
        createdBy: authData.user.username || 'Anonymous',
        createdDate: new Date().toISOString(),
        description: formData.description,
        ipAddress: authData.user.ipAddress || '0.0.0.0',
        isAdmin: authData.user.isAdmin ?? false,
        locality: localityValue,
        localityID: authData.user.localityID || 1,
        location: formData.geoLocation,
        mobileNumber: formData.mobile,
        userID: formData.userId,
        zone: authData.user.zone || '',
        zoneID: authData.user.zoneID || 1,
      };

      const complaintResponse = await axios.post(
        'https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/complaints',
        submitComplaint,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData?.token}`,
          },
        }
      );

      if (complaintResponse.data.success) {
        const { complaintID, complaintRegistrationNo } = complaintResponse.data;
        setComplaintRegistrationNo(complaintRegistrationNo);

        // Handle file uploads if present
        if (formData.document || formData.photo) {
          const submitFiles = new FormData();
          if (formData.document) submitFiles.append('attachmentDoc', formData.document);
          if (formData.photo) submitFiles.append('userImage', formData.photo);
          submitFiles.append('userID', formData.userId);
          submitFiles.append('complaintID', complaintID);

          const fileUploadResponse = await axios.post(
            'https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/submitFiles',
            submitFiles,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${authData?.token}`,
              },
            }
          );

          if (!fileUploadResponse.data.success) {
            setError('Complaint submitted but file upload failed: ' + 
              (fileUploadResponse.data.message || 'Unknown error'));
            setLoading(false);
            return;
          }
        }

        alert(`Complaint Submitted Successfully! Registration No: ${complaintRegistrationNo}`);
        navigate('/Home', { 
          state: { 
            userId: formData.userId,
            complaintRegistrationNo 
          } 
        });
      } else {
        setError('Failed to submit complaint: ' + 
          (complaintResponse.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Submission error:', error);
      setError(error.response?.data?.message || 
              error.request ? 'Network Error: No server response' : 
              error.message || 'Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-box">
      <div className="submit-form">
        <h1>Submit Complaint</h1>
        {error && <div className="error-message">{error}</div>}
        {complaintRegistrationNo && (
          <div className="success-message">
            Complaint Registration No: {complaintRegistrationNo}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="submit-group">
            <label>Complaint Type</label>
            <select name="complaintType" value={formData.complaintType} onChange={handleChange} required>
              <option value="">Select Complaint Type</option>
              <option value="water">Water</option>
              <option value="electricity">Electricity</option>
              <option value="road">Road</option>
              <option value="garbage">Garbage</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="submit-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Enter Description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="submit-group">
            <label>User ID</label>
            <input 
              type="text" 
              name="userId" 
              value={formData.userId} 
              onChange={handleChange} 
              readOnly 
              required 
            />
          </div>

          <div className="submit-group">
            <label>Mobile Number</label>
            <input 
              type="text" 
              name="mobile" 
              value={formData.mobile} 
              onChange={handleChange} 
              readOnly 
              required 
            />
          </div>

          <div className="submit-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              readOnly 
              required 
            />
          </div>

          <div className="submit-group">
            <label>Location</label>
            <input 
              type="text" 
              name="geoLocation" 
              value={formData.geoLocation} 
              onChange={handleChange} 
              readOnly 
              required 
            />
            <button type="button" className="refresh-btn">Refresh Location</button>
          </div>

          <div className="submit-group">
            <label>Upload Document</label>
            <input 
              type="file" 
              name="document" 
              accept=".pdf,.doc,.docx" 
              onChange={handleFileChange} 
            />
          </div>

          <div className="submit-group">
            <label>Upload Photo</label>
            <input 
              type="file" 
              name="photo" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ComplainSubmit;