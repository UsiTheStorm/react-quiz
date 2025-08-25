import { useState, useEffect, useReducer } from 'react';

import './App.css';

// import questions from './questions.json';
import Header from './components/Header';
import Main from './components/Main';
import Loader from './components/Loader';
import Error from './components/Error';
import StartScreen from './components/StartScreen';

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
    case 'dataFailed':
      return {
        ...state,
        status: 'error',
      };
    default:
      throw new Error('Unknown action');
  }
}

function App() {
  const [{ questions, status }, dispatch] = useReducer(reducer, initialState);

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
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen questions={questions} />}
      </Main>
    </>
  );
}

export default App;
