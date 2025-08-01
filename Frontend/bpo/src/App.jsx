// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// Import your page components
import TaskScheduler from './pages/TaskScheduler';
import SentimentAnalysis from './pages/SentimentAnalysis';
import DataEntry from './pages/DataEntry';
import KnowledgeBase from './pages/KnowledgeBase';
import Automation from './pages/Automation';
import ClientInteraction from './pages/ClientInteraction';
import Home from './pages/Home';  // Add Home as the default route component
import Profile from './components/ProfileModal'; // Import Profile component

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: 'User Name',
    email: 'user@example.com',
  });

  // Handle change in profile inputs (name, email)
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Toggle modal visibility
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Handle save action (close modal after saving)
  const handleSave = () => {
    // Logic to save profile (e.g., send to a server)
    setIsModalOpen(false);
  };

  return (
    <div className="d-flex">
      <Sidebar onProfileClick={handleModalToggle} />
      
      <div className="flex-grow-1 p-4">
        {/* Profile Modal */}
        <Profile
          profile={profile}
          isModalOpen={isModalOpen}
          handleChange={handleChange}
          handleModalToggle={handleModalToggle}
          handleSave={handleSave}
        />
        
        <Routes>
          <Route path="/" element={<Home />} />  {/* Home Page for root path */}
          <Route path="/task-scheduler" element={<TaskScheduler />} />
          <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
          <Route path="/data-entry" element={<DataEntry />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/automation" element={<Automation />} />
          <Route path="/client-interaction" element={<ClientInteraction />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
