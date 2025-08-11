import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('Click the button to fetch a message.');

  const fetchMessage = async () => {
    try {
      const response = await axios.get('/api/message');
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Failed to fetch message from backend.');
      console.error('Error fetching message:', error);
    }
  };

  return (
    <main className="container">
      <h1>Cloud-Native-Workflow-Orchestration Deployment Stage 2</h1>
      <p><strong>Message:</strong> {message}</p>
      <button onClick={fetchMessage}>Fetch from Server</button>
    </main>
  );
}

export default App;
