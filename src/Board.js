import { useState, useEffect } from "react";
import createBoard from "./createBoard";
import Cell from "./Cell";

const Board = ({row, col, mines}) => {
    const [gameData, setGameData] = useState({});
    const [resetGame, setResetGame] = useState(true);
    const [count, setCount] = useState(0);
    const [startCount, setStartCount] = useState(false);

    useEffect(() => {
        let interval;
        if(!startCount) {return () => {}}
        interval = setInterval(() => {
            setCount((prevCount) => prevCount + 1);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [startCount]);

    useEffect(() => {                                       // useEffectを定義
        if (resetGame){                                     // resetGameがtrueの時、ゲームをリセット
            setCount(0);
            const newBoard = createBoard(row, col, mines);  // 新しいボードを作成
            setGameData({                                   // ゲームデータを設定
                board: newBoard,                            // 新しいボード
                gameStatus: 'Game in Progress',             // ゲームの状態を「進行中」に設定
                cellsWithoutMines: row * col - mines,       // 地雷のないセルの数を設定
                numOfMines: mines                           // 地雷の数を設定
            });
            setStartCount(false);
            setResetGame(false);                            // ゲームリセットフラグをfalseに設定
        } 
    }, [resetGame, row, col, mines]);                       // resetGame, row, col, minesが変更されるたびに実行

    useEffect(() => {
        const newBoard = createBoard(row, col, mines);
        console.log(newBoard);
        setGameData({
            board: newBoard,
            gameStatus: 'Game in Progress',
            cellsWithoutMines: row * col - mines,
            numOfMines: mines
        });
    }, []);

    if(!gameData.board){return <div>Loading...</div>}

    const handleUpdateFlag = (e, x, y) => {                 //　handleUpdateFlagを定義
        e.preventDefault();                                 //　イベントのデフォルトの動作を無効化
        if(gameData.gameStatus === 'You Lost' ||            //　ゲームが終了したとき、処理を中断
            gameData.gameStatus === 'You Win'){return;}     //　ゲームが終了したとき、処理を中断
        if(gameData.board[x][y].revealed){return;}          //　すでに開いているセルにはフラグを立てられない

        setGameData((prev) => {                             //　ゲームデータの更新
            const newBoard = [...prev.board];               //　現在のボードをコピー
            const newFlag = !newBoard[x][y].flagged;        //　フラグの状態を反転
            let newNumOfMines = prev.numOfMines;            //　現在の地雷数を取得
            newFlag ? newNumOfMines-- : newNumOfMines++;    //　フラグを立てたときは地雷数を減らし、外したときは増やす
            newBoard[x][y].flagged = newFlag;               //　対象セルのフラグの状態を更新

            return {                                        //　ゲームデータの新しい状態を返す
                ...prev,                                    //　前のゲームデータ
                numOfMines: newNumOfMines,                  //　更新された地雷数
                board: newBoard                             //　更新されたボード
            }
        });
    }

    const handleRevealCell = (x, y) => {                                // handleRevealCellを定義
        if(gameData.gameStatus === 'You Lost' ||                        // ゲームが終了したとき、処理を中断
            gameData.gameStatus === 'You Win'){return;}                 // ゲームが終了したとき、処理を中断

        if (!startCount) {
            setStartCount(true);
        }
            
        if(gameData.board[x][y].revealed ||                             // すでに開いているセルまたは
            gameData.board[x][y].flagged){return;}                      // フラグが立っているセルには処理しない

        const newGameData = {...gameData};                              // ゲームデータのコピーを作成

        if(newGameData.board[x][y].value === 'X'){                      // クリックしたセルが地雷の場合
            newGameData.board.forEach((row) =>                          // 各行
                row.forEach((cell) => {                                 // 各セルに対して
                    cell.revealed = true;                               // 全てのマスをオープン
                })
            );
            setStartCount(false);
            newGameData.gameStatus = 'You Lost';                        // ゲームオーバー
        }else if(newGameData.board[x][y].value === 0){                  // クリックしたマスの周辺に地雷がない場合
            const newRevealedData = revealEmpty(x, y, newGameData);     // 空白セルを開く
            setGameData(newRevealedData);return;                        // 新しいゲームデータをセット
        }else {                                                         // クリックしたマスに1個以上の地雷がある場合
            newGameData.board[x][y].revealed = true;                    // セルを開く
            newGameData.cellsWithoutMines--;                            // 地雷のないセルの数を減らす
            if(newGameData.cellsWithoutMines === 0)                     // 地雷のないセルが全て開かれた場合
            {setStartCount(false);newGameData.gameStatus = 'You Win';}                       // ゲームクリア
        }

        setGameData(newGameData);                                       // ゲームデータを更新
    }

    const revealEmpty = (x, y, data) => {
        if(data.board[x][y].revealed){return;}

        data.board[x][y].revealed = true;
        data.cellsWithoutMines--;
        if(data.cellsWithoutMines === 0){
            data.gameStatus = 'You Win';
        }
        // マスの周辺に地雷がない場合は、その周辺のマスをいっぺんに開示
        if(data.board[x][y].value === 0){
            for(let y2 = Math.max(y-1, 0); y2 < Math.min(y+2, col); y2++){
                for(let x2 = Math.max(x-1, 0); x2 < Math.min(x+2, row); x2++){
                    if(x2 != x || y2 != y) {revealEmpty(x2, y2, data);}
                }
            }
        }
        return data;
    }

    return(
        <div>
            <div>🚩{gameData.numOfMines} &nbsp;&nbsp; ⏰ {count} &nbsp;&nbsp;
                <button onClick={() => {setResetGame(true);}}>Reset</button>
            </div>
            <div>Game Status: {gameData.gameStatus}</div>
            <div>
                {gameData.board.map((singleRow, index1) => {
                    return(
                        <div style={{display:'flex'}} key={index1}>
                            {
                                singleRow.map((singleCell, index2) => {
                                    return <Cell details={singleCell} onUpdateFlag={handleUpdateFlag}
                                    onRevealCell={handleRevealCell} key={index2} />
                                })
                            }
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default Board;