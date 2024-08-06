import React, { useState } from 'react';
import axios from 'axios';
import './errorForm.css';

const BugReportForm = ({ gestAgeTotalDays, birthWeight, dateOfBirth, show }) => {
  const [name, setName] = useState('');
  const [description2, setDescription2] = useState('');
  const [description, setDescription] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('https://nicucalcbacklog-634ac3dd5ec3.herokuapp.com/report-bug', {
        name,
        description2,
        description,
        gestAgeTotalDays,
        birthWeight,
        dateOfBirth
      });

      setAlertMessage('Report submitted successfully');
    } catch (error) {
      setAlertMessage('Error submitting report');
    }
  };

  return (
    <div className="BugReportForm">
      {alertMessage && (
        <div className={alertMessage.includes('Error') ? 'alert-error' : 'alert-success'}>
          {alertMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description2">Feedback / What should be displayed: *required</label>
          <textarea
            id="description2"
            value={description2}
            onChange={(e) => setDescription2(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">What is currently displayed incorrectly:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Submit Error</button>
        <div className="backlog-link">
        <a href="https://docs.google.com/spreadsheets/d/1YOJ4FMBPXmi17RvBc0hiKrlSwogHApuQV1rGrNiVlfA/edit?gid=0#gid=0" target="_blank" rel="noopener noreferrer">
          Link to our error backlog
        </a>
      </div>
      </form>
    </div>
  );
};

export default BugReportForm;
