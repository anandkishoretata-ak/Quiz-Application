import { useNavigate } from "react-router-dom";

function Result() {
  const navigate = useNavigate();

  const score = Number(
    localStorage.getItem("score")
  );

  const total = Number(
    localStorage.getItem("total")
  ) || 4;

  const percentage = (
    (score / total) *
    100
  ).toFixed(0);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const history =
    JSON.parse(
      localStorage.getItem(
        "quizHistory"
      )
    ) || [];

  const resultData = {
    name: user?.name || "Guest",
    score,
    total,
    percentage,
    date: new Date().toLocaleDateString(),
  };

  const alreadyExists =
    history.some(
      (item) =>
        item.score === score &&
        item.date === resultData.date
    );

  if (!alreadyExists) {
    history.push(resultData);

    localStorage.setItem(
      "quizHistory",
      JSON.stringify(history)
    );
  }

  const restartQuiz = () => {
    navigate("/quiz");
  };

  const goToLeaderboard = () => {
    navigate("/leaderboard");
  };

  return (
    <div className="result-page">
      <div className="result-card">
        <h1>Quiz Completed 🎉</h1>

        <h2>
          Score: {score} / {total}
        </h2>

        <h3>
          Percentage: {percentage}%
        </h3>

        <h3>
          {percentage >= 50
            ? "Passed ✅"
            : "Failed ❌"}
        </h3>

        <div
          style={{
            marginTop: "20px",
          }}
        >
          <button
            onClick={restartQuiz}
          >
            Restart Quiz
          </button>

          <button
            onClick={
              goToLeaderboard
            }
            style={{
              marginLeft: "10px",
            }}
          >
            Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;