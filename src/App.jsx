import './App.css';

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
import { useQuiz } from './context/QuizContext';

function App() {
  const { status } = useQuiz();

  return (
    <>
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen />}
        {status === 'active' && (
          <>
            <Progress />
            <Question />
            <Footer>
              <NextButton />
              <Timer />
            </Footer>
          </>
        )}
        {status === 'finished' && <FinishScreen />}
      </Main>
    </>
  );
}

export default App;
