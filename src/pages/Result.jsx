import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import generatePdf from "../utils/generatePdf";
import generateCertificate from "../utils/generateCertificate";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Result() {
  const navigate = useNavigate();

  // =============================
  // GET DATA
  // =============================

  const score =
    Number(
      localStorage.getItem("score")
    ) || 0;

  const total =
    Number(
      localStorage.getItem("total")
    ) || 0;

  const category =
    localStorage.getItem(
      "category"
    ) || "Unknown";

  const user = JSON.parse(
    localStorage.getItem("user") ||
      "{}"
  );

  const percentage =
    total > 0
      ? (
          (score / total) *
          100
        ).toFixed(0)
      : 0;

  // =============================
  // CHART DATA
  // =============================

  const chartData = [
    {
      name: "Correct",
      value: score,
    },
    {
      name: "Wrong",
      value: total - score,
    },
  ];

  // =============================
  // SAVE DATA
  // =============================

  useEffect(() => {
    if (
      total <= 0 ||
      category === "Unknown"
    ) {
      return;
    }

    saveScore();
    saveHistory();
  }, []);

  // =============================
  // SAVE SCORE TO DATABASE
  // =============================

  const saveScore = async () => {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) return;

      const response =
        await fetch(
          "http://localhost:5000/api/scores/save",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
              category,
              score,
              totalQuestions:
                total,
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "Score Saved:",
        data
      );
    } catch (error) {
      console.log(
        "Score Save Error:",
        error
      );
    }
  };

  // =============================
  // SAVE LOCAL HISTORY
  // =============================

  const saveHistory = () => {
    const history =
      JSON.parse(
        localStorage.getItem(
          "quizHistory"
        )
      ) || [];

    const resultData = {
      name:
        user?.name || "Guest",

      category,

      score,

      total,

      percentage,

      date:
        new Date().toLocaleDateString(),
    };

    const alreadyExists =
      history.some(
        (item) =>
          item.category ===
            category &&
          item.score ===
            score &&
          item.date ===
            resultData.date
      );

    if (!alreadyExists) {
      history.push(resultData);

      localStorage.setItem(
        "quizHistory",
        JSON.stringify(history)
      );
    }
  };

  // =============================
  // BUTTON FUNCTIONS
  // =============================

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const goToLeaderboard =
    () => {
      navigate(
        "/leaderboard"
      );
    };

  const downloadPdf = () => {
    generatePdf(
      user,
      category,
      score,
      total
    );
  };

  const downloadCertificate =
    () => {
      generateCertificate(
        user,
        category,
        score,
        total
      );
    };

  // =============================
  // UI
  // =============================

  return (
    <div className="result-page">
      <div className="result-card">

        <h1>
          🎉 Quiz Completed
          Successfully
        </h1>

        <h2>
          Score: {score} / {total}
        </h2>

        <h3>
          Percentage:
          {" "}
          {percentage}%
        </h3>

        <h3>
          Category:
          {" "}
          {category}
        </h3>

        <h3>
          {percentage >= 50
            ? "Passed ✅"
            : "Failed ❌"}
        </h3>

        {/* Motivation */}

        <p
          style={{
            marginTop: "10px",
            fontWeight: "600",
            fontSize: "18px",
          }}
        >
          {percentage >= 80
            ? "🌟 Excellent Performance!"
            : percentage >= 50
            ? "👍 Good Job!"
            : "📚 Keep Practicing!"}
        </p>

        {/* Performance Chart */}

        <div
          style={{
            width: "100%",
            height: "300px",
            marginTop: "30px",
          }}
        >
          <h3>
            📊 Performance
            Chart
          </h3>

          <ResponsiveContainer
            width="100%"
            height="85%"
          >
            <BarChart
              data={chartData}
            >
              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                radius={[
                  8,
                  8,
                  0,
                  0,
                ]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Buttons */}

        <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent:
              "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={
              goToDashboard
            }
          >
            🏠 Dashboard
          </button>

          <button
            onClick={
              goToLeaderboard
            }
          >
            🏆 Leaderboard
          </button>

          <button
            onClick={
              downloadPdf
            }
          >
            📄 Download PDF
          </button>

          <button
            onClick={
              downloadCertificate
            }
          >
            🏅 Certificate
          </button>
        </div>

      </div>
    </div>
  );
}

export default Result;