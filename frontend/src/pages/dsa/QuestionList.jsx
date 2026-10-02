const QuestionList = ({ questions, emptyMessage, onToggleComplete, onToggleBookmark, onDelete }) => {
  if (questions.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        {emptyMessage}
      </div>
    );
  }

  const difficultyBadge = (difficulty) => {
    const colors = {
      easy: "bg-success",
      medium: "bg-warning text-dark",
      hard: "bg-danger"
    };
    return colors[difficulty] || "bg-secondary";
  };

  return (
    <div className="d-flex flex-column gap-2">
      {questions.map((q) => (
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
            />
            <div>
              <span className={`fw-semibold ${q.completed ? "text-decoration-line-through text-muted" : ""}`}>
                {q.questionNumber && <span className="text-secondary me-1">#{q.questionNumber}</span>}
                {q.title}
              </span>
              <div className="mt-1 d-flex gap-2 flex-wrap">
                {q.topic && (
                  <span className="badge bg-secondary-subtle text-secondary-emphasis">{q.topic}</span>
                )}
                {q.difficulty && (
                  <span className={`badge ${difficultyBadge(q.difficulty)}`}>
                    {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className={`btn btn-sm ${q.bookmarked ? "btn-warning" : "btn-outline-warning"}`}
              onClick={() => onToggleBookmark(q.id)}
              title={q.bookmarked ? "Remove bookmark" : "Bookmark"}
            >
              {q.bookmarked ? "★" : "☆"}
            </button>
            <span className={`badge ${q.completed ? "bg-success" : "bg-secondary-subtle text-secondary-emphasis"}`}>
              {q.completed ? "Solved" : "Pending"}
            </span>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => onDelete(q.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
