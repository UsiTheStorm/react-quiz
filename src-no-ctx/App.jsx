import { useState, useEffect, useReducer } from 'react';

import './App.css';
import questionsData from '../data/questions.json';

import Header from './components/Header';
import Main from './components/Main';
import Loader from './components/Loader';
import Error from './components/Error';
import StartScreen from './components/StartScreen';
import FinishScreen from './components/FinishScreen';
import Question from './components/Question';
import NextButton from './components/NextButton';
import Timer from './components/Timer';
import Progress from './components/Progress';
import Footer from './components/Footer';

import { useFetchQuestions } from './hooks/UseFetchQuestions';

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],

  // 'loading' | 'error' | 'ready' | 'active' | 'finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
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
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
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
    case 'nextQuestion': {
      const nextIndex = Math.min(state.index + 1, state.questions.length - 1);

      return {
        ...state,
        index: nextIndex,
        answer: null,
      };
    }
    case 'finish':
      return {
        ...state,
        status: 'finished',
        highscore: state.points > state.highscore ? state.points : state.highscore,
      };
    case 'restart':
      return {
        ...initialState,
        questions: state.questions,
        status: 'ready',
        highscore: state.highscore,
      };
    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining < 2 ? 'finished' : state.status,
      };
    default:
      throw new Error('Unknown action');
  }
}

function App() {
  const [{ questions, status, index, answer, points, highscore, secondsRemaining }, dispatch] =
    useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  //! Fetch from local hosed api
  // useFetchQuestions(dispatch, 'http://localhost:3001/questions');

  // Local data for github deploy
  useEffect(() => {
    setTimeout(() => {
      try {
        dispatch({ type: 'dataReceived', payload: questionsData.questions });
      } catch (err) {
        dispatch({ type: 'dataFailed' });
        console.error(err);
      }
    }, 1000);
  }, [dispatch]);

  return (
    <>
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
        {status === 'active' && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPoints={maxPossiblePoints}
              answer={answer}
            />
            <Question question={questions[index]} dispatch={dispatch} answer={answer} />
            <Footer>
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
            </Footer>
          </>
        )}
        {status === 'finished' && (
          <FinishScreen
            points={points}
            maxPoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </>
  );
}

export default App;
