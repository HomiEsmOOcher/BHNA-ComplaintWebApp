import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch users from API
  const fetchUsers = async (mobile = null) => {
    setLoading(true);
    setError('');
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const data = mobile ? { mobileNumber: mobile } : {};
      
      const response = await axios.post(
        'https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/getAllUsersWithRoles',
        data,
        config
      );

      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        setError(response.data.message || 'No users found');
        setUsers([]);
      }
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(mobileNumber);
  };

  // Reset search
  const handleReset = () => {
    setMobileNumber('');
    fetchUsers();
  };

  // Handle edit button click
  const handleEdit = (mobileNumber) => {
    try {
      navigate('/SurveyData', {
        state: { mobileNumber: mobileNumber }
      });
    } catch (err) {
      setError('Navigation failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="users-list-container">
      <h1>Users Management</h1>

      {/* Search Section */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="search-input"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button 
            type="button" 
            className="reset-button"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </button>
        </form>
      </div>

      {/* Status Messages */}
      {loading && <div className="loading">Loading users...</div>}
      {error && <div className="error">{error}</div>}

      {/* Users Table */}
      {!loading && users.length > 0 && (
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Mobile Number</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Admin</th>
                <th>Active</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userID}>
                  <td>{user.username}</td>
                  <td>{user.mobileNumber}</td>
                  <td>{user.emailID}</td>
                  <td>{user.roles.join(', ') || 'No roles'}</td>
                  <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                  <td>{user.isActive ? 'Yes' : 'No'}</td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(user.mobileNumber)}
                      disabled={loading}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && users.length === 0 && !error && (
        <div className="no-results">No users found</div>
      )}
    </div>
  );
};

export default UsersList;