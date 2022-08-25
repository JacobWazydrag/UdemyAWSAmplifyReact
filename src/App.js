import * as React from 'react'
import logo from './logo.svg';
import './App.css';

export default function App () {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          This is the QA Environment!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          PROD
        </a>
      </header>
    </div>
  );
}
