import React, { useState, useRef, useCallback, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Count live neighbors with wrap-around
const countLiveNeighbors = (grid, x, y, numRows, numCols) => {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      // Wraps around edge
      const row = (x + i + numRows) % numRows;
      const col = (y + j + numCols) % numCols;
      count += grid[row][col]; // count neighbor if alive
    }
  }
  return count;
};

// Calculate next grid based on Game of Life rules
const createNextGrid = (grid, numRows, numCols) => {
  const newGrid = grid.map(row => [...row]);
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const neighbors = countLiveNeighbors(grid, i, j, numRows, numCols);
      if (grid[i][j] === 1) {
        if (neighbors < 2 || neighbors > 3) {
          newGrid[i][j] = 0;
        }
      } else {
        if (neighbors === 3) {
          newGrid[i][j] = 1;
        }
      }
    }
  }
  return newGrid;
};

const GameOfLife = ({ numRows = 20, numCols = 20, onSetSize = () => {}, presetCells = [] }) => {
  const generateEmptyGrid = () =>
    Array.from({ length: numRows }, () =>
      Array.from({ length: numCols }, () => 0)
    );

  const [grid, setGrid] = useState(generateEmptyGrid());
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const runningRef = useRef(running);
  runningRef.current = running;
  
  // Clear grid if no preset cells are provided
  useEffect(() => {
    if (presetCells.length === 0) {
      const generateEmptyGrid = () =>
        Array.from({ length: numRows }, () =>
          Array.from({ length: numCols }, () => 0)
        );
  
      setGrid(generateEmptyGrid());
      setGeneration(0);
    }
  }, [numRows, numCols, presetCells]);


  // Load preset pattern into grid
  useEffect(() => {
    if (presetCells.length > 0) {
      const newGrid = Array.from({ length: numRows }, () =>
        Array.from({ length: numCols }, () => 0)
      );
      // Alive cells from the preset list
      presetCells.forEach(([i, j]) => {
        if (i < numRows && j < numCols) {
          newGrid[i][j] = 1;
        }
      });
      setGrid(newGrid);
      setGeneration(0);
    }
  }, [presetCells, numRows, numCols]);;

  

  // Main loop
  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;
    setGrid(prev => createNextGrid(prev, numRows, numCols));
    setGeneration(prev => prev + 1);
    setTimeout(runSimulation, 100);
  }, [numRows, numCols]);

  const run23 = () => {
    let localGrid = grid;
    for (let i = 0; i < 23; i++) {
      localGrid = createNextGrid(localGrid, numRows, numCols);
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
          setGrid(createNextGrid(grid, numRows, numCols));
          setGeneration(prev => prev + 1);
        }}>Next</button>

        <button className="btn btn-warning" onClick={run23}>+23 Gen</button>

        <button className="btn btn-danger" onClick={clearGrid}>Clear</button>

        <button className="btn btn-secondary" onClick={onSetSize}>Set Size</button>

        <span className="ms-3 fw-bold">Generation: {generation}</span>
      </div>

      <div className="d-flex justify-content-center">
        <div className="d-grid" style={{ gridTemplateColumns: `repeat(${numCols}, 20px)` }}>
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
                  cursor: 'pointer'
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
