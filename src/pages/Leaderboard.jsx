import { useEffect, useState } from "react";

function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/scores/leaderboard"
      );

      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        setScores(data);
      } else {
        setScores([]);
      }
    } catch (error) {
      console.log(error);
      setScores([]);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  return (
    <div className="leaderboard-page">
      <h1>🏆 Leaderboard</h1>

      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Quiz</th>
              <th>Score</th>
              <th>Percentage</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {scores.length > 0 ? (
              scores.map((score, index) => {
                const percentage = (
                  (score.score / score.totalQuestions) *
                  100
                ).toFixed(0);

                return (
                  <tr key={score._id}>
                    <td>{getRankBadge(index + 1)}</td>

                    <td>
                      {score.user?.name || "Unknown"}
                    </td>

                    <td>{score.category}</td>

                    <td>
                      {score.score}/
                      {score.totalQuestions}
                    </td>

                    <td>{percentage}%</td>

                    <td>
                      {new Date(
                        score.createdAt
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                  }}
                >
                  No Scores Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;