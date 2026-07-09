function Result() {
  const score =
    localStorage.getItem("score");

  return (
    <div className="result-page">
      <h1>Quiz Completed</h1>

      <h2>
        Your Score : {score} / 4
      </h2>
    </div>
  );
}

export default Result;