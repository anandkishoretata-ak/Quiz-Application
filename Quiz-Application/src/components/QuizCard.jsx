import { Link } from "react-router-dom";


function QuizCard({ quiz }) {
  return (
    <div className="quiz-card">
      <h2>{quiz.title}</h2>

      <p>Questions: {quiz.questions}</p>

      <p>Duration: {quiz.time}</p>

      
      <Link to="/quiz">
  <button>Start Quiz</button>
</Link>
    </div>
  );
}

export default QuizCard;