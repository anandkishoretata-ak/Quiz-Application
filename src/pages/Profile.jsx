import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Profile() {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const token =
        localStorage.getItem("token");

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

      const data =
        await response.json();

      if (
        response.ok &&
        Array.isArray(data)
      ) {
        const validScores = data
          .filter(
            (item) =>
              Number(
                item.totalQuestions
              ) > 0
          )
          .sort(
            (a, b) =>
              new Date(
                b.createdAt
              ) -
              new Date(
                a.createdAt
              )
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
  // BEST SCORE %
  // -----------------------------

  const highestScore =
    scores.length > 0
      ? Math.max(
          ...scores.map(
            (item) =>
              (Number(item.score) /
                Number(
                  item.totalQuestions
                )) *
              100
          )
        ).toFixed(0)
      : 0;

  // -----------------------------
  // AVERAGE SCORE %
  // -----------------------------

  const averageScore =
    scores.length > 0
      ? (
          scores.reduce(
            (sum, item) =>
              sum +
              (Number(item.score) /
                Number(
                  item.totalQuestions
                )) *
                100,
            0
          ) / scores.length
        ).toFixed(0)
      : 0;

  // -----------------------------
  // PASSED QUIZZES
  // -----------------------------

  const passedQuizzes =
    scores.filter(
      (item) =>
        (Number(item.score) /
          Number(
            item.totalQuestions
          )) *
          100 >=
        50
    ).length;

  // -----------------------------
  // FAILED QUIZZES
  // -----------------------------

  const failedQuizzes =
    scores.length -
    passedQuizzes;

  // -----------------------------
  // LAST ATTEMPT
  // -----------------------------

  const lastAttempt =
    scores.length > 0
      ? new Date(
          scores[0].createdAt
        ).toLocaleDateString()
      : "N/A";

  // -----------------------------
  // RECENT CATEGORY
  // -----------------------------

  const recentCategory =
    scores.length > 0
      ? scores[0].category
      : "N/A";

  // -----------------------------
  // PERFORMANCE LEVEL
  // -----------------------------

  let performanceLevel =
    "Beginner";

  if (
    Number(averageScore) >= 80
  ) {
    performanceLevel =
      "Expert";
  } else if (
    Number(averageScore) >= 60
  ) {
    performanceLevel =
      "Intermediate";
  }

  return (
    <>
      <Navbar />

      <div className="profile-page">

        <h1>
          👤 My Profile
        </h1>

        {/* Profile Card */}

        <div className="profile-card">

          <h2>
            {user?.name ||
              "Student"}
          </h2>

          <p>
            {user?.email ||
              "No Email"}
          </p>

          <div className="profile-stats">

            <div className="profile-stat">
              <h3>
                {scores.length}
              </h3>
              <p>
                Quizzes Attempted
              </p>
            </div>

            <div className="profile-stat">
              <h3>
                {highestScore}%
              </h3>
              <p>
                Best Score
              </p>
            </div>

            <div className="profile-stat">
              <h3>
                {averageScore}%
              </h3>
              <p>
                Average Score
              </p>
            </div>

            <div className="profile-stat">
              <h3>
                {performanceLevel}
              </h3>
              <p>
                Level
              </p>
            </div>

          </div>

        </div>

        {/* Statistics */}

        <div className="profile-card">

          <h2>
            📊 Statistics
          </h2>

          <p>
            ✅ Passed Quizzes:
            <strong>
              {" "}
              {passedQuizzes}
            </strong>
          </p>

          <p>
            ❌ Failed Quizzes:
            <strong>
              {" "}
              {failedQuizzes}
            </strong>
          </p>

          <p>
            📚 Recent Category:
            <strong>
              {" "}
              {recentCategory}
            </strong>
          </p>

          <p>
            🕒 Last Attempt:
            <strong>
              {" "}
              {lastAttempt}
            </strong>
          </p>

        </div>

        {/* Quiz History */}

        <h2 className="history-title">
          Quiz History
        </h2>

        {loading ? (
          <h3>Loading...</h3>
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
              {scores.map(
                (score) => {
                  const percentage =
                    (
                      (Number(
                        score.score
                      ) /
                        Number(
                          score.totalQuestions
                        )) *
                      100
                    ).toFixed(0);

                  return (
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
                        {percentage}%
                      </td>

                      <td>
                        {new Date(
                          score.createdAt
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>

          </table>
        )}
      </div>
    </>
  );
}

export default Profile;