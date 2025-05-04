import React, { useState } from 'react';
import './App.css';
import GameOfLife from './GameOfLife';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [dimensions, setDimensions] = useState({ numRows: 20, numCols: 20 });
  const [presetCells, setPresetCells] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [inputRows, setInputRows] = useState(20);
  const [inputCols, setInputCols] = useState(20);

  const presets = {
    Block: {
        numRows: 4,
        numCols: 4,
        cells: [
            [1, 1], [1, 2], [2, 1], [2, 2]
        ]
    },
    Beehive: {
        numRows: 5,
        numCols: 6,
        cells: [
            [1, 2], [1, 3], [2, 1], [2, 4], [3, 2], [3, 3]
        ]
    },
    Boat:{
        numRows: 5,
        numCols: 5,
        cells: [
            [1, 1], [1, 2], [2, 1], [2, 3], [3, 2]
        ]
    },
    Blinker:{
        numRows: 5,
        numCols: 5,
        cells: [
            [1, 2], [2, 2],  [3, 2]
        ]
    },
    Beacon:{
        numRows: 6,
        numCols: 6,
        cells: [
            [1, 1], [1, 2], [2, 1], [2, 2], [3, 3], [3, 4], [4, 3], [4, 4]
        ]
    },
    Glider: {
        numRows: 20,
        numCols: 20,
        cells: [
          [1, 2], [2, 3], [3, 1], [3, 2], [3, 3]
        ]
    },
  };

  const handlePresetChange = (name) => {
    if (!presets[name]) return;
    const { numRows, numCols, cells } = presets[name];
    setDimensions({ numRows, numCols });
    setPresetCells(cells);
  };

  const handleSave = () => {
    if (inputRows > 0 && inputCols > 0) {
      setDimensions({ numRows: inputRows, numCols: inputCols });
      setPresetCells([]);
      setShowModal(false);
    } else {
      alert("Please enter numbers greater than 0.");
    }
  };

    return (
        <div className="App min-vh-100 min-vw-100 bg-dark text-white d-flex flex-column">
            <main className="container mt-4 py-3 bg-dark text-white">
            <h1>Conway's Game of Life</h1>


            <GameOfLife
            numRows={dimensions.numRows}
            numCols={dimensions.numCols}
            onSetSize={() => setShowModal(true)}
            presetCells={presetCells}
            />
            
            <div className="d-flex justify-content-center mb-3">
                <select
                    className="form-select w-auto"
                    onChange={(event) => handlePresetChange(event.target.value)}
                >
                    <option value="">Select a Preset</option>
                    {Object.keys(presets).map((name) => (
                    <option key={name} value={name}>{name}</option>
                    ))}
                </select>
            </div>
        </main>

        {showModal && (
            <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Set Grid Size</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body">
                    <div className="mb-3">
                    <label className="form-label">Rows</label>
                    <input
                        type="number"
                        className="form-control"
                        value={inputRows}
                        onChange={(e) => setInputRows(parseInt(e.target.value))}
                    />
                    </div>
                    <div>
                    <label className="form-label">Columns</label>
                    <input
                        type="number"
                        className="form-control"
                        value={inputCols}
                        onChange={(e) => setInputCols(parseInt(e.target.value))}
                    />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave}>Save</button>
                </div>
                </div>
            </div>
            </div>
      )}
    </div>
  );
}

export default App;
