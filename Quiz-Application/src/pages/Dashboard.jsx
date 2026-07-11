import Navbar from "../components/Navbar";
import QuizCard from "../components/QuizCard";
import quizzes from "../data/questions";

function Dashboard() {
  return (
    <>
      <Navbar />

      <div className="dashboard">
        <h1>Available Quizzes</h1>

        <div className="quiz-container">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
