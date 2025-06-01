const createBoard = (row, col, mines) => {
    let board = [];
    // 各マスのデータは2次元配列として管理する
    for(let x=0; x<row; x++){ // ボードの行
        let r = [];
        for(let y=0; y<col; y++){ // ボードの列
            r.push({
                value: 0, // (x,y)の周辺の3x3マスに含まれている地雷数、地雷の場合'X'
                revealed: false, // マスが開いているか否か
                x: x, // マスの行インデックス
                y: y, // マスの列インデックス
                flagged: false // フラグがあるか否か
            });
        }
        board.push(r); 
    }

    // 地雷を埋め込む
    let mineCount = 0;
    while(mineCount < mines){
        const x = Math.floor(Math.random() * row);
        const y = Math.floor(Math.random() * col);
        if (board[x][y].value === 0){
            board[x][y].value = 'X';
            mineCount++;
        }
    }

    // 周辺の3x3マスに含まれている地雷数を求める
    for (let x = 0; x < row; x++){
        for (let y = 0; y < col; y++){
            if (board[x][y].value !== 'X'){
                let count = 0;
                for (let y2 = Math.max(y-1, 0); y2 < Math.min(y+2, col); y2++){
                    for (let x2 = Math.max(x-1, 0); x2 < Math.min(x+2, row); x2++){
                        if (board[x2][y2].value === 'X'){
                            count++;
                        }
                    }
                }
                board[x][y].value = count;
            }
        }
    }

    return board;
}

export default createBoard;