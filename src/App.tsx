import React, { useReducer } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [count, counter] = useReducer((_) => _ + 1, 0);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>count: {count}</p>
        <button onClick={counter}>counter</button>
      </header>
    </div>
  );
}

export default App;
