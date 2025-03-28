import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import { AuthContext } from '../contexts/AuthContext';

const maskAadhaarNumber = (aadhaarNumber) => {
  if (aadhaarNumber && aadhaarNumber.length === 12) {
    return '' + aadhaarNumber.slice(-4);
  }
  return 'N/A';
};

const SurveyData = () => {
  const { authData } = useContext(AuthContext);
  const [mobileNumber, setMobileNumber] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const handleSearch = useCallback(async (mobile = mobileNumber) => {
    if (!mobile) {
      alert('Please enter a mobile number.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/data', {
        MobileNumber: mobile,
      });

      if (response.data) {
        setData(response.data);
        console.log('Data:', response.data);
      } else {
        alert('No data found.');
      }
    } catch (error) {
      if (error.response && error.response.status === 204) {
        alert('No owner found.');
      } else {
        console.error('Error fetching data:', error);
        alert('An error occurred while fetching data.');
      }
    } finally {
      setLoading(false);
    }
  }, [mobileNumber]);

  useEffect(() => {
    const passedMobile = location.state?.mobileNumber;
    if (passedMobile && !mobileNumber) {
      setMobileNumber(passedMobile);
      handleSearch(passedMobile);
    }
  }, [location.state, mobileNumber, handleSearch]);

  const toggleActiveStatus = async () => {
    const newStatus = !data.owner.UserIsActive;
    try {
      const response = await axios.post('https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/updateUserStatus', {
        mobileNo: data.owner.MobileNumber,
        isActive: newStatus,
        modifiedBy: authData?.user?.username,
      });

      if (response.data.success) {
        setData((prevData) => ({
          ...prevData,
          owner: {
            ...prevData.owner,
            UserIsActive: newStatus,
            ModifiedBy: authData?.user?.username,
          },
        }));
      } else {
        alert('Failed to update status.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('An error occurred while updating status.');
    }
  };

  console.log('Data:', data);

  return (
    <div className="survey-data-container">
      <div className="survey-data-content">
        <h1>Find Owner Details</h1>
        <input
          className="survey-data-input"
          placeholder="Enter Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          type="text"
        />
        <button className="survey-data-button" onClick={() => handleSearch()} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>

        {data && (
          <div className="survey-data-displayContent">
            <h2>Owner Info</h2>
            <div className="survey-data-displayTable">
              <div className="survey-data-displayRow">
                <span className="survey-data-displayCellHeader">First Name</span>
                <span className="survey-data-displayCell">{data.owner.FirstName || 'N/A'}</span>
              </div>
              <div className="survey-data-displayRow">
                <span className="survey-data-displayCellHeader">Middle Name</span>
                <span className="survey-data-displayCell">{data.owner.MiddleName || 'N/A'}</span>
              </div>
              <div className="survey-data-displayRow">
                <span className="survey-data-displayCellHeader">Last Name</span>
                <span className="survey-data-displayCell">{data.owner.LastName || 'N/A'}</span>
              </div>
              <div className="survey-data-displayRow">
                <span className="survey-data-displayCellHeader">Father Name</span>
                <span className="survey-data-displayCell">{data.owner.FatherName || 'N/A'}</span>
              </div>
              <div className="survey-data-displayRow">
                <span className="survey-data-displayCellHeader">Mobile Number</span>
                <span className="survey-data-displayCell">{data.owner.MobileNumber || 'N/A'}</span>
              </div>
              <div className="survey-data-displayRow">
                <span className="survey-data-displayCellHeader">Occupation</span>
                <span className="survey-data-displayCell">{data.owner.Occupation || 'N/A'}</span>
              </div>
              <div className="survey-data-displayRow">
                <span className="survey-data-displayCellHeader">Age</span>
                <span className="survey-data-displayCell">{data.owner.Age || 'N/A'}</span>
              </div>
              <div className="survey-data-displayRow">
                <span className="survey-data-displayCellHeader">DOB</span>
                <span className="survey-data-displayCell">{data.owner.DOB || 'N/A'}</span>
              </div>
              <div className="survey-data-displayRow">
                <span className="survey-data-displayCellHeader">Gender</span>
                <span className="survey-data-displayCell">{data.owner.Gender || 'N/A'}</span>
              </div>
              <div className="survey-data-displayRow">
                <span className="survey-data-displayCellHeader">Income</span>
                <span className="survey-data-displayCell">{data.owner.Income || 'N/A'}</span>
              </div>
              <div className="survey-data-displayRow">
                <span className="survey-data-displayCellHeader">Religion</span>
                <span className="survey-data-displayCell">{data.owner.Religion || 'N/A'}</span>
              </div>
              <div className="survey-data-displayRow">
                <span className="survey-data-displayCellHeader">Category</span>
                <span className="survey-data-displayCell">{data.owner.Category || 'N/A'}</span>
              </div>
              <div className="survey-data-displayRow">
                <span className="survey-data-displayCellHeader">Email</span>
                <span className="survey-data-displayCell">{data.owner.Email || 'N/A'}</span>
              </div>
              <div className="survey-data-displayRow">
                <span className="survey-data-displayCellHeader">Pan Card Number</span>
                <span className="survey-data-displayCell">{data.owner.PanNumber || 'N/A'}</span>
              </div>
              <div className="survey-data-displayRow">
                <span className="survey-data-displayCellHeader">Adhar Card Number</span>
                <span className="survey-data-displayCell">{maskAadhaarNumber(data.owner.AdharNumber)}</span>
              </div>
              <div className="survey-data-displayRow">
                <span className="survey-data-displayCellHeader">Number Of Members</span>
                <span className="survey-data-displayCell">{data.owner.NumberOfMembers || 'N/A'}</span>
              </div>
              <div className="survey-data-displayRow">
                <span className="survey-data-displayCellHeader">Created By</span>
                <span className="survey-data-displayCell">{data.owner.CreatedBy || 'N/A'}</span>
              </div>
              <div className="survey-data-displayRow">
                <span className="survey-data-displayCellHeader">Modified By</span>
                <span className="survey-data-displayCell">{data.owner.UserModifiedBy || 'N/A'}</span>
              </div>
              <div className="survey-data-displayRow">
                <span className="survey-data-displayCellHeader">Active Status</span>
                <span className="survey-data-displayCell"> {data.owner.UserIsActive ? 'Active' : 'Inactive' || 'N/A'}</span>
              </div>
              <div className="survey-data-displayRow">
                <span className="survey-data-displayCellHeader">Edit Status</span>
                <button
                  className={`survey-data-statusButton ${data.owner.UserIsActive ? 'survey-data-active' : 'survey-data-inactive'}`}
                  onClick={toggleActiveStatus}
                >
                  {data.owner.UserIsActive ? 'Inactive' : 'active'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyData;