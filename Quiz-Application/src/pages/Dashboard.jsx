import { useState } from "react";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import QuizCard from "../components/QuizCard";
import quizzes from "../data/quizzes";

function Dashboard() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [search, setSearch] =
    useState("");

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
        {/* Welcome Card */}
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
            {user?.name || "Student"}
          </h2>

          <p>
            Ready to test your
            skills?
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card">
            <h2>4</h2>
            <p>Total Quizzes</p>
          </div>

          <div className="stat-card">
            <h2>70+</h2>
            <p>Total Questions</p>
          </div>

          <div className="stat-card">
            <h2>100%</h2>
            <p>Learning</p>
          </div>
        </div>

        {/* Search Box */}
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

        <h1>Available Quizzes</h1>

        {/* Quiz Cards */}
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