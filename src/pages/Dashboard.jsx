import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import QuizCard from "../components/QuizCard";
import api from "../api/axios";

import reactImg from "../assets/quizzes/react.png";
import javaImg from "../assets/quizzes/nodejs.png";
import mernImg from "../assets/quizzes/mern.png";
import aptitudeImg from "../assets/quizzes/aptitude.png";

function Dashboard() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const token =
    localStorage.getItem("token");

  const [search, setSearch] =
    useState("");

  const [quizzes, setQuizzes] =
    useState([]);

  const [totalQuestions, setTotalQuestions] =
    useState(0);

  const [attempted, setAttempted] =
    useState(0);

  const [highestScore, setHighestScore] =
    useState(0);

  const [averageScore, setAverageScore] =
    useState(0);

  const [latestQuiz, setLatestQuiz] =
    useState("None");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchQuizData();
    fetchUserStats();
  }, []);

  // =====================
  // FETCH QUIZZES
  // =====================

  const fetchQuizData = async () => {
    try {
      const res =
        await api.get(
          "/questions"
        );

      const questions =
        res.data;

      setTotalQuestions(
        questions.length
      );

      const categories = [
        ...new Set(
          questions.map(
            (q) =>
              q.category
          )
        ),
      ];

      const quizData =
        categories.map(
          (category) => {
            let image =
              reactImg;

            switch (
              category.toLowerCase()
            ) {
              case "react":
                image =
                  reactImg;
                break;

              case "java":
                image =
                  javaImg;
                break;

              case "mern":
                image =
                  mernImg;
                break;

              case "aptitude":
                image =
                  aptitudeImg;
                break;

              default:
                image =
                  reactImg;
            }

            return {
              id:
                category.toLowerCase(),
              title: `${category} Quiz`,
              category,
              difficulty:
                "Medium",
              questions:
                questions.filter(
                  (q) =>
                    q.category ===
                    category
                ).length,
              time: 60,
              image,
            };
          }
        );

      setQuizzes(
        quizData
      );
    } catch (error) {
      console.log(error);
    }
  };

  // =====================
  // FETCH USER STATS
  // =====================

  const fetchUserStats =
    async () => {
      try {
        const res =
          await fetch(
            "http://localhost:5000/api/scores/my-scores",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const data =
          await res.json();

        if (
          res.ok &&
          Array.isArray(data)
        ) {
          setAttempted(
            data.length
          );

          const maxScore =
            data.length > 0
              ? Math.max(
                  ...data.map(
                    (s) =>
                      Number(
                        s.score
                      ) || 0
                  )
                )
              : 0;

          setHighestScore(
            maxScore
          );

          const percentages =
            data.map(
              (item) =>
                item.totalQuestions >
                0
                  ? (
                      item.score /
                      item.totalQuestions
                    ) *
                    100
                  : 0
            );

          const avg =
            percentages.length >
            0
              ? (
                  percentages.reduce(
                    (
                      sum,
                      value
                    ) =>
                      sum +
                      value,
                    0
                  ) /
                  percentages.length
                ).toFixed(0)
              : 0;

          setAverageScore(
            avg
          );

          const latest =
            data[
              data.length - 1
            ];

          if (latest) {
            setLatestQuiz(
              latest.category
            );
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  // =====================
  // SEARCH FILTER
  // =====================

  const filteredQuizzes =
    quizzes.filter(
      (quiz) =>
        quiz.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (
    <>
      <Navbar />

      <div className="dashboard">

        <motion.div
          className="welcome-card"
          initial={{
            opacity: 0,
            y: -50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          <h2>
            Welcome,{" "}
            {user?.name ||
              "Student"}
          </h2>

          <p>
            Ready to test
            your skills?
          </p>
        </motion.div>

        {/* Statistics */}

        <div className="stats-container">

          <div className="stat-card">
            <h2>
              {
                quizzes.length
              }
            </h2>
            <p>
              Total Quizzes
            </p>
          </div>

          <div className="stat-card">
            <h2>
              {
                totalQuestions
              }
            </h2>
            <p>
              Questions
            </p>
          </div>

          <div className="stat-card">
            <h2>
              {attempted}
            </h2>
            <p>
              Attempts
            </p>
          </div>

          <div className="stat-card">
            <h2>
              {
                highestScore
              }
            </h2>
            <p>
              Best Score
            </p>
          </div>

          <div className="stat-card">
            <h2>
              {
                averageScore
              }
              %
            </h2>
            <p>
              Average
            </p>
          </div>

          <div className="stat-card">
            <h2>
              {
                latestQuiz
              }
            </h2>
            <p>
              Latest Quiz
            </p>
          </div>

        </div>

        {/* Search */}

        <input
          className="search-box"
          type="text"
          placeholder="Search Quiz..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <h1>
          Available Quizzes
        </h1>

        {loading ? (
          <h2>
            Loading...
          </h2>
        ) : (
          <div className="quiz-container">
            {filteredQuizzes.map(
              (
                quiz
              ) => (
                <QuizCard
                  key={
                    quiz.id
                  }
                  quiz={
                    quiz
                  }
                />
              )
            )}
          </div>
        )}

      </div>
    </>
  );
}

export default Dashboard;