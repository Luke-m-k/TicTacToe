// IIFE Message Controller
const messageController = (() => {
    const renderMessage = (message) => {
        document.querySelector("#message").innerText = message;
    }
    return {renderMessage,};
})();




// IIFE GameBoard
const Gameboard = (() => {
    let gameboard = ["", "", "", "", "", "", "", "", ""];

    const getGameboard = () => gameboard;

    const render = () => {
        let boardHTML = "";
        gameboard.forEach((square, index) => {
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`;
        })
        document.querySelector("#gameBoard").innerHTML = boardHTML;
        // add event listener
        const squares = document.querySelectorAll(".square");
        squares.forEach((square)  => {
            square.addEventListener("click", Game.handleClick);
        })
    }

    const update = (index, value) => {
        gameboard[index] = value;
        render();
    }
    return {render, update, getGameboard};
})();





// IIFE Game
const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver = false;
    let message;

    const start = () => {
        const Player1 = document.querySelector("#player1");
        const Player2 = document.querySelector("#player2");
        if(Player1.value === "" && Player2.value === ""){
            message = `Please Enter Your names`;
            messageController.renderMessage(message);
            return;
        }
        players = [
            createPlayer(Player1.value, "X"),
            createPlayer(Player2.value, "O")
        ]

        restart();
    }

    const restart = () => {
        gameOver = false;
        message = `${players[0].name} Turn.`
        currentPlayerIndex = 0;



        messageController.renderMessage(message);

        for (let i = 0; i < 9; i++) {
            Gameboard.update(i, "");
        }
        Gameboard.render();
    }

    const end = () => {
        gameOver = true;
        messageController.renderMessage("GAME OVER!");
        document.querySelector("#player1").innerText = "";
        document.querySelector("#player2").innerText = "";
        document.querySelector("#gameBoard").innerHTML = "";
    }

    const handleClick = (event) => {
        if(gameOver) {
            return;
        }
        if(event.target.innerText === ""){
            let index = event.target.id.split("-")[1];
            Gameboard.update(index, players[currentPlayerIndex].mark);

            if (checkForWin(Gameboard.getGameboard())) {
                gameOver = true;
                message = `${players[currentPlayerIndex].name} Won`
                messageController.renderMessage(message);
                return;
            } else if (checkForTie(Gameboard.getGameboard())) {
                gameOver = true;
                messageController.renderMessage("It's a Tie");
                return;
            }

            currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
            message = `${players[currentPlayerIndex].name} Turn`;
            messageController.renderMessage(message);
        }
    }

    const showCurrentPlayer = () => players[currentPlayerIndex].name;

    return {start, restart, handleClick, showCurrentPlayer, end};
})();





// Check for win
function checkForWin(board){
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]){
            return true;
        }
    }
    return false;
}


// Check for Tie
function checkForTie(board){
    return board.every(cell => cell !== "");
}

// FACTORY Create Player Object
const createPlayer = (name, mark) => {
    return {
        name,
        mark,
    }
}





// Start Button Event Listener
const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", () => {
    Game.start();
});


//  Restart Button Event Listener
const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", () => {
    Game.restart();
})

//  End Button Event Listener
const endButton = document.querySelector("#end-button");
endButton.addEventListener("click", () => {
    Game.end();
})