//import { COORDINATES_MAP, PLAYERS, STEP_LENGTH } from "./constants";
import { COORDINATES_MAP, PLAYERS, STEP_LENGTH } from "./constants.js";
const diceButtonElement = document.querySelector('#dice-btn');
const playerPiecesElements = {
    P1: document.querySelectorAll('[player-id="P1"].player-piece'),
    P2: document.querySelectorAll('[player-id="P2"].player-piece'),
}

export class UI {
    // constructor(playerPiecesElements){
    //     this.playerPiecesElements=playerPiecesElements;
    // }
    static listenDiceClick(callback) {
        diceButtonElement.addEventListener('click', callback);
    }
    static listenRestClick(callback) {
        diceButtonElement.querySelector('button#reset-btn').addEventListener('click', callback);
    }
    static listenPiecesClick(callback) {
        diceButtonElement.querySelector('.player-pieces').addEventListener('click', callback);
    }
    static setPiecePosition(player, piece, newPostition) {
        if (!playerPiecesElements[player] || playerPiecesElements[player][piece]) {
            console.error(`Player elelment of given player: ${player} and piece:${piece} not found`);
            return;
        }
        const [x, y] = COORDINATES_MAP[newPostition];
        const piecesElements = playerPiecesElements[player][piece];
        if (piecesElements === undefined) {
           //alert('Pieces Element Empty');
            return;
        }
        // else {
        //     alert('Pieces Element Loaded..:)');
        // }
        piecesElements.style.top = x * STEP_LENGTH + '%';
        piecesElements.style.left = y * STEP_LENGTH + '%';
    }
    static setTurn(index) {
        if (index < 0 || index >= PLAYERS.length) {
            console.error('index out of boud!');
            return;
        }
        const player = PLAYERS[index];
        if (document.querySelector['.active-player span'] === undefined) {
           // alert('Elements Not Loaded');
            return;
        }
        else {
            alert('Elements Loaded');
        }
        document.querySelector['.active-player span'].innerText = player;
        const activePlayerBase = document.querySelector['.player.base.highlight'].innerText = player;
        if (activePlayerBase) {
            activePlayerBase.classList.remove('highlight');
        }
        document.querySelector(`[player-id=${player}].player-base`).classList.add('highlight')
    }

    static enableDice() {
        if (diceButtonElement)
            diceButtonElement.removeAttribute('disable');
    }

    static disableDice() {
        if (diceButtonElement)
            diceButtonElement.setAttribute('disabled', '');
    }

    /** 
    *
    * @param{string} player
    * 
    * @param{string} pieces
    */
    static highlightPieces(player, pieces) {
        pieces.forEach(pieces => {
            const pieceElement = playerPiecesElements[player][pieces];
            if (pieceElement)
                pieceElement.classList.add('highlight');
        })
    } 
    static unHighlightPieces() {
        document.querySelectorAll('.player-piece.highlight').forEach(ele => {
            if (ele === null)
            return;
                ele.classList.remove('highlight');
        })
    };

    static setdicevalue(value) {
        if(document.querySelector('.dice-value') === null)
        return;
        document.querySelector('.dice-value').innerText = value;
    }
}

UI.setPiecePosition('P1', 0, 0);
UI.setTurn(0);
UI.setTurn(1);

UI.enableDice();
UI.disableDice();
UI.highlightPieces('P1', [0]);
UI.unHighlightPieces();
UI.setdicevalue(5);