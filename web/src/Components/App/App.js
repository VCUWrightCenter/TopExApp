//This is the highest level component in this project. It should not be responsible for anything other than calling other components, and passing data

import React, { Component } from 'react';
import './App.css';
import InputPanel from '../InputPanel/InputPanel'
import DetailPanel from '../DetailPanel/DetailPanel'
import Header from '../Header/Header'
import MainPanel from '../MainPanel/MainPanel'
import WelcomeDialog from '../Dialog/WelcomeDialog';
import { ThemeProvider, StyledEngineProvider, createTheme, adaptV4Theme } from '@mui/material/styles';
import { green, amber } from '@mui/material/colors/';

const customTheme = createTheme(adaptV4Theme({
  // theme settings
  palette: {
    primary: {
      main: green[500],
      contrastText: '#fff',
    },
      secondary: {
        main: amber[500],
        contrastText: '#000',
      }
  },
}));

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  // Callback for passing jsonApiResult from child components back up to App
  graphDataCallback = (apiResult) => {
    this.setState({apiResult: apiResult})
    console.log('App', JSON.parse(apiResult.viz_df))
  }

  //Used for passing data to right sidebar for display
  pointDataCallback = (pointData) => {
    this.setState({pointData: pointData});
  }

  render() {
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={customTheme}>
          <div className='main-content'>
            <WelcomeDialog />
            <Header />
            <DetailPanel pointData={this.state.pointData} />
            <MainPanel apiResult={this.state.apiResult} pointDataCallback={this.pointDataCallback} />
            <InputPanel graphDataCallback={this.graphDataCallback} />
          </div>
        </ThemeProvider>
      </StyledEngineProvider>
    );
  }
}

export default App;
