import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <h1>Quiz Master</h1>

      <p>Test Your Skills and Knowledge</p>

      <button
        onClick={() => navigate("/dashboard")}
      >
        Explore Quizzes
      </button>
    </div>
  );
}

export default Home;