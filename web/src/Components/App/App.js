//This is the highest level component in this project. It should not be responsible for anything other than calling other components, and passing data

import React, { Component } from 'react';
import './App.css';
import InputPanel from '../InputPanel/InputPanel'
import RightSidebar from '../RightSidebar/RightSidebar.js'
import Header from '../Header/Header'
import Main from '../Main/Main'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  // Callback for passing graphData from child components back up to App
  graphDataCallback = (graphData) => {
    this.setState({graphData: graphData})
  }

  //Used for passing data to right sidebar for display
  pointDataCallback = (pointData) => {
    this.setState({pointData: pointData});
  }

  render() {
    return (
      <div className='main-content'>
        <Header />
        <RightSidebar pointData={this.state.pointData} />
        <Main graphData={JSON.stringify(this.state.graphData)} pointDataCallback={this.pointDataCallback} />
        <InputPanel graphDataCallback={this.graphDataCallback} />
      </div>
    );
  }
}

export default App;
