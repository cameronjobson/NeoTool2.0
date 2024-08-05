import React, { useState } from 'react';
import axios from 'axios';

const BugReportForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('https://nicucalcbacklog-634ac3dd5ec3.herokuapp.com', {
        name,
        email,
        description,
      });

      alert('Bug report submitted successfully');
    } catch (error) {
      alert('Error submitting bug report');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default BugReportForm;
