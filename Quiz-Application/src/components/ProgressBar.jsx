function ProgressBar({
  current,
  total,
}) {
  const progress =
    (current / total) * 100;

  return (
    <div className="progress-container">
      <div
        className="progress-fill"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
}

export default ProgressBar;