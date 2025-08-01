// src/components/ProfileModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap'; // Bootstrap Modal and Button

const ProfileModal = ({ profile, isModalOpen, handleChange, handleModalToggle, handleSave }) => {
  return (
    <Modal show={isModalOpen} onHide={handleModalToggle} animation={true} className="fade">
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={profile.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={profile.email}
              onChange={handleChange}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalToggle}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProfileModal;
