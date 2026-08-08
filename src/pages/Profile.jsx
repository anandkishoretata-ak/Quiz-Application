import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Profile() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [scores, setScores] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      console.log(
        "TOKEN:",
        token
      );

      if (!token) {
        setScores([]);
        setLoading(false);
        return;
      }

      const res = await fetch(
        "http://localhost:5000/api/scores/my-scores",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await res.json();

      console.log(
        "API RESPONSE:",
        data
      );

      if (
        res.ok &&
        Array.isArray(data)
      ) {
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

  const highestScore =
    scores.length > 0
      ? Math.max(
          ...scores.map(
            (s) => s.score
          )
        )
      : 0;

  const averageScore =
    scores.length > 0
      ? (
          scores.reduce(
            (sum, score) =>
              sum +
              (score.score /
                score.totalQuestions) *
                100,
            0
          ) / scores.length
        ).toFixed(0)
      : 0;

  return (
    <>
      <Navbar />

      <div className="profile-page">
        <h1>
          👤 My Profile
        </h1>

        <div className="profile-card">
          <h2>
            {user?.name ||
              "Student"}
          </h2>

          <p>
            {user?.email}
          </p>

          <div className="profile-stats">
            <div>
              <h3>
                {scores.length}
              </h3>
              <p>
                Quizzes Attempted
              </p>
            </div>

            <div>
              <h3>
                {highestScore}
              </h3>
              <p>
                Best Score
              </p>
            </div>

            <div>
              <h3>
                {averageScore}%
              </h3>
              <p>
                Average Score
              </p>
            </div>
          </div>
        </div>

        <h2>
          Quiz History
        </h2>

        {loading ? (
          <h3>
            Loading...
          </h3>
        ) : scores.length >
          0 ? (
          <table className="history-table">
            <thead>
              <tr>
                <th>Quiz</th>
                <th>Score</th>
                <th>
                  Percentage
                </th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {scores.map(
                (score) => (
                  <tr
                    key={
                      score._id
                    }
                  >
                    <td>
                      {
                        score.category
                      }
                    </td>

                    <td>
                      {
                        score.score
                      }
                      /
                      {
                        score.totalQuestions
                      }
                    </td>

                    <td>
                      {(
                        (score.score /
                          score.totalQuestions) *
                        100
                      ).toFixed(
                        0
                      )}
                      %
                    </td>

                    <td>
                      {new Date(
                        score.createdAt
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        ) : (
          <h3>
            No Quiz
            History Found
          </h3>
        )}
      </div>
    </>
  );
}

export default Profile;