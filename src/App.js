import React, { useState, useEffect} from 'react';
import './App.css';
import GameOfLife from './GameOfLife';
import Admin from './Admin';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [username, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('data'); 
    if (username) {
      setMessage(username);
    }
  }, []);
  
  const [dimensions, setDimensions] = useState({ numRows: 20, numCols: 20 });
  const [showModal, setShowModal] = useState(false);
  const [inputRows, setInputRows] = useState(20);
  const [inputCols, setInputCols] = useState(20);

  const handleSave = () => {
    if (inputRows > 0 && inputCols > 0) {
      setDimensions({ numRows: inputRows, numCols: inputCols });
      setShowModal(false);
    } else {
      alert("Please enter numbers greater than 0.");
    }
  };
  if(username === "admin"){
    return(
      <Admin></Admin>
    );
  }
  else{
    return (
      <div className="App min-vh-100 min-vw-100 bg-dark text-white d-flex flex-column">
  
        <main className="container mt-4 py-3 bg-dark text-white">
          <h1>Conway's Game of Life</h1>
          <GameOfLife
            numRows={dimensions.numRows}
            numCols={dimensions.numCols}
            onSetSize={() => setShowModal(true)}
          />
        </main>
  
        {/* Modal */}
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

}

export default App;
