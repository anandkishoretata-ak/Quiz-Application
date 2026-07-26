function History() {
  const history =
    JSON.parse(
      localStorage.getItem(
        "quizHistory"
      )
    ) || [];

  return (
    <div>
      <h1>Quiz History</h1>

      {history.map(
        (item, index) => (
          <div key={index}>
            <h3>
              {item.name}
            </h3>

            <p>
              Score:
              {item.score}/
              {item.total}
            </p>

            <p>{item.date}</p>
          </div>
        )
      )}
    </div>
  );
}

export default History;