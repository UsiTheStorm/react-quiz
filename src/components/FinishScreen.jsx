import { useQuiz } from '../context/QuizContext';

function FinishScreen() {
  const { points, maxPoints, highscore, dispatch } = useQuiz();

  const persentage = Math.round((points / maxPoints) * 100);

  let emoji;
  if (persentage === 100) {
    emoji = '🥇';
  } else if (persentage >= 80) {
    emoji = '🎉';
  } else if (persentage >= 50) {
    emoji = '👌';
  } else {
    emoji = '🙃';
  }

  return (
    <>
      <p className="result">
        You scored <span>{emoji}</span> <strong>{points}</strong> out of {maxPoints} ({persentage}%)
      </p>
      <p className="highscore">(High Score: {highscore} points)</p>
      <button className="btn btn-ui" onClick={() => dispatch({ type: 'restart' })}>
        Restart
      </button>
    </>
  );
}

export default FinishScreen;
