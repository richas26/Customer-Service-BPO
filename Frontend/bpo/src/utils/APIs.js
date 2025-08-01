// src/utils/APIs.js

import { google } from 'googleapis';

// For Google Calendar API
export const GoogleCalendarAPI = google.calendar('v3');

// For Gmail API (you can implement similar methods for Gmail API)
export const GmailAPI = google.gmail('v1');

// Configure OAuth2 credentials
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Authenticate and get events from the Google Calendar API
export const getEvents = async () => {
  try {
    const res = await GoogleCalendarAPI.events.list({
      auth: oauth2Client,
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return res.data.items;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
};

// Create a new event in Google Calendar
export const createEvent = async (event) => {
  try {
    const res = await GoogleCalendarAPI.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      resource: event,
    });
    return res.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};
