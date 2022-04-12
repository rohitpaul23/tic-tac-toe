const x_but = document.querySelector('button#X');
const o_but = document.querySelector('button#O');
const congo_but = document.querySelector('.congrats .congratsBut');
const items = document.querySelectorAll('.item');
const congratsDiv = document.querySelector('.congrats');
const starterDiv = document.querySelector('.starter');
const body = document.querySelector('.body');
const vs = document.querySelector('.vs');
const comp = document.querySelector('.comp');
const singlebody = document.querySelector('.singleTab');
const doublebody = document.querySelector('.doubleTab');
const playerTab = document.querySelector('.doubleTab .symbolAssigned .player');
const symbolTab = document.querySelector('.doubleTab .symbolAssigned .symbol');
const winnerTab = document.querySelector('.congrats .winner');

const reset = document.querySelector('.reset');
const mode = document.querySelector('.mode');

let gameBoard = (() => {
    let board = [["", "", ""], 
                ["", "", ""], 
                ["", "", ""]];
    let noOfPlayer;
    let playerTurn = 0;
    let players = [];

    const markBoard = (pos, mark, name) => {
        board[pos.i][pos.j] = mark;
        check(pos, mark, name); 
    }

    const playerPlaying = (num) => {
        noOfPlayer = num;
    }

    const totalPlayer = () => {
        return noOfPlayer;
    }

    const setPlayer = (playerObj1, playerObj2) => {
        players[0] = playerObj1;
        players[1] = playerObj2;
    }

    const getPlayer = () => {
        return players[playerTurn];
    }

    const nextPlayer = () => {
        playerTurn = (playerTurn + 1)%2;
    }

    const clearBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = "";
            }
        }
    }

    const emptyCell = () => {
        let alist = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if(board[i][j] == ""){
                    alist.push(3*i + j);
                }
            }
        }
        return alist;
    }

    const check = (pos, mark, name) => {
        const row = pos.i;
        const col = pos.j;

        let leftDiag = 0;
        let rightDiag = 0;
        let vert = 0;
        let hor = 0;
        let full = 1;

        for (let row_i = row - 2; row_i < row + 3; row_i++) {
            for (let col_i = col - 2; col_i < col + 3; col_i++) {
                
                if (row_i < 0 || col_i < 0 || row_i > 2 || col_i > 2) {
                    continue;
                }
                if ((row - row_i) == (col - col_i)) {
                    if (board[row_i][col_i] == mark) {
                        leftDiag += 1;   
                    }
                }
                if ((row - row_i) == -(col - col_i)) {
                    if (board[row_i][col_i] == mark) {
                        rightDiag += 1;   
                    }
                }
                if (row_i == row) {
                    if (board[row_i][col_i] == mark) {
                        hor += 1;   
                    }
                }
                if (col_i == col) {
                    if (board[row_i][col_i] == mark) {
                        vert += 1;   
                    }
                }
            }
        }

        if (leftDiag == 3 || rightDiag == 3 || hor == 3 || vert == 3) {
            let p = document.querySelector('.congrats p');
            congratsDiv.style.display = 'flex';
            body.style.opacity = '0.3';
            if (noOfPlayer == 1 && playerTurn == 1) {
                p.textContent = "You Lose!! Better luck next time";
                congratsDiv.setAttribute('style', congratsDiv.getAttribute('style') + '; background-color: red;');
                winnerTab.textContent = '';
            }
            else{
                p.textContent = "Congratulation!!";
                winnerTab.textContent = name;
            }

            clearBoard()
            clear();
        }

        for (let i = 0; i < 3; i++) {
            for( let j = 0; j < 3; j++){
                if(board[i][j] == ""){
                    full = 0;
                    break;
                }
            }          
        }
        if (full == 1) {
            congratsDiv.style.display = 'flex';
            body.style.opacity = '0.3';
            winnerTab.textContent = 'Its a DRAW!!';

            clearBoard()
            clear();
        }

        //console.log({leftDiag, rightDiag, hor, vert});
    }

    const show = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const element = board[i][j];
                if (element == "") {
                    console.log("Empty");    
                }
                else{
                    console.log(element);
                }
            }
        }
    }
    return {markBoard, playerTurn, totalPlayer, playerPlaying, setPlayer, getPlayer, nextPlayer, clearBoard, emptyCell, show};
})()

