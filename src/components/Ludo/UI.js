// UI.js
import { COORDINATES_MAP, PLAYERS, STEP_LENGTH } from "./constants.js";
let diceButtonElement = document.querySelector('#dice-btn');
let resetButtonElement = document.querySelector('#reset-btn');
let playerPiecesElements = {
    P1: document.querySelectorAll('[player-id="P1"].player-piece'),
    P2: document.querySelectorAll('[player-id="P2"].player-piece')
};

export class UI {
    static init() {
        // document.addEventListener('DOMContentLoaded', () => {
        diceButtonElement = document.querySelector('#dice-btn');
        resetButtonElement = document.querySelector('#reset-btn');
        playerPiecesElements = {
            P1: document.querySelectorAll('[player-id="P1"].player-piece'),
            P2: document.querySelectorAll('[player-id="P2"].player-piece'),
        };

        //UI.setPiecePosition('P1', 0, 0);
        // UI.setTurn(0);
        // UI.setTurn(1);

        // UI.enableDice();
        // UI.disableDice();
        // UI.highlightPieces('P1', [0,1,2,3]);
        // UI.unHighlightPieces();
        // UI.setdicevalue(5);
        // });
    }

    static listenDiceClick(callback) {
        diceButtonElement.addEventListener('click', callback);
    }
    static listenRestClick(callback) {
        if (document.querySelector('button#reset-btn')) {           
            document.querySelector('button#reset-btn').addEventListener('click', callback);
        }
    }
    static listenPiecesClick(callback) {
        if (document.querySelector('.player-pieces'))
            document.querySelector('.player-pieces').addEventListener('click', callback);
        console.log('pieces click bind',callback);
    }
    static setPiecePosition(player, piece, newPostition) {
        if (!playerPiecesElements[player] || !playerPiecesElements[player][piece]) {
            console.error(`Player elelment of given player: ${player} and piece:${piece} not found`);
            return;
        }
        console.log(newPostition,COORDINATES_MAP[newPostition]);
        const [x, y] = COORDINATES_MAP[newPostition];
        const piecesElements = playerPiecesElements[player][piece];
        piecesElements.style.top = y * STEP_LENGTH + '%';
        piecesElements.style.left = x * STEP_LENGTH + '%';      
    }
    static setTurn(index) {
        if (index < 0 || index >= PLAYERS.length) {
            console.error('index out of boud!');
            return;
        }
        const player = PLAYERS[index];
        document.querySelector('.active-player span').innerText = player;
        const activePlayerBase = document.querySelector('.player-base.highlight');
        if (activePlayerBase) {
            activePlayerBase.classList.remove('highlight');
        }
        document.querySelector(`[player-id=${player}].player-base`).classList.add('highlight')
    }

    static enableDice() {
        diceButtonElement.removeAttribute('disabled');
    }

    static disableDice() {
        diceButtonElement.setAttribute('disabled', '');
    }
    static highlightPieces(player, pieces) {
        pieces.forEach(piece => {
            const pieceElement = playerPiecesElements[player][piece];
            pieceElement.classList.add('highlight');
        })
    }
    static unHighlightPieces() {
        document.querySelectorAll('.player-piece.highlight').forEach(ele => {
            ele.classList.remove('highlight');
        })
    };

    static setdicevalue(value) {
        document.querySelector('.dice-value').innerText = value;
    }
}
//UI.init();
