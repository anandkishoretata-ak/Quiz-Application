import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  return (
    <div className="hero">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to <span>Quiz Master</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Improve your skills with Java, React, MERN and Aptitude quizzes.
        Track your progress and compete on the leaderboard.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Link to="/login">
          <button>Get Started</button>
        </Link>
      </motion.div>
    </div>
  );
}

export default Home;