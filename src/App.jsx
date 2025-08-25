import { useState, useEffect, useReducer } from 'react';

import './App.css';

// import questions from './questions.json';
import Header from './components/Header';
import Main from './components/Main';

const initialState = {
  questions: [],

  // 'loading' | 'error' | 'ready' | 'active' | 'finished'
  status: 'loading',
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready',
      };
    case 'dataFaild':
      return {
        ...state,
        status: 'error',
      };
    default:
      throw new Error('Unknown action');
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('http://localhost:3001/questions');

        if (!res.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await res.json();
        dispatch({ type: 'dataReceived', payload: data });
        console.log(data);
      } catch (err) {
        dispatch({ type: 'dataFailed' });
        console.error(err);
      }
    }

    fetchData();
  }, []);

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
