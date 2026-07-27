import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function QuizCard({ quiz }) {
  return (
    <motion.div
      className="quiz-card"
      whileHover={{
        scale: 1.05,
      }}
      transition={{
        duration: 0.3,
      }}
    >
      <h2>{quiz.title}</h2>

      <p>
        Category: {quiz.category}
      </p>

      <p>
        Questions: {quiz.questions}
      </p>

      <p>
        Duration: {quiz.time}
      </p>

     <Link to={`/quiz/${quiz.id}`}>
      <button>
    Start Quiz
      </button>
   </Link>
    </motion.div>
  );
}

export default QuizCard;