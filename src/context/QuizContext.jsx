import { createContext, use, useContext, useEffect, useMemo, useReducer } from 'react';

import questionsData from '../data/questions.json';

import { useFetchQuestions } from './hooks/UseFetchQuestions';

const QuizContext = createContext();

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

function QuizProvider({ children }) {
  const [{ questions, status, index, answer, points, highscore, secondsRemaining }, dispatch] =
    useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  //! Fetch from local hosed api
  // useFetchQuestions(dispatch, 'http://localhost:3001/questions');

  //! Local data for github deploy
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

  const value = useMemo(
    () => ({
      questions,
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
      numQuestions,
      maxPossiblePoints,
      dispatch,
    }),
    [
      questions,
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
      numQuestions,
      maxPossiblePoints,
      dispatch,
    ],
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuiz must be used within a QuizProvider');
  return context;
}

export { QuizProvider, useQuiz };
