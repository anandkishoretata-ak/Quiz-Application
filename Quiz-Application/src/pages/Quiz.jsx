import { useState, useEffect } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Question from "../components/Question";
import ProgressBar from "../components/ProgressBar";

import javaQuestions from "../data/javaQuestions";
import reactQuestions from "../data/reactQuestions";
import mernQuestions from "../data/mernQuestions";
import aptitudeQuestions from "../data/aptitudeQuestions";

function Quiz() {
  const navigate = useNavigate();
  const { category } = useParams();

  let questions = [];

  switch (category) {
    case "java":
      questions = javaQuestions;
      break;

    case "react":
      questions = reactQuestions;
      break;

    case "mern":
      questions = mernQuestions;
      break;

    case "aptitude":
      questions = aptitudeQuestions;
      break;

    default:
      questions = [];
  }

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] =
    useState({});

  const [timeLeft, setTimeLeft] =
    useState(60);

  const handleAnswer = (option) => {
    setAnswers({
      ...answers,
      [currentQuestion]: option,
    });
  };

  const submitQuiz = () => {
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

    navigate("/result");
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      submitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(
        (prev) => prev - 1
      );
    }, 1000);

    return () =>
      clearInterval(timer);
  }, [timeLeft]);

  const nextQuestion = () => {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        currentQuestion - 1
      );
    }
  };

  if (questions.length === 0) {
    return (
      <div className="quiz-page">
        <h2>
          No questions found for this
          category.
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
        handleAnswer={handleAnswer}
      />

      <div className="quiz-buttons">
        <button
          onClick={previousQuestion}
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