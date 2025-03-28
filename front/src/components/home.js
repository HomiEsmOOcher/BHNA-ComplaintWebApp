import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../App.css';

const Homepage = () => {
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);

  console.log('authData:', authData);

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="home-page">
      
      <div className="home-content">
        <h1>Home</h1>
        <h2>Welcome {authData?.user?.username}</h2>
      </div>

      <div className="home-buttons">
        <button className="home-btn" onClick={() => navigateTo('/locationPage')}>Complain</button>
        <button className="home-btn" onClick={() => navigateTo('/ComplainDetails')}>Complain Status</button> 
        <button className="home-btn" onClick={() => navigateTo('/ComplainSubmit')}>Complain Without Location</button>
        {authData?.user?.roles.includes('Admin') && (
          console.log('Admin')    
        )}
        <button className="home-btn" onClick={() => navigateTo('/UserSurveyDetails')}>User Details</button>
        <button className="home-btn" onClick={() => navigateTo('/payment')}>Payment</button>
        <button className="home-btn logout-btn" onClick={() => navigateTo('/')}>Logout</button>
      </div>
      <div className="home-image-background">
        <img src={`${process.env.PUBLIC_URL}/Images/BabralaBHNA.jpg`} alt="" />
      </div>
    </div>
  );
};

export default Homepage;