import React from 'react';
import Recorder from './components/Recorder';
import './App.css';

function App() {
  return (
    <div className="container">
      <h1><i className="fas fa-language"></i> Malayalam Voice to Text</h1>
      <Recorder />
    </div>
  );
}

export default App;
