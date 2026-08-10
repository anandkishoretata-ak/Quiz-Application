import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import generatePdf from "../utils/generatePdf";

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

  // -----------------------------
  // GET DATA
  // -----------------------------

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
    );

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // -----------------------------
  // SAFE CATEGORY
  // -----------------------------

  const quizCategory =
    category || "Unknown";

  // -----------------------------
  // SAFE PERCENTAGE
  // -----------------------------

  const percentage =
    total > 0
      ? (
          (score / total) *
          100
        ).toFixed(0)
      : 0;

  // -----------------------------
  // CHART DATA
  // -----------------------------

  const chartData = [
    {
      name: "Correct",
      value: score,
    },
    {
      name: "Total",
      value: total,
    },
  ];

  // -----------------------------
  // SAVE RESULT
  // -----------------------------

  useEffect(() => {

    // Do not save invalid results
    if (
      total <= 0 ||
      !category
    ) {
      console.log(
        "Invalid quiz result. Nothing saved."
      );

      return;
    }

    saveScore();
    saveHistory();

  }, []);

  // -----------------------------
  // SAVE SCORE TO MONGODB
  // -----------------------------

  const saveScore = async () => {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        console.log(
          "No token found."
        );
        return;
      }

      if (total <= 0) {
        console.log(
          "Invalid total questions."
        );
        return;
      }

      if (!category) {
        console.log(
          "Invalid category."
        );
        return;
      }

      const response =
        await fetch(
          "http://localhost:5000/api/scores/save",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
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

  // -----------------------------
  // SAVE LOCAL HISTORY
  // -----------------------------

  const saveHistory = () => {

    if (
      total <= 0 ||
      !category
    ) {
      return;
    }

    const history =
      JSON.parse(
        localStorage.getItem(
          "quizHistory"
        )
      ) || [];

    const resultData = {
      name:
        user?.name ||
        "Guest",

      category,

      score,

      total,

      percentage,

      date:
        new Date().toLocaleDateString(),
    };

    history.push(
      resultData
    );

    localStorage.setItem(
      "quizHistory",
      JSON.stringify(
        history
      )
    );
  };

  // -----------------------------
  // DASHBOARD
  // -----------------------------

  const goToDashboard = () => {
    navigate(
      "/dashboard"
    );
  };

  // -----------------------------
  // LEADERBOARD
  // -----------------------------

  const goToLeaderboard = () => {
    navigate(
      "/leaderboard"
    );
  };

  // -----------------------------
  // PDF
  // -----------------------------

  const downloadPdf = () => {

    if (total <= 0) {
      alert(
        "Invalid quiz result."
      );
      return;
    }

    generatePdf(
      user,
      quizCategory,
      score,
      total
    );
  };

  // -----------------------------
  // RESULT PAGE
  // -----------------------------

  return (
    <div className="result-page">

      <div className="result-card">

        <h1>
          🎉 Quiz Completed
        </h1>

        <h2>
          Score:{" "}
          {score} / {total}
        </h2>

        <h3>
          Percentage:{" "}
          {percentage}%
        </h3>

        <h3>
          Category:{" "}
          {quizCategory}
        </h3>

        <h3>
          {percentage >= 50
            ? "Passed ✅"
            : "Failed ❌"}
        </h3>

        {/* -------------------------
             PERFORMANCE CHART
        -------------------------- */}

        <div
          style={{
            width: "100%",
            height: "300px",
            marginTop: "30px",
          }}
        >

          <h3>
            📊 Performance Chart
          </h3>

          <ResponsiveContainer
            width="100%"
            height="85%"
          >

            <BarChart
              data={chartData}
            >

              <XAxis
                dataKey="name"
              />

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

        {/* -------------------------
             BUTTONS
        -------------------------- */}

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

        </div>

      </div>

    </div>
  );
}

export default Result;