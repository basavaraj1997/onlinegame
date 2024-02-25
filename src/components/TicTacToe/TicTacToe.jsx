// src/App.js

import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import './TicTacToe.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
const TicTacToe = () => {
  const [connection, setConnection] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [group, setGroup] = useState('');
  const [opponentName, setOpponentName] = useState('');
  const [currentPlayerSymbol, setCurrentPlayerSymbol] = useState(Math.random() % 2 === 0 ? 'X' : 'O');
  const [gameOver, setGameOver] = useState(false);
  const [boardState, setBoardState] = useState(Array(9).fill(''));
  const [message, setMessage] = useState('Wating.. For First move');
  const [availableGroups, setAvailableGroups] = useState([]);
  const [joinedGroup, setjoinedGroup] = useState("");
  const [isYourTurn, setIsYourTurn] = useState(true);
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7282/tictactoehub")
      .build();

    setConnection(newConnection);

    newConnection.start()
      .then((res) => {
        console.log('Connection established');
        console.log(res);
        newConnection.invoke("GetAvailableGroups");
      }).catch((err) => {
        console.error(err);
      });

    return () => {
      newConnection.stop()
        .then(() => console.log('Connection stopped'))
        .catch((err) => console.error(err));
    };
  }, []);

  useEffect(() => {
    if (!connection) return;

    connection.on("ReceiveMove", (index) => {
      if (boardState[index] === '') {
        const newBoardState = [...boardState];
        newBoardState[index] = currentPlayerSymbol;
        setBoardState(newBoardState);
        updateMessage(newBoardState);
        //setCurrentPlayerSymbol(currentPlayerSymbol=>{return currentPlayerSymbol === 'X' ? 'O' : 'X'});
        setIsYourTurn(val => { return !val });
      }
    });

    connection.on("GroupJoined", (newUserName, groupNm) => {
      console.log('Opponent Name',newUserName);
      setjoinedGroup(crgrpnm => {
        if (crgrpnm === groupNm) {
          let playerNm2 = getGroupName(groupNm);
          let mySymbol = getMySybmol(groupNm);
          if (playerNm2 !== newUserName && groupNm === crgrpnm) {
            setOpponentName(prevMessage => {
              return newUserName;
            });
            setCurrentPlayerSymbol(ss => { return mySymbol })
            setIsYourTurn(val => { return Math.random() % 2 === 0 ? true : false });
          }
        }
      });
    });

    connection.on("AvailableGroupsUpdated", (groups) => {
      let updateGroup = groups && groups.filter(group_1 => group_1 !== group).filter(grp => grp !== joinedGroup);
      setAvailableGroups(updateGroup || []);
    });
    connection.on("GameReset", (yourGroup,isyourTurn) => {
      if (yourGroup === group) {
        setBoardState(aa => { return Array(9).fill('') });
        setGameOver(vakl => { return false });
        setMessage(msg => { return 'Waiting.. For First Move' });
        setIsYourTurn(yourturn=>{return isyourTurn})
      }
    });
    return () => {
      connection.off("ReceiveMove");
      connection.off("GroupJoined");
      connection.off("AvailableGroupsUpdated");
      connection.off("GameReset");
    };
  }, [connection, boardState, currentPlayerSymbol]);

  const generateRandomString = (playerName1) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    return btoa(currentPlayerSymbol + "~" + playerName1 + "|" + randomString + "~" + (currentPlayerSymbol === 'X' ? 'O' : 'X'));
  };
  const handleReset = () => {
    setBoardState(Array(9).fill(''));
    setGameOver(false);
    //setWinner('');
    setIsYourTurn(!isYourTurn);
    setMessage('');
    connection.invoke("ResetGame", (group,!isYourTurn))
      .catch((err) => console.error(err));
  };
  const getGroupName = (group_list_Name, index) => {
    if (group_list_Name === "" || group_list_Name === undefined) {
      return;
    }
    const decodedString = atob(group_list_Name)
    let playerName2 = index;
    try {
      const parts = decodedString.split("~");
      playerName2 = parts[1].split("|")[0];
    } catch { }
    return playerName2;
  }
  const getMySybmol = (group_list_Name, index) => {
    if (group_list_Name === "" || group_list_Name === undefined) {
      return;
    }
    const decodedString = atob(group_list_Name)
    let symbol = currentPlayerSymbol;
    try {
      const parts = decodedString.split("~");
      symbol = parts[0] === "X" ? "O" : "X";
    } catch { }
    return symbol;
  }

  const handleCellClick = (index) => {
    if (gameOver || boardState[index] !== '') return;

    if (!playerName) {
      alert('Enter Your Nick Name');
      return;
    }
    if (!opponentName) {
      alert('Opponent Not Joined');
      return;
    }

    const newBoardState = [...boardState];
    newBoardState[index] = (currentPlayerSymbol === 'X' ? 'O' : 'X');

    setBoardState(newBoardState);
    updateMessage(newBoardState);

    connection.invoke("MakeMove", index, group)
      .catch((err) => console.error(err));

    //setCurrentPlayerSymbol(currentPlayerSymbol === 'X' ? 'O' : 'X');
    setCurrentPlayerSymbol(currentPlayerSymbol);
    setIsYourTurn(isYourTurn=>{return !isYourTurn})
  };

  const handleJoinGroup = (e, group_Name, isUserCreated) => {
    e.preventDefault();
    if (playerName.trim() !== '' && group_Name && group_Name.trim() !== '') {
      connection.invoke("JoinGroup", group_Name, playerName)
        .then(() => {
          setjoinedGroup(group_Name)
          setGroup(group_Name);
          if (!isUserCreated) {
            const opponent_name = getGroupName(group_Name);
            setOpponentName(opponent_name);
          }
        }).catch((err) => {
          console.error(err);
          alert('Not Joined Group Select Other Group');
        });
    }
    else {
      alert('Enter Your Name');
    }
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (playerName.trim() === '') {
      alert('Enter Your Nick Name');
      return;
    }
    if (group && group.trim() !== '') {
      connection.invoke("CreateGroup", group).then((res) => {
        handleJoinGroup(e, group, true);
        setjoinedGroup(group);
        console.log('Created And Joing Group', group);
      }).catch((err) => {
        console.error(err);
        alert(err);
      });
    }
  };
  const checkWinner = (newBoardState_1) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (newBoardState_1[a] && newBoardState_1[a] === newBoardState_1[b] && newBoardState_1[a] === newBoardState_1[c]) {
        setGameOver(true);
        setMessage(`${newBoardState_1[a]} wins!`);
        return newBoardState_1[a];
      }
    }

    if (checkDraw()) {
      setGameOver(true);
      setMessage('It\'s a draw!');
    }

    return null;
  };

  const checkDraw = () => {
    return !boardState.includes('');
  };

  const updateMessage = (newBoardState1) => {
    const winner = checkWinner(newBoardState1);
    if (winner) {      
      setMessage(msg => { return `${winner === currentPlayerSymbol ? playerName : opponentName} wins!` });
    } else if (!newBoardState1.includes('')) {
      setMessage('It\'s a draw!');
      setGameOver(true);
    } else {
      setMessage(msg => {return `${opponentName}'s turn`});    
    }
  };

  const renderBoard = () => {
    return (
      <div id="board">
        {boardState.map((value, index) => (
          <div key={index} className="cell" onClick={() => handleCellClick(index)}>
            {value}
          </div>
        ))}
      </div>
    );
  };
  function haddleUserEnterName(e) {
    setPlayerName((e.target.value));
    if (e.target.value.toString().length >= 5) {
      e.target.enable = false;
      let newGroupName = generateRandomString(e.target.value);
      setGroup(newGroupName);
      console.log('Group Name', newGroupName);
      return;
    }
  }
  const Modal = ({ onClose }) => {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal">
          <div className="modal-content">
            <p>{message}</p>
            {gameOver && <button onClick={handleReset}>
              <FontAwesomeIcon icon={faUndo} /> Reset Game
            </button>}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div>

      </div>
      <br />
      <div style={{ display: "flex", border: "1px solid black" }}>
        <div style={{ width: "50%", border: "1px solid black" }}>
          <br />
          <input type="text" placeholder='Enter Your nick Name'
            //readOnly={isFormVisible}
            style={
              {
                borderRadius: "5px",
                height: "25px",
                padding: "5px",
                width: "inherit",
                left: "0",
                fontSize: "15px"
              }
            } value={playerName} maxLength={5} onChange={(e) => haddleUserEnterName(e)} />
          <br /><br />
          {renderBoard()}
        </div>

        <div style={{ width: "40%", float: "right", overflow: "auto", position: "absolute", Top: "10px", right: "100px" }}>
          {playerName.toString().length >= 5 ?
            <div>
              <br />
              <div>
                <h3>Your Opponent Name</h3>
                <h2 style={{ backgroundColor: "lightgray" }}> {opponentName}</h2>
              </div>
              <hr />
              <h5>Create Your Group Or Join Group</h5>
              <div>
                <br />
                <br />
                <div style={{
                  display: 'inline',
                  margin: "10px 5px 0px 5px"
                }}>
                  <button type="button" onClick={handleCreateGroup}>Create Group</button>
                  <span style={{ margin: '0 10px' }}></span>
                  <button type="button" onClick={handleCreateGroup}>Share Link</button>
                </div>
              </div>
              <hr></hr>
              <h3>Available Groups</h3>
              <ul>
                {availableGroups.map((groupName, index) => (
                  <li key={groupName}>
                    <button onClick={(e) => handleJoinGroup(e, groupName, false)}> Join {getGroupName(groupName, index)}</button>
                  </li>
                ))}
              </ul>
            </div> :
            <div>
              <span style={
                {
                  fontSize: "15px",
                  wordWrap: "initial"
                }
              }>Enter Your Name And Create New Group Or Join Group</span>
            </div>
          }
        </div>
      </div>
      {(gameOver || !isYourTurn) && Modal(gameOver)}
    </div>
  );
};

export default TicTacToe;
