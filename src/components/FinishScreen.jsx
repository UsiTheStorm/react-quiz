import React from 'react';

function FinishScreen({ points, maxPoints, highscore }) {
  const persentage = Math.round((points / maxPoints) * 100);

  let emoji;
  if (persentage === 100) emoji = '🥇';
  if (persentage >= 80) emoji = '🎉';
  if (persentage >= 50) emoji = '👌';
  if (persentage >= 0) emoji = '🤨';
  else emoji = '🙃';

  return (
    <>
      <p className="result">
        You scored <span>{emoji}</span> <strong>{points}</strong> out of {maxPoints} ({persentage}%)
      </p>
      <p className="highscore">(High Score: {highscore} points)</p>
    </>
  );
}

export default FinishScreen;