const player = () => {
    let symbol;
    let name;
    
    const assignSymbol = (sym) => {
        symbol = sym;
    }

    const play = (pos) => {
        gameBoard.markBoard(pos, symbol);
    }

    const getSymbol = () =>{
        return symbol;
    }

    const setName = (playerName) => {
        name = playerName;
    }

    const getName = () => {
        return name;
    }

    return {assignSymbol, play, getSymbol, setName, getName};
}


/*
gameBoard.markBoard(2, 'X');
gameBoard.markBoard(4 , '0');
gameBoard.show();
*/

const player1 = player();
const player2 = player();

function clear(){
    items.forEach((item) => {
        item.textContent = '';
    })    
    gameBoard.clearBoard();    
}

function computerPlay(){
    const symbol = player2.getSymbol();
    gridList = gameBoard.emptyCell();
    let len = gridList.length;
    let randomPt = Math.floor(Math.random()*len); 
    const id_num = gridList[randomPt];
    const grid = document.querySelector('#item'+id_num);
    grid.textContent = symbol;
    const grid_id = {i : Math.floor(id_num/3), j : id_num%3}
    gameBoard.markBoard(grid_id, symbol, player2.getName());
}

vs.addEventListener('click', () => {
    player1.assignSymbol('X');
    player2.assignSymbol('O');
    player1.setName('player 1');
    player2.setName('player 2');
    gameBoard.playerPlaying(2);
    gameBoard.setPlayer(player1, player2);

    starterDiv.style.display = 'none';  
    body.style.opacity = '1';
    singlebody.style.display = 'none';
    doublebody.setAttribute('style', 'flex:1;');
    playerTab.textContent = player1.getName();
    symbolTab.textContent = player1.getSymbol();
})

comp.addEventListener('click', () => {
    player1.assignSymbol('X');
    player2.assignSymbol('O');
    player1.setName('player');
    player2.setName('computer');
    gameBoard.playerPlaying(1);
    gameBoard.setPlayer(player1, player2);

    starterDiv.style.display = 'none';  
    body.style.opacity = '1';
    doublebody.style.display = 'none';
    singlebody.setAttribute('style', 'flex:1;');
    singlebody.style.display = 'block';
})

x_but.addEventListener('click', () => {
    if (player1.getSymbol() == 'O') {
        clear();
    }
    player1.assignSymbol('X');
    x_but.setAttribute('style', 'background-color: darkgray;');
    o_but.setAttribute('style', 'background-color: white;')
})

o_but.addEventListener('click', () => {
    if (player1.getSymbol() == 'X') {
        clear();
    }
    player1.assignSymbol('O');
    o_but.setAttribute('style', 'background-color: darkgray;');
    x_but.setAttribute('style', 'background-color: white;')
})

items.forEach((item) => {
    item.addEventListener('click', (e) => {
        if (gameBoard.totalPlayer() == 2){
            if (item.textContent == '') {
                playerChance = gameBoard.getPlayer();
                const symbol = playerChance.getSymbol();
                //console.log(playerChance.getName());
                item.textContent = symbol;
                const id_num = item.getAttribute('id')[4];
                const grid_id = {i : Math.floor(id_num/3), j : id_num%3}
                gameBoard.markBoard(grid_id, symbol, playerChance.getName());
                gameBoard.nextPlayer();
                playerChance = gameBoard.getPlayer();
                playerTab.textContent = playerChance.getName();
                symbolTab.textContent = playerChance.getSymbol();
            }
        }
        else{
            if (item.textContent == '') {
                const symbol = player1.getSymbol();
                item.textContent = symbol;
                const id_num = item.getAttribute('id')[4];
                const grid_id = {i : Math.floor(id_num/3), j : id_num%3}
                gameBoard.markBoard(grid_id, symbol, player1.getName());
                gameBoard.nextPlayer();
                computerPlay();
                gameBoard.nextPlayer();
            }
        }
    })
})

congo_but.addEventListener('click', () => {
    congratsDiv.style.display = 'none';  
    body.style.opacity = '1';
})

reset.addEventListener('click', () => {
    clear();
})

mode.addEventListener('click', () => {
    doublebody.style.display = 'none';
    singlebody.style.display = 'none';
    starterDiv.style.display = 'flex';
    body.style.opacity = 0.3;
    clear();
})