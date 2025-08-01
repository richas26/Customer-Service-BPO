import React, { useState } from 'react';
import { motion } from 'framer-motion';  // Import Framer Motion for animations
import '../styles/TaskSchedular.css';   // Import the external CSS file

const TaskSchedular = () => {
  const [eventData, setEventData] = useState({
    summary: '',
    description: '',
    start: '',
    end: '',
    attendees: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const generateCalendarLink = () => {
    try {
      const startDateTime = new Date(eventData.start).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const endDateTime = new Date(eventData.end).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const attendeesEmails = eventData.attendees
        .split(',')
        .map((email) => `mailto:${email.trim()}`)
        .join(',');

      const googleCalendarURL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        eventData.summary
      )}&details=${encodeURIComponent(eventData.description)}&dates=${startDateTime}/${endDateTime}&add=${attendeesEmails}`;

      return googleCalendarURL;
    } catch (error) {
      setErrorMessage('Invalid input. Please check your event details.');
      return null;
    }
  };

  const handleCreateEvent = () => {
    if (!eventData.summary || !eventData.start || !eventData.end) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    if (new Date(eventData.start) >= new Date(eventData.end)) {
      setErrorMessage('Start time must be before end time.');
      return;
    }

    const calendarLink = generateCalendarLink();
    if (calendarLink) {
      setErrorMessage('');
      window.open(calendarLink, '_blank');
    }
  };

  return (
    <div className="form-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-3xl font-extrabold mb-6 text-center">Schedule a Meeting</h3>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <motion.input
          type="text"
          placeholder="Event Summary"
          className="form-field"
          value={eventData.summary}
          onChange={(e) => setEventData({ ...eventData, summary: e.target.value })}
        />

        <motion.textarea
          placeholder="Description"
          className="form-field"
          value={eventData.description}
          onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
        />

        <motion.input
          type="datetime-local"
          className="form-field"
          value={eventData.start}
          onChange={(e) => setEventData({ ...eventData, start: e.target.value })}
        />

        <motion.input
          type="datetime-local"
          className="form-field"
          value={eventData.end}
          onChange={(e) => setEventData({ ...eventData, end: e.target.value })}
        />

        <motion.input
          type="text"
          placeholder="Attendees (comma-separated emails, optional)"
          className="form-field"
          value={eventData.attendees}
          onChange={(e) => setEventData({ ...eventData, attendees: e.target.value })}
        />

        <motion.button
          onClick={handleCreateEvent}
          className="submit-btn"
        >
          Create Event
        </motion.button>
      </motion.div>
    </div>
  );
};

export default TaskSchedular;
