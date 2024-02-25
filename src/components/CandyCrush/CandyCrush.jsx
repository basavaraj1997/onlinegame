import React, { useEffect, useRef, useState } from "react";
import ScoreBoard from "./ScoreBoard";
import './CandyCrush.css';
import redCandy from './images/red-candy.png';
import yellowCandy from './images/yellow-candy.png';
import orangeCandy from './images/orange-candy.png';
import purpleCandy from './images/purple-candy.png';
import greenCandy from './images/green-candy.png';
import blueCandy from './images/blue-candy.png';
import blank from './images/blank.png';

import startSound from './sound/candy_crush_saga_rin.mp3';
import squareClick from './sound/candy-game-pickup_by_sonic-boom_preview.mp3';
import scoreSound from './sound/gaming-candy-jewel_by_sonic-boom_preview.mp3';

function CandyCrush() {
    const width = 8;
    const candyColors = [
        redCandy,
        yellowCandy,
        orangeCandy,
        purpleCandy,
        greenCandy,
        blueCandy
    ]
    const sounds = [
        startSound,
        squareClick,
        scoreSound
    ]
    const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
    const [squareBeginDragged, setSquareBeginDragged] = useState(null)
    const [squareBeginReplaced, setSquareBeginReplaced] = useState(null)
    const [scoreDisplay, setScoreDisplay] = useState(0);
    const [selectedBlockIndex, setSelectedBlockIndex] = useState(-1);
    const [squareBeginSelected, setSquareBeginSelected] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState(startSound);
    const audioRef = useRef(new Audio(sound));
    
    const createBoard = () => {
        const randomColorCollection = [];
        for (let i = 0; i < width * width; i++) {
            const randomNumber = Math.floor(Math.random() * candyColors.length);
            const randomColor = candyColors[randomNumber];
            randomColorCollection.push(randomColor);
        }
        setCurrentColorArrangement(randomColorCollection);
    }
    useEffect(() => {
        createBoard();
        setSound(startSound);
        setIsPlaying(!isPlaying);
        audioRef.current.play().catch((e) => {
            console.error('Failed to play audio',e);
        });
    }, [])

    const checkForColumnsOfFour = () => {
        for (let i = 0; i < - 39; i++) {
            const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
            const decidedColor = currentColorArrangement[i];
            const isBlank = currentColorArrangement[i] == blank;

            if (columnOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => score + 4)
                columnOfFour.forEach(square => currentColorArrangement[square] = blank);
                return true;
            }
        }
    }

    const checkForRowOfFour = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfFour = [i, i + 1, i + 2, i + 3];
            const decidedColor = currentColorArrangement[i];
            const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]
            if (notValid.includes(i))
                continue;
            const isBlank = currentColorArrangement[i] == blank;
            if (rowOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => score + 4)
                rowOfFour.forEach(square => currentColorArrangement[square] = blank);
                return true;
            }
        }
    }
    const checkForColumnsofTree = () => {
        for (let i = 0; i <= 47; i++) {
            const columnOfThree = [i, i + width, i + width * 2];
            const decidedColor = currentColorArrangement[i];
            const isBlank = currentColorArrangement[i] == blank;
            if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => score + 3)
                columnOfThree.forEach(square => currentColorArrangement[square] = blank);
                return true;
            }
        }
    }
    const checkForRowOfThree = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfThree = [i, i + 1, i + 2];
            const decidedColor = currentColorArrangement[i];
            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]
            if (notValid.includes(i))
                continue;
            if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor)) {
                setScoreDisplay((score) => score + 3)
                rowOfThree.forEach(square => currentColorArrangement[square] = blank);
                return true;
            }
        }
    }

    const moveIntoSquareBelo = () => {
        for (let i = 0; i < 64 - width; i++) {
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
            const isFirstRow = firstRow.includes(i)
            if (isFirstRow && currentColorArrangement[i] === blank) {
                let randomNumber = Math.floor(Math.random() * candyColors.length)
                currentColorArrangement[i] = candyColors[randomNumber]
            }
            if ((currentColorArrangement[i + width]) === blank) {
                currentColorArrangement[i + width] = currentColorArrangement[i]
                currentColorArrangement[i] = blank
            }
        }
    }
    const dragStart = (e) => {
        setSquareBeginDragged(e.target);
    }
    const dragDrop = (e) => {
        setSquareBeginReplaced(e.target);
    }
    const dragEnd = (e) => {
        const squareDraggedeId = parseInt(squareBeginDragged.getAttribute('data-id'));
        const squareReplaceId = parseInt(squareBeginReplaced.getAttribute('data-id'));
        currentColorArrangement[squareReplaceId] = squareBeginDragged.getAttribute('src')
        currentColorArrangement[squareDraggedeId] = squareBeginReplaced.getAttribute('src')

        const validMoves = [
            squareDraggedeId - 1,
            squareDraggedeId - width,
            squareReplaceId + 1,
            squareReplaceId + width
        ]
        const validMove = validMoves.includes(squareReplaceId);
        const isColumnsOfFour = checkForColumnsOfFour();
        const isForRowOfFour = checkForRowOfFour();
        const isForColumnsofTree = checkForColumnsofTree();
        const isForRowOfThree = checkForRowOfThree();
        if (validMove && (isForRowOfThree || isColumnsOfFour || isForRowOfFour || isForColumnsofTree)) {
            setSquareBeginReplaced(null);
            setSquareBeginDragged(null);
        }
        else {
            currentColorArrangement[squareReplaceId] = squareBeginDragged.getAttribute('src');
            currentColorArrangement[squareDraggedeId] = squareBeginReplaced.getAttribute('src');
            setCurrentColorArrangement([...currentColorArrangement]);
        }
    }

    const onBlockClick = (e, index) => {
        if (squareBeginSelected === null || selectedBlockIndex === index) {
            setSquareBeginSelected(e.target);
            setSelectedBlockIndex(index);           
        }
        else {
            const squareSelectedId = parseInt(squareBeginSelected.getAttribute('data-id'));
            const squareReplaceWithId = parseInt(e.target.getAttribute('data-id'));
            currentColorArrangement[squareReplaceWithId] = squareBeginSelected.getAttribute('src')
            currentColorArrangement[squareSelectedId] = e.target.getAttribute('src')
            const validMoves = [
                squareSelectedId - 1,
                squareSelectedId - width,
                squareReplaceWithId + 1,
                squareReplaceWithId + width
            ]
            const validMove = validMoves.includes(squareReplaceWithId);
            const isColumnsOfFour = checkForColumnsOfFour();
            const isForRowOfFour = checkForRowOfFour();
            const isForColumnsofTree = checkForColumnsofTree();
            const isForRowOfThree = checkForRowOfThree();
            if (validMove && (isForRowOfThree || isColumnsOfFour || isForRowOfFour || isForColumnsofTree)) {
                setSquareBeginSelected(null);
                setSelectedBlockIndex(-1);
            }
            else {
                currentColorArrangement[squareReplaceWithId] = squareBeginSelected.getAttribute('src');
                currentColorArrangement[squareSelectedId] = e.target.getAttribute('src');
                setCurrentColorArrangement([...currentColorArrangement]);
                setSquareBeginSelected(null);
                setSelectedBlockIndex(-1);
            }
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            checkForColumnsOfFour();
            checkForRowOfFour();
            checkForColumnsofTree();
            checkForRowOfThree();
            moveIntoSquareBelo();
            setCurrentColorArrangement([...currentColorArrangement]);
        }, 100)
        return () => clearInterval(timer);
    }, [checkForColumnsOfFour, checkForRowOfFour, checkForColumnsofTree, checkForRowOfThree, moveIntoSquareBelo, currentColorArrangement])
    console.log(currentColorArrangement);
    return (<>
        <audio ref={audioRef} src={sound} />
        <div style={{ width: "inherit", textAlign: "-webkit-center" }}><ScoreBoard score={scoreDisplay} /></div>
        <div className="candy">
            <div className="candyGame">
                {
                    currentColorArrangement.map((candyImage, index) => (
                        <img key={index}
                            src={candyImage}
                            alt=''
                            data-id={index}
                            draggable={true}
                            onDragStart={dragStart}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={(e) => e.preventDefault()}
                            onDragLeave={(e) => e.preventDefault()}
                            onDrop={dragDrop}
                            onDragEnd={dragEnd}
                            onClick={(e) => onBlockClick(e, index)}
                            className={index === selectedBlockIndex ? "glow" : ""}
                        />
                    ))
                }
            </div>
        </div>
    </>)
}

export default CandyCrush;