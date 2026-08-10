import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Question from "../components/Question";
import ProgressBar from "../components/ProgressBar";

function Quiz() {
  const navigate = useNavigate();
  const { category } = useParams();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [submitting, setSubmitting] = useState(false);

  // --------------------------------------------------
  // FETCH QUESTIONS
  // --------------------------------------------------

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/questions?category=${encodeURIComponent(
          category
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid question data");
      }

      setQuestions(data);
      setCurrentQuestion(0);
      setAnswers({});
      setTimeLeft(60);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setQuestions([]);
      setError(
        "Unable to load questions. Please check that the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // --------------------------------------------------
  // SELECT ANSWER
  // --------------------------------------------------

  const handleAnswer = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: option,
    }));
  };

  // --------------------------------------------------
  // SUBMIT QUIZ
  // --------------------------------------------------

  const submitQuiz = useCallback(async () => {
    if (submitting || questions.length === 0) {
      return;
    }

    setSubmitting(true);

    let score = 0;

    questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        score++;
      }
    });

    // Save result locally
    localStorage.setItem("score", String(score));
    localStorage.setItem("total", String(questions.length));
    localStorage.setItem("category", category);

    // Save score to backend
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const response = await fetch(
          "http://localhost:5000/api/scores/save",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              category,
              score,
              totalQuestions: questions.length,
            }),
          }
        );

        if (!response.ok) {
          console.log("Score could not be saved to database");
        }
      }
    } catch (error) {
      console.error("Score Save Error:", error);
    }

    navigate("/result");
  }, [
    answers,
    category,
    navigate,
    questions,
    submitting,
  ]);

  // --------------------------------------------------
  // TIMER
  // --------------------------------------------------

  useEffect(() => {
    if (loading || questions.length === 0 || submitting) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          // Automatically submit when timer reaches zero
          submitQuiz();

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [
    loading,
    questions.length,
    submitting,
    submitQuiz,
  ]);

  // --------------------------------------------------
  // NEXT QUESTION
  // --------------------------------------------------

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  // --------------------------------------------------
  // PREVIOUS QUESTION
  // --------------------------------------------------

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="quiz-page">
        <div className="quiz-loading">
          <h2>Loading Questions...</h2>
          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error) {
    return (
      <div className="quiz-page">
        <div className="quiz-error">
          <h2>⚠️ Error</h2>

          <p>{error}</p>

          <button onClick={fetchQuestions}>
            Try Again
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            style={{ marginLeft: "10px" }}
          >
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // NO QUESTIONS
  // --------------------------------------------------

  if (questions.length === 0) {
    return (
      <div className="quiz-page">
        <div className="quiz-error">
          <h2>
            No Questions Found
          </h2>

          <p>
            No questions are available for{" "}
            <strong>{category}</strong>.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // CURRENT QUESTION
  // --------------------------------------------------

  const current = questions[currentQuestion];

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------

  return (
    <div className="quiz-page">
      <div className="quiz-wrapper">

        {/* Quiz Header */}
        <div className="quiz-header">
          <div>
            <h1>
              {category
                ? category.toUpperCase()
                : "QUIZ"}{" "}
              Quiz
            </h1>

            <p>
              Question {currentQuestion + 1} of{" "}
              {questions.length}
            </p>
          </div>

          {/* Timer */}
          <div
            className={`timer ${
              timeLeft <= 10
                ? "timer-danger"
                : ""
            }`}
          >
            ⏳ {timeLeft}s
          </div>
        </div>

        {/* Progress */}
        <ProgressBar
          current={currentQuestion + 1}
          total={questions.length}
        />

        {/* Question */}
        <div className="question-container">
          <Question
            question={current}
            selectedAnswer={
              answers[currentQuestion]
            }
            handleAnswer={handleAnswer}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="quiz-buttons">

          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
          >
            ← Previous
          </button>

          {currentQuestion ===
          questions.length - 1 ? (
            <button
              onClick={submitQuiz}
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Quiz ✓"}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
            >
              Next →
            </button>
          )}

        </div>

        {/* Answer Status */}
        <div className="answer-status">
          <p>
            Answered:{" "}
            {Object.keys(answers).length} /{" "}
            {questions.length}
          </p>
        </div>

      </div>
    </div>
  );
}

export default Quiz;