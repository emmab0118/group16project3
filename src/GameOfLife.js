import React, { useState, useRef, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const numRows = 50;
const numCols = 50;

// Creates Empty Grid
const generateEmptyGrid = () =>
    Array.from({length: numRows}, () =>
        Array.from({length: numCols}, () => 0)
);

// Check for neighbors of cell
const countLiveNeighbors = (grid, x, y) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue; // Skips home cell
            // Cells wrap around if they go off screen
            const row = (x + i + numRows) % numRows;
            const col = (y + j + numCols) % numCols;
            count += grid[row][col];
        }
    }
    return count;
}


const createNextGrid = (grid) => {
    const newGrid = grid.map(row => [...row]); // Stores a replica of current grid
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const neighbors = countLiveNeighbors(grid, i, j);
            if (grid[i][j] === 1) {
                if (neighbors < 2 || neighbors > 3) { // Dies of underpopulation or overpopulation
                    newGrid[i][j] = 0;
                }
            } else {
                if (neighbors === 3) { // IT'S ALIVE WAHAHAHA
                    newGrid[i][j] = 1;
                }
            }
        }
    }
    return newGrid;
}

const GameOfLife = () => {
    const [grid, setGrid] = useState(generateEmptyGrid());
    const [running, setRunning] = useState(false);
    const [generation, setGeneration] = useState(0);
    const runningRef = useRef(running);
    runningRef.current = running;
  
    const runSimulation = useCallback(() => {
      if (!runningRef.current) return;
      setGrid(prev => createNextGrid(prev));
      setGeneration(prev => prev + 1);
      setTimeout(runSimulation, 200);
    }, []);
  
    const run23 = () => {
      let localGrid = grid;
      for (let i = 0; i < 23; i++) {
        localGrid = createNextGrid(localGrid);
      }
      setGrid(localGrid);
      setGeneration(prev => prev + 23);
    };
  
    const toggleCell = (i, j) => {
      const newGrid = grid.map(row => [...row]);
      newGrid[i][j] = grid[i][j] ? 0 : 1;
      setGrid(newGrid);
    };
  
    const clearGrid = () => {
      setGrid(generateEmptyGrid());
      setGeneration(0);
    };
  
    return (
      <div className="container py-4">
        <div className="d-flex gap-2 mb-3 align-items-center flex-wrap justify-content-center">
          <button className="btn btn-success" onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}>{running ? 'Stop' : 'Start'}</button>
  
          <button className="btn btn-primary" onClick={() => {
            setGrid(createNextGrid(grid));
            setGeneration(prev => prev + 1);
          }}>Next</button>
  
          <button className="btn btn-warning" onClick={run23}>+23 Gen</button>
  
          <button className="btn btn-danger" onClick={clearGrid}>Clear</button>
  
          <span className="ms-3 fw-bold">Generation: {generation}</span>
        </div>
  
        <div className="d-flex justify-content-center">
          <div className="d-grid" style={{gridTemplateColumns: `repeat(${numCols}, 20px)`}}>
            {grid.map((row, i) =>
              row.map((cell, j) => (
                <img
                  key={`${i}-${j}`}
                  src={cell ? '/images/clipart-guy.png' : '/images/minecraft.png'}
                  alt={cell ? 'Alive Cell' : 'Dead Cell'}
                  onClick={() => toggleCell(i, j)}
                  style={{
                    width: 20,
                    height: 20,
                    border: '1px solid #ccc',
                  }}
                />
              ))
            )}
          </div>
        </div>
    </div>
    );
  };
  
  export default GameOfLife;