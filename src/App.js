import './App.css';
import Board from './Board';

const GAME_ROW = 10;
const GAME_COL = 10;
const MINES = 15;

function App() {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center'
  }
  return (
    <div className='App'>
      <h2>Minesweeper</h2>
      <div style={containerStyle}>
        <Board row={GAME_ROW} col={GAME_COL} mines={MINES} />
      </div>
    </div>
  );
}

export default App;
