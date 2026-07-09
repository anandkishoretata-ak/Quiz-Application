function Question({
  question,
  selectedAnswer,
  handleAnswer,
}) {
  return (
    <div className="question-card">
      <h2>{question.question}</h2>

      {question.options.map((option) => (
        <button
          key={option}
          className={
            selectedAnswer === option
              ? "option selected"
              : "option"
          }
          onClick={() => handleAnswer(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Question;