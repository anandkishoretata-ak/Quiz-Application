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

  const score = Number(
    localStorage.getItem("score")
  );

  const total =
    Number(
      localStorage.getItem("total")
    ) || 0;

  const percentage = (
    (score / total) *
    100
  ).toFixed(0);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const category =
    localStorage.getItem(
      "category"
    ) || "General";

  const chartData = [
    {
      name: "Score",
      Value: score,
    },
    {
      name: "Total",
      Value: total,
    },
  ];

  useEffect(() => {
    saveScore();
    saveHistory();
  }, []);

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

  const saveHistory = () => {
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

    const alreadyExists =
      history.some(
        (item) =>
          item.score ===
            score &&
          item.category ===
            category &&
          item.date ===
            resultData.date
      );

    if (!alreadyExists) {
      history.push(
        resultData
      );

      localStorage.setItem(
        "quizHistory",
        JSON.stringify(
          history
        )
      );
    }
  };

  return (
    <div className="result-page">
      <div className="result-card">
        <h1>
          🎉 Quiz Completed
        </h1>

        <h2>
          Score: {score} /{" "}
          {total}
        </h2>

        <h3>
          Percentage:{" "}
          {percentage}%
        </h3>

        <h3>
          Category:{" "}
          {category}
        </h3>

        <h3>
          {percentage >= 50
            ? "Passed ✅"
            : "Failed ❌"}
        </h3>

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
            height="100%"
          >
            <BarChart
              data={
                chartData
              }
            >
              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="Value"
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
            marginTop:
              "30px",
          }}
        >
          <button
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              navigate(
                "/leaderboard"
              )
            }
            style={{
              marginLeft:
                "10px",
            }}
          >
            Leaderboard
          </button>

          <button
            onClick={() =>
              generatePdf(
                user,
                category,
                score,
                total
              )
            }
            style={{
              marginLeft:
                "10px",
            }}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;