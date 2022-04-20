let gBoard = new Array(3).fill(" ").map(() => new Array(3).fill(" "));
let isNoWinner = true;
let isMoveMade = true;
var readline = require('readline');

function printBoard(board){
    let stringboard = '- - - - - - -\n';
    for(let i = 0; i < board.length; i++){
        for(let k = 0; k < board[i].length; k++){
            if(k === 0){
                stringboard += "| " + board[i][k] + " | ";
            } else  {
                stringboard += board[i][k] + " | ";
            }
        }
        stringboard += '\n';
        stringboard += "- - - - - - -";
        stringboard += '\n';
    }
    console.log(stringboard);
}

async function makeMove(){
    console.log("Input a a tile to move. Example; 0 1");
    console.log("This would be the top middle.");
    isMoveMade = false;
    const input = await readInput();
    isMoveMade = true;
    gBoard = parseInput(gBoard, input, "X");

}

function readInput() {
    const interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => interface.question("Please provide next input: ", answer => {
        interface.close();
        resolve(answer);
    }))
}


function parseInput(board, input, player){
    let y = parseInt(input[0]);
    let x = parseInt(input[2]);
    board[y][x] = player;
    return board;
}

function miniMax(board, depth, maximizingPlayer){
    let value;
    
    if(depth === 0 || checkWin(board, "O")) {
        //printBoard(board)
        //console.log("winning board")
        return 1
    } else if(depth === 0 || checkWin(board, "X")){
        //printBoard(board)
        //console.log("losing board")
        return -1;
    } else if(depth === 0 && (!checkWin(board, "X") && !checkWin(board, "O"))){
        //printBoard(board)
        //console.log("tieing board")
        return 0;
    }
    if(maximizingPlayer){
        value = -(Infinity);
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if(board[i][j] === " "){
                    let boardClone = copyBoard(board);
                    boardClone = parseInput(boardClone, `${i} ${j}`, "O")
                    //printBoard(board)
                    //console.log("max")
                    value = Math.max(value, miniMax(boardClone, depth -1, false));
                }
            }
        }
    } else {
        value = Infinity;
            for(let i = 0; i < 3; i++){
                for(let j = 0; j < 3; j++){
                    if(board[i][j] === " "){
                        let boardClone = copyBoard(board);
                        boardClone = parseInput(boardClone, `${i} ${j}`, "X")
                        //printBoard(board)
                        //console.log("Min")
                        
                        value = Math.min(value, miniMax(boardClone, depth -1, true));
                    }
                }
            }
    }
    return value;
}
function getBestMove(board){
    let bestMove;
    let bestScore = -(Infinity);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if(board[i][j] === " "){
                let boardClone = copyBoard(board);
                boardClone = parseInput(boardClone, `${i} ${j}`, "O")
                let score = miniMax(boardClone,getLength(boardClone),false);
                //console.log(`${i} ${j}`, score)
                if(score > bestScore){
                    bestScore = score;
                    
                    bestMove = `${i} ${j}`;
                    //console.log(bestMove, "best")
                }
            }
        }
    }
    return bestMove;
}

function getLength(board){
    let length = 0;
    board.forEach(i => {
        i.forEach(k => {
            if(k === " "){
                length += 1;
            }
        });
    });
    return length;
}

function checkWin(board, letter){
    if(getLength(board) > 4){
        return false;
    }
    let yCount = new Array(3).fill(0);
    let xCount = new Array(3).fill(0);
    let rightDiag = 0;
    let leftDiag = 0;
    board.forEach((el,i) => {
        el.forEach((innerEl,k) => {
            if(board[i][k] === letter) {
                xCount[i] += 1;
                yCount[k] += 1;
                if((i === 0 && k === 0) || (i === 1 && k === 1) || (i === 2 && k === 2)){
                    rightDiag += 1;
                }
                if((i === 0 && k === 2) || (i === 1 && k === 1) || (i === 2 && k ===0)){
                    leftDiag += 1;
                }
            }
        });
    });
    if(yCount.includes(3) || xCount.includes(3) || rightDiag === 3 || leftDiag === 3){
        return true;
    }
    return false;
}

function copyBoard(board){
    let copyBoard = new Array(3).fill(" ").map(() => new Array(3).fill(" "));
    board.forEach((el,i) => {
        el.forEach((innerEl,k) => {
            copyBoard[i][k] = board[i][k];
        });
    });
    return copyBoard;
}

(async () =>{
    console.log("\nWelceme to tik-tak-toe vs an AI computer using the minimax algorithm!\n");
    
    while(true){
        await makeMove();
        printBoard(gBoard);
        if(checkWin(gBoard,"X")) {
            console.log("YOU WON!");
            break;
        }

        console.log("\nCPU is making it's move.");
        parseInput(gBoard,getBestMove(gBoard), "O");
        printBoard(gBoard);
        if(checkWin(gBoard,"O")) {
            console.log("THE CPU WON! Try Again!");
            break;
        }
    }
})();
