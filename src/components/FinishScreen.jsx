import React from 'react';

function FinishScreen({ points, maxPoints }) {
  const persentage = Math.round((points / maxPoints) * 100);

  return (
    <p className="result">
      Tou scored <strong>{points}</strong> out of {maxPoints} ({persentage}%)
    </p>
  );
}

export default FinishScreen;
