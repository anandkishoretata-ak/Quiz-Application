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

  const [search, setSearch] =
    useState("");

  const [quizzes, setQuizzes] =
    useState([]);

  const [totalQuestions, setTotalQuestions] =
    useState(0);

  useEffect(() => {
    fetchQuizData();
  }, []);

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
            let image =
              reactImg;

            if (
              category.toLowerCase() ===
              "react"
            ) {
              image =
                reactImg;
            } else if (
              category.toLowerCase() ===
              "java"
            ) {
              image =
                javaImg;
            } else if (
              category.toLowerCase() ===
              "mern"
            ) {
              image =
                mernImg;
            } else if (
              category.toLowerCase() ===
              "aptitude"
            ) {
              image =
                aptitudeImg;
            }

            return {
              id: category.toLowerCase(),
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
            Ready to test your
            skills?
          </p>
        </motion.div>

        <div className="stats-container">
          <div className="stat-card">
            <h2>
              {quizzes.length}
            </h2>
            <p>Total Quizzes</p>
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
            <h2>100%</h2>
            <p>Learning</p>
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
      </div>
    </>
  );
}

export default Dashboard;