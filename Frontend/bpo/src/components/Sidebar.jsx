// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Profile Icon import
import ProfileModal from './ProfileModal'; // Import ProfileModal

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [profile, setProfile] = useState({
    name: 'User Name',
    email: 'user@example.com',
    picture: null, // Profile picture state
  });
  const [isEditing, setIsEditing] = useState(false); // Editing mode state

  // Handle modal toggle (open/close)
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Handle profile change (name, email, and picture)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prevProfile) => ({
          ...prevProfile,
          picture: reader.result, // Set the uploaded image
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save the profile (e.g., API call can be added here)
  const handleSave = () => {
    console.log('Profile saved:', profile);
    setIsEditing(false); // Exit editing mode after saving
  };

  return (
    <div className="bg-dark text-white p-3" style={{ width: '250px', height: '100vh' , marginTop:'5vh' }}>
      {/* Profile Modal Trigger */}
      <ProfileModal
        profile={profile}
        isModalOpen={isModalOpen}
        handleChange={handleChange}
        handleModalToggle={handleModalToggle}
        handleSave={handleSave}
      />

      <div className="d-flex flex-column align-items-center mb-4">
        {/* Profile Icon or Image Above Name and Email */}
        <div
          className="profile-icon rounded-circle bg-info text-white d-flex justify-content-center align-items-center cursor-pointer mb-3 p-1"
          onClick={handleModalToggle}
          style={{ width: '90px', height: '90px' }}
        >
          {/* Display Image or Icon */}
          {profile.picture ? (
            <img
              src={profile.picture}
              alt="Profile"
              style={{ width: '100%', height: '100%', borderRadius: '50%' }}
            />
          ) : (
            <FaUserCircle size={40} />
          )}
        </div>

        {/* Profile Name and Email Below the Icon */}
        {isEditing ? (
          <div className="text-center">
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="form-control mb-2"
              placeholder="Enter your name"
            />
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="form-control mb-2"
              placeholder="Enter your email"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="form-control mb-2"
            />
            <button onClick={handleSave} className="btn btn-primary mt-2">
              Save Profile
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="font-weight-bold mb-0">{profile.name}</p>
            <p className="mb-0">{profile.email}</p>
          </div>
        )}
        
        {/* Toggle Edit Mode */}
        <button
          className="btn btn-secondary mt-3"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Navigation Links */}
      <nav>
        <ul className="list-unstyled ">
          <li>
            <a
              href="/task-scheduler"
              className="sidebar-link py-2 px-3 text-white d-block mb-2 rounded transition-all duration-300 ease-in-out hover:bg-primary"
              style={{ textDecoration: 'none' }}
            >
              Task Scheduler
            </a>
          </li>
          <li>
            <a
              href="/sentiment-analysis"
              className="sidebar-link py-2 px-3 text-white d-block mb-2 rounded transition-all duration-300 ease-in-out hover:bg-primary"
              style={{ textDecoration: 'none' }}
            >
              Sentiment Analysis
            </a>
          </li>
          <li>
            <a
              href="/data-entry"
              className="sidebar-link py-2 px-3 text-white d-block mb-2 rounded transition-all duration-300 ease-in-out hover:bg-primary"
              style={{ textDecoration: 'none' }}
            >
              Data Entry
            </a>
          </li>
          <li>
            <a
              href="/knowledge-base"
              className="sidebar-link py-2 px-3 text-white d-block mb-2 rounded transition-all duration-300 ease-in-out hover:bg-primary"
              style={{ textDecoration: 'none' }}
            >
              Knowledge Base
            </a>
          </li>
          <li>
            <a
              href="/automation"
              className="sidebar-link py-2 px-3 text-white d-block mb-2 rounded transition-all duration-300 ease-in-out hover:bg-primary"
              style={{ textDecoration: 'none' }}
            >
              Automation
            </a>
          </li>
          <li>
            <a
              href="/client-interaction"
              className="sidebar-link py-2 px-3 text-white d-block mb-2 rounded transition-all duration-300 ease-in-out hover:bg-primary"
              style={{ textDecoration: 'none' }}
            >
              Client Interaction
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
