function Leaderboard() {
  const history =
    JSON.parse(
      localStorage.getItem(
        "quizHistory"
      )
    ) || [];

  const sorted =
    [...history].sort(
      (a, b) =>
        b.score - a.score
    );

  return (
    <div className="leaderboard-page">
      <h1>Leaderboard</h1>

      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>

        <tbody>
          {sorted.map(
            (user, index) => (
              <tr key={index}>
                <td>
                  {index + 1}
                </td>

                <td>
                  {user.name}
                </td>

                <td>
                  {user.score}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;