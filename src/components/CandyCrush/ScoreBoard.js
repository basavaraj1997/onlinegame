import { useState, useEffect } from 'react';

const ScoreBoard = ({ score }) => {
  const [stars, setStars] = useState(0);
  const [congratulate, setCongratulate] = useState(false);

  useEffect(() => {
    if (score >= 100 && stars < 1) {
      setStars(1);
    } else if (score >= 200 && stars < 2) {
      setStars(2);
    } else if (score >= 300 && stars < 3) {
      setStars(3);
    } else if (score >= 500 && !congratulate) {
      setCongratulate(true);
    } else if (score >= 1000 && stars < 4) {
      setStars(4);
    } else if (score >= 1500 && !congratulate) {
      setCongratulate(true);
    }
  }, [score, stars, congratulate]);

  return (
    <div className="scoreBoard">
      <h3>Your Score: {score}</h3>
      <div>
        {[...Array(stars)].map((_, index) => (
          <span key={index} className="star">★</span>
        ))}
      </div>
      {congratulate && (
        <div className="congratulations">
          <p>Congratulations! You've reached a milestone!</p>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;
