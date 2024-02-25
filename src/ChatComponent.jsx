import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

const ChatComponent = () => {
  const [connection, setConnection] = useState(null);
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7282/ConnectionHub").build();
    setConnection(newConnection);
    console.log(newConnection)
    newConnection.on("ReceiveMessage", (receivedUser, receivedMessage) => {
        console.log('Message Received.',message);
      const li = document.createElement("li");
      document.getElementById("messagesList").appendChild(li);
      li.textContent = `${receivedUser} says ${receivedMessage}`;
    });

    newConnection.start().then(() => {
      document.getElementById("sendButton").disabled = false;
    }).catch((err) => {
      console.error(err.toString());
    });

    return () => {
      newConnection.stop();
    };
  }, []); // Empty dependency array to ensure it runs once on mount

  const sendMessage = (event) => {
    if (connection.state === 'Connected') {
    console.log('Message Sending..');
    connection.invoke("SendMessageToGroup", "PrivateGroup", user, message).catch((err) => {
      console.error(err.toString());
    });
    event.preventDefault();
  }
else {
    console.log(connection.state)
}
};

  const joinGroup = (event) => {
    event.preventDefault();
    if (connection.state === 'Connected') {
        const groupName = "PrivateGroup";
        connection.invoke("JoinGroup", groupName).catch((err) => {
            console.error(err.toString());
        });
    }
};

  return (
    <div>
      <ul id="messagesList"></ul>
      <input type="text" id="userInput" placeholder='Enter User Name' value={user} onChange={(e) => setUser(e.target.value)} />
      <input type="text" id="messageInput" placeholder='Message' value={message} onChange={(e) => setMessage(e.target.value)} />
      <button id="sendButton" onClick={sendMessage}>Send Message</button>
      <button id="btnPrivateGroup" onClick={joinGroup}>Join Private Group</button>
    </div>
  );
};

export default ChatComponent;
