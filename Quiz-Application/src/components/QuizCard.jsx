import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function QuizCard({ quiz }) {
  return (
    <motion.div
      className="quiz-card"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <h2>{quiz.title}</h2>

      <p>
        <strong>Category:</strong> {quiz.category}
      </p>

      <p>
        <strong>Difficulty:</strong> {quiz.difficulty}
      </p>

      <p>
        <strong>Questions:</strong> {quiz.questions}
      </p>

      <p>
        <strong>Duration:</strong> {quiz.time} sec
      </p>

      <Link to={`/quiz/${quiz.id}`}>
        <button className="start-btn">
          Start Quiz
        </button>
      </Link>
    </motion.div>
  );
}

export default QuizCard;