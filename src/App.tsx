import { useEffect, useState } from 'react'
import './App.css'

type Grid = boolean[][];
type Vector2 = {x: number, y: number};
const GRID_SIZE = 5; // 5x5
const START_STEPS = 2 // Amount of origins targeted before game starts.
const OFFSETS = [
  [0, 0],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
]

function performAction(refGrid: Grid, origin: Vector2) : Grid {
  let currentGrid = refGrid.map(row => [...row]);
  for (let i=0; i<OFFSETS.length; i++) {
    const currentOffset = OFFSETS[i];
    const newVector = {x: origin.x + currentOffset[1], y: origin.y + currentOffset[0]}
    if (newVector.y >= 0 && newVector.y < GRID_SIZE 
      && newVector.x >= 0 && newVector.x < GRID_SIZE) { // If indexes are in-range, proceed.
        // Inverse current index.
        currentGrid[newVector.y][newVector.x] = !(currentGrid[newVector.y][newVector.x]);
    }   
  }
  return currentGrid;
}

function createNewGrid() : Grid {
  let newGrid: Grid = [];
  for (let y=0; y<GRID_SIZE; y++) {
    newGrid[y] = [];
    for (let x=0; x<GRID_SIZE; x++) {
      newGrid[y][x] = false;
    }
  }
  for (let i=0; i<START_STEPS; i++) {
    newGrid = performAction(newGrid, {y: Math.floor(Math.random() * GRID_SIZE), x: Math.floor(Math.random() * GRID_SIZE)} as Vector2)
  }
  return newGrid;
}

function App() {
  const [grid, setGrid] = useState<Grid>(createNewGrid())
  const [moves, setMoves] = useState<number>(0);
  const [win, setWin] = useState<boolean>(false);
  const onNodeClick = function(y : number, x : number) {
    setGrid(prevGrid => performAction(prevGrid, {y:y, x:x}));
    setMoves(prevMoves => prevMoves + 1);
  }
  useEffect(()=> {
    for (let y=0; y<GRID_SIZE; y++) {
      for (let x=0; x<GRID_SIZE; x++) {
        if (grid[y][x] == true) return;
      }
    } 
    setWin(true)
  }, [grid])
  useEffect(()=> {
    if (!win) return;
    setTimeout(function() {
      setGrid(createNewGrid());
      setWin(false);
      setMoves(0);
    }, 3000)
  }, [win])
  return (
    <>
      <h1>Wing-it Wednesday: Lights-Out</h1>
      {win ? (
        <h2>Congrats, you solved the puzzle in {moves} move(s)!</h2>
      ) : (
        <div className="status">
          <div>Moves: {moves}</div>
          <div>Lowest Moves Possible: {START_STEPS}</div>
        </div>
      )}
      <div className="grid">
        {grid.map((row, y) => (
          <div className='grid-row' key={"row-"+y}>
            {row.map((isEnabled, x) => {
              return (
                <div onClick={() => onNodeClick(y, x)} className="grid-box" key={"col-"+x} style={{backgroundColor: isEnabled ? "yellow" : "gray"}}>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </>
  )
}

export default App
