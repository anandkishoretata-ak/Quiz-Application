import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Profile() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setScores([]);
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/scores/my-scores",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("PROFILE API RESPONSE:", data);

      if (response.ok && Array.isArray(data)) {
        // Remove invalid 0/0 records
        const validScores = data.filter(
          (item) =>
            Number(item.totalQuestions) > 0
        );

        setScores(validScores);
      } else {
        setScores([]);
      }
    } catch (error) {
      console.log(
        "Profile Fetch Error:",
        error
      );

      setScores([]);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // BEST SCORE
  // -----------------------------

  const highestScore =
    scores.length > 0
      ? Math.max(
          ...scores.map(
            (item) =>
              Number(item.score) || 0
          )
        )
      : 0;

  // -----------------------------
  // PERCENTAGES
  // -----------------------------

  const percentages = scores
    .filter(
      (item) =>
        Number(item.totalQuestions) > 0
    )
    .map((item) => {
      const score =
        Number(item.score) || 0;

      const total =
        Number(item.totalQuestions);

      return (score / total) * 100;
    });

  // -----------------------------
  // AVERAGE SCORE
  // -----------------------------

  const averageScore =
    percentages.length > 0
      ? (
          percentages.reduce(
            (sum, value) =>
              sum + value,
            0
          ) / percentages.length
        ).toFixed(0)
      : 0;

  return (
    <>
      <Navbar />

      <div className="profile-page">

        {/* PAGE TITLE */}

        <h1>
          👤 My Profile
        </h1>

        {/* PROFILE CARD */}

        <div className="profile-card">

          <h2>
            {user?.name || "Student"}
          </h2>

          <p>
            {user?.email || "No Email"}
          </p>

          {/* PROFILE STATS */}

          <div className="profile-stats">

            {/* QUIZZES ATTEMPTED */}

            <div className="profile-stat">
              <h3>
                {scores.length}
              </h3>

              <p>
                Quizzes Attempted
              </p>
            </div>

            {/* BEST SCORE */}

            <div className="profile-stat">
              <h3>
                {highestScore}
              </h3>

              <p>
                Best Score
              </p>
            </div>

            {/* AVERAGE SCORE */}

            <div className="profile-stat">
              <h3>
                {averageScore}%
              </h3>

              <p>
                Average Score
              </p>
            </div>

          </div>
        </div>

        {/* QUIZ HISTORY */}

        <h2 className="history-title">
          Quiz History
        </h2>

        {loading ? (
          <h3>
            Loading...
          </h3>
        ) : scores.length === 0 ? (
          <h3>
            No Quiz History Found
          </h3>
        ) : (
          <table className="history-table">

            <thead>
              <tr>
                <th>Quiz</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              {scores.map((score) => {

                const scoreValue =
                  Number(score.score) || 0;

                const totalQuestions =
                  Number(
                    score.totalQuestions
                  );

                const percentage =
                  totalQuestions > 0
                    ? (
                        (scoreValue /
                          totalQuestions) *
                        100
                      ).toFixed(0)
                    : 0;

                return (
                  <tr
                    key={score._id}
                  >

                    <td>
                      {score.category}
                    </td>

                    <td>
                      {scoreValue}/
                      {totalQuestions}
                    </td>

                    <td>
                      {percentage}%
                    </td>

                    <td>
                      {score.createdAt
                        ? new Date(
                            score.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>
        )}
      </div>
    </>
  );
}

export default Profile;