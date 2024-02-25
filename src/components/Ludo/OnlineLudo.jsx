import React, { useEffect } from 'react';
import './style.css';
// import { UI } from './UI'; 
import { Ludo } from '../Ludo/ludo';

function OnlineLudo() {

  useEffect(() => {
    // UI.init();
    new Ludo();
    return () => {};
  }, []);
  return (
    <div className='ludo-container'>
      <div className="ludo">
        <div className="player-pieces">

          <div className="player-piece" player-id="P1" piece="0"></div>
          <div className="player-piece" player-id="P1" piece="1"></div>
          <div className="player-piece" player-id="P1" piece="2"></div>
          <div className="player-piece" player-id="P1" piece="3"></div>

          <div className="player-piece" player-id="P2" piece="0"></div>
          <div className="player-piece" player-id="P2" piece="1"></div>
          <div className="player-piece" player-id="P2" piece="2"></div>
          <div className="player-piece" player-id="P2" piece="3"></div>

        </div>
        <div className="player-bases">
          <div className="player-base" player-id="P1"></div>
          <div className="player-base" player-id="P2"></div>
        </div>
      </div>
      <div className="footer">
        <div className="row">
          <button id="dice-btn" className="btn btn-dice">Roll</button>
          <div className="dice-value"></div>
          <button id="reset-btn" className="btn btn-reset">Reset</button>
        </div>
        <h2 className="active-player">Active Player: <span></span></h2>
      </div>     
    </div>
  );
}

export default OnlineLudo;