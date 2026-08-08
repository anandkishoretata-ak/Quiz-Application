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

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchQuizData();
    fetchUserStats();
  }, []);

  // Fetch Questions
  const fetchQuizData = async () => {
    try {
      const res = await api.get(
        "/questions"
      );

      const questions = res.data;

      setTotalQuestions(
        questions.length
      );

      const categories = [
        ...new Set(
          questions.map(
            (q) => q.category
          )
        ),
      ];

      const quizData =
        categories.map(
          (category) => {
            let image = reactImg;

            switch (
              category.toLowerCase()
            ) {
              case "react":
                image = reactImg;
                break;

              case "java":
                image = javaImg;
                break;

              case "mern":
                image = mernImg;
                break;

              case "aptitude":
                image =
                  aptitudeImg;
                break;

              default:
                image = reactImg;
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

      setQuizzes(quizData);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch User Stats
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
                      s.score
                  )
                )
              : 0;

          setHighestScore(
            maxScore
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  const filteredQuizzes =
    quizzes.filter((quiz) =>
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
        >
          <h2>
            Welcome,
            {" "}
            {user?.name ||
              "Student"}
          </h2>

          <p>
            Ready to test your
            skills?
          </p>
        </motion.div>

        {/* Stats */}

        <div className="stats-container">

          <div className="stat-card">
            <h2>
              {quizzes.length}
            </h2>
            <p>
              Total Quizzes
            </p>
          </div>

          <div className="stat-card">
            <h2>
              {totalQuestions}
            </h2>
            <p>
              Total Questions
            </p>
          </div>

          <div className="stat-card">
            <h2>
              {attempted}
            </h2>
            <p>
              Attempted
            </p>
          </div>

          <div className="stat-card">
            <h2>
              {highestScore}
            </h2>
            <p>
              Highest Score
            </p>
          </div>

        </div>

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
              (quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
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