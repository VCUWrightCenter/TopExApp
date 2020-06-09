//This is the highest level component in this project. It should not be responsible for anything other than calling other components, and passing data

import React, { Component } from 'react';
import './App.css';
import LeftSidebar from '../LeftSidebar/LeftSidebar'
import RightSidebar from '../RightSidebar/RightSidebar.js'
import Header from '../Header/Header'
import Main from '../Main/Main'



class App extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  //Used to create graphs. 
  getGraphData = (graphData) => {
    let newState = this.state;
    newState = {
      graphData: graphData
    }
    this.setState(newState)
  }

  //Used for passing data to right sidebar for display
  getPointData = (pointData) => {
    let newState = this.state;
    newState = {
      pointData: pointData
    }

    this.setState(newState)
  }

  render() {
    return (
      <div className='main-content'>
        <Header />
        <RightSidebar pointData={this.state.pointData} />
        <Main graphData={JSON.stringify(this.state.graphData)} pointData={this.getPointData.bind(this)} />
        <LeftSidebar graphData={this.getGraphData.bind(this)} />
      </div>
    );
  }
}

export default App;
