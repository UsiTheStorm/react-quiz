import { useState } from 'react';

import './App.css';

import questions from './questions.json';
import Header from './components/Header';
import Main from './components/Main';

function App() {
  return (
    <>
      <Header />
      <Main>
        <h2>Hello</h2>
      </Main>
    </>
  );
}

export default App;
