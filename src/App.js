import React from 'react';
import './App.css';
import GameOfLife from './GameOfLife';


function App() {
    return (
        <div className="App">
        <header className="App-header py-3 bg-dark text-white">
            <h1>Conway's Game of Life</h1>
            <main className="container mt-4">
                <GameOfLife />
            </main>
        </header>
        </div>
    );
}

export default App;
