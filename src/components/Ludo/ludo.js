import { UI } from './UI';
import { BASE_POSITIONS, HOME_ENTRANCE, PLAYERS, STATE, TURNING_POINTS, HOME_POSITIONS, START_POSITIONS, SAFE_POSITIONS } from './constants';

export class Ludo {
    currentPosition = {
        P1: [],
        P2: []
    }
    _diceValue;
    get diceValue() {
        return this._diceValue;
    }
    set diceValue(value) {
        this._diceValue = value;
        UI.setdicevalue(value);
    }

    _turn;
    get turn() {
        return this._turn;
    }
    set turn(value) {
        this._turn = value;
    }

    _state;
    get state() {
        return this._state;
    }
    set state(value) {
        if (value === STATE.DICE_NOT_ROLLED) {
            UI.enableDice();
            UI.unHighlightPieces();
        }
        else {
            UI.disableDice();
        }
        this._state = value;
    }

    constructor() {
        console.log("Hello world! Let's play Game");
        // this.diceValue = 2;
        // this.turn = 0;
        UI.init();
        this.listenDiceClick();
        this.listenPiecesClick();
        this.listenRestClick();
        this.onRestClick();
        // this.setPiecePosition('P1', 0, HOME_ENTRANCE.P1[0]);
        // this.diceValue=6;
        // console.log(this.getEligiblePieces('P1'));
    }
    listenDiceClick() {
        UI.listenDiceClick(this.onDiceClick.bind(this));
    }
    onDiceClick() {
        this.diceValue=Math.floor(Math.random()*7)
        if(this.diceValue<=0)
        this.diceValue=1;
        this.state=STATE.DICE_ROLLED;
        this.checkForEligibility();
        console.log('dice click')
    }
    checkForEligibility(){
        const player=PLAYERS[this.turn];
        const eligiblePieces=this.getEligiblePieces(player);
        if(eligiblePieces.length){
            //highlight Pieaces
            UI.highlightPieces(player,eligiblePieces);
        }
        else{
            this.incrementTurn();
        }
    }
    incrementTurn(){
        this.turn=this.turn===0?1:0;
        this.state=STATE.DICE_NOT_ROLLED;
    }

    getEligiblePieces(plyer){
        return [0,1,2,3].filter(piece=>{
            const currentPosition=this.currentPositions[plyer][piece];
            if(currentPosition===HOME_POSITIONS[plyer]){
                return false;
            }
            if(BASE_POSITIONS[plyer].includes(currentPosition) && this.diceValue!==6)
            {
                return false;
            }
            if(HOME_ENTRANCE[plyer].includes(currentPosition) && this.diceValue > HOME_POSITIONS[plyer]-currentPosition){
                return false;
            }
            return true;
        });
    }
    listenRestClick() {
        UI.listenRestClick(this.onRestClick.bind(this));
    }
    onRestClick() {
        this.currentPositions = structuredClone(BASE_POSITIONS);
        PLAYERS.forEach((player) => {
            [0, 1, 2, 3].forEach(piece => {
                this.setPiecePosition(player, piece, this.currentPositions[player][piece]);
            })
        });
        this.turn=0;
        this.state=STATE.DICE_NOT_ROLLED;
    }
    listenPiecesClick() {
        UI.listenPiecesClick(this.onPieceClick.bind(this));
    }
    onPieceClick(event) {
        const target = event.target;
        if(!target.classList.contains('player-piece') || !target.classList.contains('highlight')) {
            return;
        }
        console.log('piece clicked')
        const player = target.getAttribute('player-id');
        const piece = target.getAttribute('piece');
        this.handlePieceClick(player, piece);
    }
    handlePieceClick(player, piece) {      
        const currentPossition=this.currentPositions[player][piece];
        if(BASE_POSITIONS[player].includes(currentPossition))  
        {
            this.setPiecePosition(player,piece,START_POSITIONS[player]);
            this.state=STATE.DICE_NOT_ROLLED;
            return;
        }
        UI.unHighlightPieces();
        this.movePiece(player, piece, this.diceValue);
    }
    setPiecePosition(player, piece, newPosistion) {
        this.currentPositions[player][piece] = newPosistion;
        UI.setPiecePosition(player, piece, newPosistion);
    }
    movePiece(player, piece, moveBy) {
        const interval = setInterval(() => {
            this.incrementPostion(player, piece);
            moveBy--;
            if(moveBy === 0) {
                clearInterval(interval);
                if(this.isplayerwon(player)){
                    alert(player+' Player Won');
                }
               const iskill= this.checkForkilluserPiece(player);
               if(iskill || this.diceValue===6)
               {
                this.state=STATE.DICE_NOT_ROLLED;
                return;
               }
                this.incrementTurn();
            }
        }, 200);
    }
    checkForkilluserPiece(player,piece){
        const  currentPosition=this.currentPositions[player][piece];
        const opponent = player === 'P1' ? 'P2' : 'P1';

        let kill = false;

        [0, 1, 2, 3].forEach(pieceOp => {
            const opponentPosition = this.currentPositions[opponent][pieceOp];
            if(currentPosition === opponentPosition && !SAFE_POSITIONS.includes(currentPosition)) {
                this.setPiecePosition(opponent, pieceOp, BASE_POSITIONS[opponent][pieceOp]);
                kill = true
            }
        });

        return kill
    }
    isplayerwon(player){
        return [0,1,2,3].every(piece=>this.currentPositions[player][piece]===HOME_POSITIONS[player])
    }
    incrementPostion(player, piece) {
        let newPostition = this.getNewPiecePosition(player, piece)
        this.setPiecePosition(player, piece, newPostition);
    }
    getNewPiecePosition(player, piece) {
        const currentPosition = this.currentPositions[player][piece];
        if (currentPosition === TURNING_POINTS[player]) {
            return HOME_ENTRANCE[player][0];
        }
        else if (currentPosition === 51) {
            return 0;
        }
        else {
            return currentPosition + 1;
        }
    }
}