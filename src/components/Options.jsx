import { useQuiz } from '../context/QuizContext';

function Options() {
  const { question, dispatch, answer } = useQuiz();
  const hasAnswered = answer !== null;

  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          key={option}
          className={`btn btn-option 
                    ${index === answer ? 'answer' : ''} 
                    ${hasAnswered && index === question.correctOption ? 'correct' : ''} 
                    ${hasAnswered && index === answer && answer !== question.correctOption ? 'wrong' : ''}`}
          onClick={() => dispatch({ type: 'newAnswer', payload: index })}
          disabled={hasAnswered}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
