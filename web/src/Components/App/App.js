import React from 'react';
import './App.css';
import Left_Sidebar from '../Left-Sidebar/Left_Sidebar'
import Right_Sidebar from '../Right-Sidebar/Right-Sidebar.js'
import Header from '../Header/Header'
import Main from '../Main/Main'

function App() {
  return (
    <div className='main-content'>
      <Header />
      <Right_Sidebar />
      <Main />
      <Left_Sidebar />
    </div>
  );
}

export default App;
