import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { setAuthData } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username: formData.username,
      password: formData.password,
    };

    try {
      const response = await axios.post('https://babralaapi-d3fpaphrckejgdd5.centralindia-01.azurewebsites.net/auth/loginC', data);

      if (response.data.success) {
        setAuthData(response.data);
        console.log('API Response:', response.data);
        navigate('/Home');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Login failed, please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="login-message">
            <p>Password: First 4 digits of Mobile No + <br /> Last 4 digits of Aadhaar No</p>
          </div>
          <div className="login-form">
            <input
              type="text"
              className="login-input"
              id="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              type="password"
              className="login-input"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <button type="submit" className="login-btn">Login</button>
          </div>
          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;