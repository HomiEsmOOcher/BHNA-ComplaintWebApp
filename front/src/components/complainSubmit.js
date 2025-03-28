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

  const [loading, setLoading] = useState(false); // Added loading state
  const [error, setError] = useState(''); // Added error state for user feedback

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

    // Reset error state
    setError('');

    // Validate form data
    if (!formData.complaintType || !formData.description) {
      setError('Please fill in all required fields.');
      return;
    }

    // Optional: Validate file uploads if they are required
    // if (!formData.document || !formData.photo) {
    //   setError('Please upload both a document and a photo.');
    //   return;
    // }

    setLoading(true);

    try {
      console.log('Submit button clicked');
      console.log('Calling submitComplaint API...');

      const submitComplaint = {
        colony: authData.user.colony || '',
        complaintStatus: 'Open',
        complaintType: formData.complaintType,
        createdBy: authData.user.username || 'user',
        createdDate: new Date().toISOString(),
        description: formData.description,
        ipAddress: authData.user.ipAddress || '',
        isAdmin: authData.user.isAdmin || false,
        locality: authData.user.locality || '',
        localityID: authData.user.localityID || 1,
        location: formData.geoLocation,
        mobileNumber: formData.mobile,
        userID: formData.userId,
        zone: authData.user.zone || '',
        zoneID: authData.user.zoneID || 1,
      };

      console.log('Data being sent to API:', JSON.stringify(submitComplaint));

      const complaintResponse = await axios.post(
        'https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/complaints',
        submitComplaint,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Complaint API response:', complaintResponse.data);

      if (complaintResponse.data.success) {
        const complaintID = complaintResponse.data.complaintID;

        // Only proceed with file upload if files are selected
        if (formData.document || formData.photo) {
          const submitFiles = new FormData();
          if (formData.document) {
            submitFiles.append('attachmentDoc', formData.document);
          }
          if (formData.photo) {
            submitFiles.append('userImage', formData.photo);
          }
          submitFiles.append('userID', formData.userId);
          submitFiles.append('complaintID', complaintID);

          console.log('Calling submitFiles API...');

          const fileUploadResponse = await axios.post(
            'https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/submitFiles',
            submitFiles,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          console.log('Files API response:', fileUploadResponse.data);

          if (!fileUploadResponse.data.success) {
            setError('Failed to upload files: ' + (fileUploadResponse.data.message || 'Unknown error'));
            setLoading(false);
            return;
          }
        }

        // Show success message and navigate
        alert('Complaint Submitted Successfully');
        navigate('/Home', { state: { userId: formData.userId } });
      } else {
        setError('Failed to submit complaint: ' + (complaintResponse.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error during complaint submission:', error);
      if (error.response) {
        setError(`Error: ${error.response.data.message || 'Failed to submit complaint'}`);
      } else if (error.request) {
        setError('Error: No response from server. Please check your network connection.');
      } else {
        setError('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-box">
      <div className="submit-form">
        <h1>Submit Complaint</h1>
        {error && <div className="error-message">{error}</div>}
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
            ></textarea>
          </div>

          <div className="submit-group">
            <label>User ID</label>
            <input type="text" name="userId" placeholder="Enter User ID" value={formData.userId} onChange={handleChange} readOnly required />
          </div>

          <div className="submit-group">
            <label>Mobile Number</label>
            <input type="text" name="mobile" placeholder="Enter Mobile Number" value={formData.mobile} onChange={handleChange} readOnly required />
          </div>

          <div className="submit-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="Enter Email" value={formData.email} onChange={handleChange} readOnly required />
          </div>

          <div className="submit-group">
            <label>Location</label>
            <input type="text" name="Location" placeholder="Enter Location" value={formData.geoLocation} onChange={handleChange} readOnly required />
            <button type="button" className="refresh-btn">Refresh Location</button>
          </div>

          <div className="submit-group">
            <label>Upload Document</label>
            <input type="file" name="document" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
          </div>

          <div className="submit-group">
            <label>Upload Photo</label>
            <input type="file" name="photo" accept="image/*" onChange={handleFileChange} />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ComplainSubmit;