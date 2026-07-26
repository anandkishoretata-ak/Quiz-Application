import { useState } from "react";
import { useNavigate } from "react-router-dom";

import questions from "../data/questions";
import Question from "../components/Question";

function Quiz() {
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] = useState({});

  const handleAnswer = (option) => {
    setAnswers({
      ...answers,
      [currentQuestion]: option,
    });
  };

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

  const submitQuiz = () => {
    let score = 0;

    questions.forEach((question, index) => {
      if (
        answers[index] === question.answer
      ) {
        score++;
      }
    });

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

  return (
    <div className="quiz-page">
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
          <button onClick={nextQuestion}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default Quiz;