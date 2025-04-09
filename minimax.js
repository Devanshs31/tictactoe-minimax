// Minimax algorithm for the computer's optimal move
function minimax(newOptions, player) {
    const emptyCells = getEmptyCells(newOptions);

    // Base cases: check for a win, loss, or draw
    if (checkWin(newOptions, "X")) {
        return { score: -10 };
    } else if (checkWin(newOptions, "O")) {
        return { score: 10 };
    } else if (emptyCells.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < emptyCells.length; i++) {
        const move = {};
        move.index = emptyCells[i];
        newOptions[emptyCells[i]] = player;

        if (player === "O") {
            const result = minimax(newOptions, "X");
            move.score = result.score;
        } else {
            const result = minimax(newOptions, "O");
            move.score = result.score;
        }

        newOptions[emptyCells[i]] = "";
        moves.push(move);
    }

    // Find the best move
    let bestMove;
    if (player === "O") {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

// Get all empty cells on the board
function getEmptyCells(board) {
    const emptyCells = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            emptyCells.push(i);
        }
    }
    return emptyCells;
}

// Check if a player has won
function checkWin(board, player) {
    return winConditions.some(condition =>
        condition.every(index => board[index] === player)
    );
}