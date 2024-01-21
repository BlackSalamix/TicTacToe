const aiTurn = () => {
	let bestScore = -Infinity;
	let bestMove = 0;
	let tempBoard = Gameboard.getBoard();
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
            if(tempBoard[i][j] == ''){
                tempBoard[i][j] = 'x'
                const score = minimax(tempBoard, 0, False)
                if(score > bestScore){
                    bestScore = score
                    bestMove = tempBoard
                }
                tempBoard[i][j] = ''
            }
        }
	}
    //Wywolanie ruchu AI
    return
}

const minimax = (board, depth, isMaximizing) => {
    //sprawdzenie rezultatu
    if(checkWhichSignWon(ai.getSign, board))return 1
    if(checkWhichSignWon(player.getSign, board))return -1
    if(checkDraw(board))return 0
    if(isMaximizing){
        let bestScore = -Infinity
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if(board[i][j] == ''){
                    board[i][j] = 'x'
                    const score = minimax(board, depth + 1, False)
                    board[i][j] = ''
                    if(score > bestScore){
                        bestScore = score
                    }
                }
            }
        }
        return bestScore
    }
    else{
        let bestScore = +Infinity
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if(board[i][j] == ''){
                    board[i][j] = 'x'
                    const score = minimax(board, depth + 1, True)
                    board[i][j] = ''
                    if(score < bestScore){
                        bestScore = score
                    }
                }
            }
        }
        return bestScore
    }
}


const checkRow = (sign, board) => {
    for (let i = 0; i < 3; i++) {
        if (
            board[i].every(
                (e) => e === board[i][0] && e !== "" && board[i][0] === sign
            )
        ) {
            return 1;
        }
    }
};

const checkCol = (sign, board) => {
    for (let i = 0; i < 3; i++) {
        if (
            board[0][i] === board[1][i] &&
            board[0][i] === board[2][i] &&
            board[0][i] !== "" && board[0][i] === sign
        ) {
            return 1;
        }
    }
};

const checkDiagonals = (sign, board) => {
    if (
        board[0][0] === board[1][1] &&
        board[0][0] === board[2][2] &&
        board[0][0] !== "" && board[0][0] === sign
    ) {
        return 1;
    } else if (
        board[0][2] === board[1][1] &&
        board[0][2] === board[2][0] &&
        board[0][2] !== "" && board[0][2] === sign
    ) {
        return 1;
    }
};

const checkWhichSignWon = (sign, board) => {
    if (checkRow(sign, board) || checkCol(sign, board) || checkDiagonals(sign, board)) return 1
};

const checkDraw = (board) => {
    let emptyFields = 0
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if(board[i][j] == '') emptyFields++
        }
    }
    if(emptyFields == 0)return 0
};