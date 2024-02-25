import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';

const ApiCallAndREceiveProcessStatus = () => {
  const [message, setMessage] = useState('');
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    // Establish connection to SignalR hub
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7282/ConnectionHub")
      .build();

    setConnection(newConnection);

    newConnection.start().then(() => {
      console.log("Connected to SignalR hub");
    }).catch(err => console.error(err));

    // Listen for messages from the SignalR hub
    newConnection.on('jack', (receivedMessage) => {
      console.log(`Received message from SignalR: ${receivedMessage}`);
      // Update state or perform other actions with the received message
    });

    return () => {
      // Cleanup: Close the SignalR connection when the component unmounts
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []); // Run only once on component mount

  const sendMessage = async () => {
    try {
      // Make API call
      const response = await fetch("https://localhost:7282/api/messages?message=" + encodeURIComponent(message), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>My React Component</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export default ApiCallAndREceiveProcessStatus;
