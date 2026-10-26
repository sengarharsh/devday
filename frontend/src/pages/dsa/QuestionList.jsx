const QuestionList = ({
  questions,
  emptyMessage,
  onToggleComplete,
  onToggleBookmark,
  onDelete,
  processingId,
}) => {
  if (questions.length === 0) {
    return <div className="text-center py-5 text-muted">{emptyMessage}</div>;
  }

  const difficultyBadge = (difficulty) => {
    const colors = {
      easy: "bg-success",
      medium: "bg-warning text-dark",
      hard: "bg-danger",
    };
    return colors[difficulty?.toLowerCase()] || "bg-secondary";
  };

  return (
    <div className="d-flex flex-column gap-2">
      {questions.map((q) => {
        const isProcessing = processingId === q.id;
        return (
          <div
            key={q.id}
            className={`d-flex justify-content-between align-items-center p-3 rounded border ${
              q.completed ? "bg-light opacity-75" : "bg-white"
            }`}
          >
            <div className="d-flex align-items-center gap-3">
              <input
                type="checkbox"
                className="form-check-input mt-0"
                checked={q.completed}
                onChange={() => onToggleComplete(q.id)}
                disabled={isProcessing}
                id={`dsa-q-${q.id}`}
              />
              <div>
                <label
                  htmlFor={`dsa-q-${q.id}`}
                  className={`fw-semibold mb-0 ${
                    q.completed ? "text-decoration-line-through text-muted" : ""
                  }`}
                  role="button"
                >
                  {q.questionNumber && (
                    <span className="text-secondary me-1">#{q.questionNumber}</span>
                  )}
                  {q.title}
                </label>
                <div className="mt-1 d-flex gap-2 flex-wrap">
                  {q.topic && (
                    <span className="badge bg-secondary-subtle text-secondary-emphasis">
                      {q.topic}
                    </span>
                  )}
                  {q.difficulty && (
                    <span className={`badge ${difficultyBadge(q.difficulty)}`}>
                      {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                    </span>
                  )}
                  {q.notes && (
                    <span className="text-muted small ms-1" style={{ fontSize: "0.8rem" }}>
                      📝 {q.notes}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className={`btn btn-sm ${
                  q.bookmarked ? "btn-warning" : "btn-outline-warning"
                }`}
                onClick={() => onToggleBookmark(q.id)}
                disabled={isProcessing}
                title={q.bookmarked ? "Remove bookmark" : "Bookmark"}
              >
                {q.bookmarked ? "★" : "☆"}
              </button>
              <span
                className={`badge ${
                  q.completed
                    ? "bg-success"
                    : "bg-secondary-subtle text-secondary-emphasis"
                }`}
              >
                {q.completed ? "Solved" : "Pending"}
              </span>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => onDelete(q.id)}
                disabled={isProcessing}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuestionList;
