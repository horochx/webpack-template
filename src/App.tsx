import { hot } from 'react-hot-loader/root'
import React, { Component } from 'react'
import logo from './logo.svg'
import './App.modules.css'

class App extends Component {
  render() {
    return (
      <div styleName="App">
        <header styleName="App-header">
          <img src={logo} styleName="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            styleName="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    )
  }
}

export default hot(App)
