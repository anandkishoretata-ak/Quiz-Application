import { useState, useEffect } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Question from "../components/Question";
import ProgressBar from "../components/ProgressBar";

function Quiz() {
  const navigate = useNavigate();
  const { category } = useParams();

  const [questions, setQuestions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] =
    useState({});

  const [timeLeft, setTimeLeft] =
    useState(60);

  useEffect(() => {
    fetchQuestions();
  }, [category]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/questions?category=${category}`
      );

      const data =
        await response.json();

      setQuestions(data);
      setCurrentQuestion(0);
      setAnswers({});
      setTimeLeft(60);
    } catch (error) {
      console.log(
        "Error fetching questions:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: option,
    }));
  };

  const submitQuiz = async () => {
    let score = 0;

    questions.forEach(
      (question, index) => {
        if (
          answers[index] ===
          question.answer
        ) {
          score++;
        }
      }
    );

    localStorage.setItem(
      "score",
      score
    );

    localStorage.setItem(
      "total",
      questions.length
    );

    try {
      const token =
        localStorage.getItem(
          "token"
        );

      await fetch(
        "http://localhost:5000/api/scores/save",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category,
            score,
            totalQuestions:
              questions.length,
          }),
        }
      );
    } catch (error) {
      console.log(error);
    }

    navigate("/result");
  };

  useEffect(() => {
    if (
      loading ||
      questions.length === 0
    )
      return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () =>
      clearInterval(timer);
  }, [loading, questions]);

  const nextQuestion = () => {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (prev) => prev + 1
      );
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (prev) => prev - 1
      );
    }
  };

  if (loading) {
    return (
      <h2>
        Loading Questions...
      </h2>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-page">
        <h2>
          No Questions Found For{" "}
          {category}
        </h2>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <h2>
        {category.toUpperCase()} Quiz
      </h2>

      <div className="timer">
        ⏳ Time Left: {timeLeft}s
      </div>

      <ProgressBar
        current={
          currentQuestion + 1
        }
        total={questions.length}
      />

      <Question
        question={
          questions[currentQuestion]
        }
        selectedAnswer={
          answers[currentQuestion]
        }
        handleAnswer={
          handleAnswer
        }
      />

      <div className="quiz-buttons">
        <button
          onClick={
            previousQuestion
          }
          disabled={
            currentQuestion === 0
          }
        >
          Previous
        </button>

        {currentQuestion ===
        questions.length - 1 ? (
          <button
            onClick={submitQuiz}
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={nextQuestion}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default Quiz;