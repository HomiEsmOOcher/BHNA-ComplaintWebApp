import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/login';
import Homepage from './components/home';
import ComplainSubmit from './components/complainSubmit';
import ComplainDetails from './components/complainDetails';
import ComplainDetailsPage from './components/complainDetailspage';
import LocationPage from './components/locationPage';
import Payment from './components/payment';
import UsersList from './components/userSurveyDetails';
import SurveyData from './components/surveyData';



const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<Homepage />} />
          <Route path="/ComplainSubmit" element={<ComplainSubmit />} />
          <Route path="/ComplainDetails" element={<ComplainDetails />} />
          <Route path="/ComplainDetailsPage" element={<ComplainDetailsPage />} />
          <Route path="/locationPage" element={<LocationPage />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/UserSurveyDetails" element={<UsersList />} />
          <Route path="/SurveyData" element={<SurveyData />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;