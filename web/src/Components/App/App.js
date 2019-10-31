import React from 'react';
import './App.css';
import Left_Sidebar from '../Left-Sidebar/Left_Sidebar'
import Right_Sidebar from '../Right-Sidebar/Right-Sidebar.js'
import Header from '../Header/Header'

function App() {
  return (
    <div className='main'>
      <Header />
      <Left_Sidebar />
      <Right_Sidebar />
      <div className='App'>
        Main area
      </div>
    </div>
  );
}

export default App;
