//This is the highest level component in this project. It should not be responsible for anything other than calling other components, and passing data

import React, { Component } from 'react';
import './App.css';
import Left_Sidebar from '../Left-Sidebar/Left_Sidebar'
import Right_Sidebar from '../Right-Sidebar/Right-Sidebar.js'
import Header from '../Header/Header'
import Main from '../Main/Main'



class App extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  //Used to create graphs. 
  getGraphData = (graphData) => {
    //console.log("APP RECEIVED NEW APP DATA")
    let newState = this.state;
    newState = {
      graphData: graphData
    }
    //console.log("graphData:  " + graphData)


    this.setState(newState)

  }

  //Used for passing data to right sidebar for display
  getPointData = (pointData) => {
    console.log('app received point data', pointData)
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
        <Right_Sidebar pointData={this.state.pointData} />
        <Main graphData={JSON.stringify(this.state.graphData)} pointData={this.getPointData.bind(this)} />
        <Left_Sidebar graphData={this.getGraphData.bind(this)} />
      </div>
    );
  }
}

export default App;
