import { useState, useEffect, useReducer } from 'react';

import './App.css';

// import questions from './questions.json';
import Header from './components/Header';
import Main from './components/Main';
import Loader from './components/Loader';
import Error from './components/Error';
import StartScreen from './components/StartScreen';
import Question from './components/Question';
import NextButton from './components/NextButton';

const initialState = {
  questions: [],

  // 'loading' | 'error' | 'ready' | 'active' | 'finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
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
    case 'start':
      return {
        ...state,
        status: 'active',
      };
    case 'newAnswer': {
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption ? state.points + question.points : state.points,
      };
    }
    case 'nextQuestion':
      return {
        ...state,
        index: state.index + 1,
      };
    default:
      throw new Error('Unknown action');
  }
}

function App() {
  const [{ questions, status, index, answer, points }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  const numQuestions = questions.length;

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
        {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
        {status === 'active' && (
          <Question question={questions[index]} dispatch={dispatch} answer={answer} />
        )}
        <NextButton dispatch={dispatch} answer={answer} />
      </Main>
    </>
  );
}

export default App;
